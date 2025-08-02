import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the verification token
    const verificationToken = await VerificationToken.findOne({
      token,
      type: "email",
      expires: { $gt: new Date() }
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user as verified
    const user = await User.findById(verificationToken.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    user.isVerified = true;
    await user.save();

    // Delete the used token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    return NextResponse.json({
      message: "Email verified successfully",
      success: true
    });

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}