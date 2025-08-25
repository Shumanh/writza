import { NextResponse } from "next/server";
import { UserformSchema } from '@/lib/validation/user';
import User from '@/models/User';
import { dbConnect } from '@/lib/db/mongodb';

export async function POST(req) {
  try {
    const userData = await req.json();

    const parsed = UserformSchema.safeParse(userData);

    if (!parsed.success) { 
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors},   { status: 400 }
      );
    }
const {username , email , password } = parsed.data;


    await dbConnect();

    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return NextResponse.json(
        { errors: { email: ["Email is already registered"] }},
        { status: 400 }
      );
    }
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
      return NextResponse.json(
        { errors: { username: ["Username is already taken"] }},
        { status: 400 }
      );
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { errors: { global: 'An error occurred while creating account.' } },
      { status: 500 }
    );
  }
}