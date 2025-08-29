import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { Cookies } from "@/lib/auth/cookies";

export async function GET(request) {
    try {
        const user = await Cookies();
        if (!user) {
            return NextResponse.json(
                { error: true, message: "User is unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (id) {
    
            const blog = await Blog.findById(id);
            if (!blog) {
                return NextResponse.json(
                    { error: true, message: "Blog not found" },
                    { status: 404 }
                );
            }

    
            const blogData = blog.toObject();

            const isOwner = blog.author.toString() === user.id;

            const blogWithEditPermission = {
                ...blogData, 
                canEdit: isOwner , 

                canDelete:isOwner     
            };

   
            return NextResponse.json({
                error: false,
                blog: blogWithEditPermission
            });
        } else {
 
            const allBlogs = await Blog.find({});
            const blogsWithEditPermissions = allBlogs.map(blog => {
        
                const blogData = blog.toObject();
                const isOwner = blog.author.toString() === user.id;


                return {
                    ...blogData,     
                    canEdit: isOwner ,  
                     
                    canDelete:isOwner
                };
            });

            
            return NextResponse.json({
                error: false,
                blogs: blogsWithEditPermissions
            });
        }
    } catch (error) {
        console.error('Blog fetch error:', error);
        return NextResponse.json(
            { error: true, message: 'An error occurred while fetching blogs.' },
            { status: 500 }
        );
    }
}