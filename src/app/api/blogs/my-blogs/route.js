import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { Cookies } from "@/lib/auth/cookies";


export async function GET(){
    
    const verifiedUser = await Cookies();
    if(!verifiedUser){
        return NextResponse.json({
         errors:"Unauthorized"}, {status:401});
    }

    try{

         await dbConnect();
         const myBlogs = await Blog.find({ author: verifiedUser.id });
           if(!myBlogs){
            return NextResponse.json(

                {errors : " Blogs couldnot find" } , {status : 200}
            )
        }
         return NextResponse.json (
         { blogs : myBlogs}, { status: 200 });

      

    }
    catch(error){
        console.error("Error fetching user's blogs:", error);
        return NextResponse.json({
            errors :"Internal Server Error"}, {status:500});
    }


}