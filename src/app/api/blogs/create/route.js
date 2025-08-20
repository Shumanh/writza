import { dbConnect } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { BlogValidation } from "@/lib/validation/blog";
import slugify from "slugify";
import { Cookies } from "@/lib/auth/cookies";
import User from "@/models/User";

 export function generateUniqueSlug(title , blogId) {
    const baseSlug = slugify(title, { lower: true, strict: true });
    return `${baseSlug}-${blogId}`;
}



export async function POST(req) {
   
    try{
        const verifyUser =await Cookies();

if(!verifyUser)
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { title, shortDescription, content, tags, image } = body;

        const inputValidate = BlogValidation.safeParse({
            title,
            shortDescription,
            content,
            tags,
            image
        });

        if (!inputValidate.success) {
            return NextResponse.json(
                { 
                    error: "Validation failed",
                    errors: inputValidate.error.format(),
                },
                { status: 400 }
            );
        }

        await dbConnect();

        
        const tempSlug = slugify(inputValidate.data.title, { lower: true, strict: true });
        
        const blogData = {
           title: inputValidate.data.title,
           shortDescription: inputValidate.data.shortDescription,
           content: inputValidate.data.content,
           tags: inputValidate.data.tags,
           image: inputValidate.data.image,
           slug: tempSlug, 
           author: verifyUser.id,
           publishedAt: new Date()
        }

        const savedBlog = await Blog.create(blogData);

       
        const uniqueSlug = generateUniqueSlug(inputValidate.data.title, savedBlog._id);
        
        savedBlog.slug = uniqueSlug;
        await savedBlog.save();

        await savedBlog.populate('author', 'email');

        return NextResponse.json(
            { 
                message: "Blog created successfully!",
                blog: savedBlog,
                slug: uniqueSlug 
            }, 
            { status: 201 }
        );

    }

     catch (error) {
        console.error("Blog creation error:", error);
        
        
        }

        return NextResponse.json(
            { error: "Internal Server Error - Failed to create blog" },
            { status: 500 }
        );
    
    }
