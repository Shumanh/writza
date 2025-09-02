
import { dbConnect } from "@/lib/db/mongodb";
import { LoginFormSchema } from "@/lib/validation/user";
import bcrypt from 'bcrypt'
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/auth/jwt";

export async function POST(req) {
try{
  const userData  = await req.json();
const parsed = LoginFormSchema.safeParse(userData)

if(!parsed.success){
  return NextResponse.json({
   errors: parsed.error.flatten().fieldErrors
  }, {status:400})
}

const { email , password} = parsed.data
await dbConnect();

  const user = await User.findOne({email});
  if(!user){
    return NextResponse.json(
      {errors:{email:["Login failed, register first."]}}, 
      {status:400})
  };

  let passwordCompare =  await bcrypt.compare(password, user.password);

if (!passwordCompare) {
  return NextResponse.json(
    {errors:{password:"Invalid credentials."}},
     {status:400});
}

  const token = generateToken(user);
  
(await cookies()).set({
  name:'token',
  value: token,
  httpOnly:true,
  path:'/',
  maxAge:604800,
  sameSite:'strict',
  secure: process.env.NODE_ENV === 'production'
});


   return NextResponse.json({ success: true }, { status: 200 });

} catch (error) {
  console.error('Login error:', error);
  return NextResponse.json(
    { errors: { global: "An error occurred during login" } }, 
    { status: 500 }
  );
}
}