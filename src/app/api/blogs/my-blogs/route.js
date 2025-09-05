import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import {getUserFromCookies} from "@/lib/auth/cookies"
import User from "@/models/User";

export async function GET(){
    
    const verifiedUser = await getUserFromCookies();
    if(verifiedUser.error){
        return NextResponse.json({
         errors:"Unauthorized"}, {status:401});
    }

    try{

         await dbConnect();
         
         const myBlogs = await Blog.find({ author: verifiedUser.data.id }).populate('author' , 'username')
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