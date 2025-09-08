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

        { error : true , 
          message : parsed.error.flatten().fieldErrors},   { status: 400 }
      );
    }
const {username , email , password , role } = parsed.data;

    await dbConnect();

    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return NextResponse.json(
        { error : true,
          message : { email: ["Email is already registered"] }},
        { status: 400 }
      );
    }
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
      return NextResponse.json(
        { error : true , 
          message : { username: ["Username is already taken"] }},
        { status: 400 }
      );
    }

    const newUser = new User({ username, email, password , role});
    await newUser.save();

    return NextResponse.json({ error: false  , 
        message : " User created Successfully"
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error : true ,
       message : { global: 'An error occurred while creating account.' } },
      { status: 500 }
    );
  }
}