import { dbConnect } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import {getUserFromCookies} from '@/lib/auth/cookies'
import Blog from "@/models/Blog";


export async function DELETE(req){
    
    const verifyUser = await getUserFromCookies();
    if(verifyUser.error)
    return NextResponse.json({error: true , 
  message: "Unauthorized"} , {status:401})

try{
    const getParams = new URL(req.url).searchParams;
    const blogId = getParams.get('id')
    
if(!blogId) {
    return NextResponse.json({error:true , 
       message: "Blog ID is required"}, {status:400});
}

    await dbConnect();

    const existingBlog = await Blog.findById(blogId).populate('author' , 'username');
    if (!existingBlog) {
        return NextResponse.json({ error: true , 
             message : "Blog not found" }, { status: 404 });
    }

    
    if (existingBlog.author._id.toString() !== verifyUser.data.id) {
                return NextResponse.json(
                    { error:true , 
                        message: "Forbidden: You can only delete your own blogs" }, 
                    { status: 403 }
                );
            }
    const result = await Blog.findByIdAndDelete(blogId);
    if(!result) {
        return NextResponse.json({error:true,
            message:"Blog not found"}, {status:404});
    }
    return NextResponse.json({message:"Blog deleted successfully"}, {status:200});
}

catch(error){
    console.error("Error deleting blog:", error);
return NextResponse.json({error: true ,
   message: "Internal Server Error"}, {status:500});
}

}
