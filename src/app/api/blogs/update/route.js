import { dbConnect } from "@/lib/db/mongodb";
import { BlogValidation } from "@/lib/validation/blog";
import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth/cookies";
import Blog from "@/models/Blog";
import User from "@/models/User";
import mongoose from "mongoose";



export async function PUT(req) {
    const verifyUser = await getUserFromCookies();

    if (verifyUser.error) {
        return NextResponse.json({ error:true,
            message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get('id');

        if (!blogId) {
            return NextResponse.json(
                { error:true,
                message : "Blog ID is required in URL parameters" }, 
                { status: 400 }
            );
        }

        const body = await req.json();

        const validatedBlog = BlogValidation.safeParse(body);

        if (!validatedBlog.success) {
            return NextResponse.json({
                message:validatedBlog.error.format()}, 
                { status: 400 });
        }

        await dbConnect();

        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return NextResponse.json(
    
                { error:true ,
                    message: "Blog not found" }, 
                { status: 404 }
            );
        }

    
        if (existingBlog.author._id.toString() !== verifyUser.data.id) {
            return NextResponse.json(
                
                { error:true,
                    message: "Forbidden: You can only update your own blogs" }, 
                { status: 403 }
            );
        }

        const {title , shortDescription , content , tags  } = validatedBlog.data;

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
              title , 
              shortDescription , 
              content , 
              tags ,
     
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('author', 'username');

        console.log(`Blog ${blogId} updated successfully by user ${verifyUser.id}`);

        return NextResponse.json({

            message: "Blog updated successfully!",
            blog: updatedBlog,
        }, { status: 200 });

    } catch (error) {
        console.error("Blog update error:", error);
        
        return NextResponse.json(
            { 
                error:true,
                message: "Internal server error" }, 
            { status: 500 }
        );
    }   
    
    }

     
    