import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { Cookies } from "@/lib/auth/cookies";

export async function GET() {

    try {
        const user = await Cookies();
if(!user){
    return NextResponse.json(
        { error: true , 
            message : "User is unauthorized"
 }, { status: 401 });
}
        await dbConnect();
        const allBlogs = await Blog.find({});
        return NextResponse.json({error:false,blogs:allBlogs});
    } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { errors: { global: 'An error occurred while creating account.' } },
      { status: 500 }
    );
  }
}

    
