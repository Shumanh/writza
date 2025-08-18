

import { dbConnect } from "@/lib/db/mongodb";
import { LoginFormSchema } from "@/lib/validation/user";
import bcrypt from 'bcrypt'
import User from "@/db/models/User";
import { NextResponse } from "next/server";


export async function POST(req) {
try{
  const body = await req.json();
  const {email,password } = body

const loginValidation = LoginFormSchema.safeParse({email,password});
if(!loginValidation.success){
  return NextResponse.json({
    message: "Validation failed",
    errors: loginValidation.error.flatten().fieldErrors
  }, {status:400})
}
await dbConnect();

  const user = await User.findOne({email});
  if(!user){
    return NextResponse.json({message:"Login failed, register first."}, {status:400})
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if(!passwordMatch){
    return NextResponse.json({message:"Invalid credentials."}, {status:400})
  }

  return NextResponse.json({
    success: true,
    message: "Login successful"
  }, {status: 200})

} catch (error) {
  return NextResponse.json({message:"Error checking password."}, {status:500})
}         

}



  
