import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/sanitization";
import { userSchema } from "@/schemas/user.schema";

// Rate limiter: 5 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  limit: 5
});

export async function POST(request) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "anonymous";
    
    try {
      await limiter.check(ip);
    } catch {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    // 2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
    
    // 2.5 Pre-sanitize inputs before validation
    if (body.username) body.username = sanitizeInput.username(body.username);
    if (body.email) body.email = sanitizeInput.email(body.email);
    // Note: We don't sanitize passwords as it might affect their complexity requirements

    // 3. Validate input with Zod
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: errors 
        },
        { status: 400 }
      );
    }

    const { username, email, password } = validation.data;

    // 4. Connect to database
    await connectToDB();

    // 5. Check for existing users (only email needs to be unique)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // 6. Create user
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by the pre-save hook
      // isVerified: false
    });

    await newUser.save();

    // 7. Return success response (no automatic login, user needs to sign in)
    return NextResponse.json(
      { 
        message: "User registered successfully. You can now sign in with your credentials.",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
