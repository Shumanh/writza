import { dbConnect } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { BlogValidation } from "@/lib/validation/blog";
import {getUserFromCookies} from "@/lib/auth/cookies"
import User from "@/models/User";
import slugify from "slugify";
import mongoose from "mongoose";


export async function POST(req) {
  try {
    const verifyUser = await getUserFromCookies();

    if (verifyUser.error)
      return NextResponse.json({
     error : true , 
     message : "Unauthorized" },
      { status: 401 });

    const reqData = await req.json();
  
    const inputValidate = BlogValidation.safeParse(reqData);

    if (!inputValidate.success) {
      return NextResponse.json(
        {
          error:true , 
          message : inputValidate.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await dbConnect();


   const id = new mongoose.Types.ObjectId();
    const baseSlug = slugify(inputValidate.data.title , {
    replacement: '-' ,
      lower: true,
      strict:true ,
      trim:true,
      remove: /[*+~.()'"!:@]/g

    })

 const slugData = `${baseSlug}-${id}`;
 

    const blogData = {
      _id : id ,
      title: inputValidate.data.title,
      shortDescription: inputValidate.data.shortDescription,
      content: inputValidate.data.content,
      tags: inputValidate.data?.tags,
      slug : slugData ,
      author: verifyUser.data.id,
      publishedAt: new Date(),
    };

    const savedBlog = await Blog.create(blogData);
    await savedBlog.populate("author", "username");

   
    return NextResponse.json(
      {
        error:false , 
        message: "Blog created successfully!",
        blog: savedBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog creation error:", error);
  }

  return NextResponse.json(
    {
      error:true , 
      message :"Internal Server Error - Failed to create blog",
    },
    { status: 500 }
  );
}
