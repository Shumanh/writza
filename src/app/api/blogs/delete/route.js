import { dbConnect } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import { Cookies } from "@/lib/auth/cookies";
import Blog from "@/models/Blog";
import User from "@/models/User";
export async function DELETE(req){

    const verifyUser = await Cookies();
    if(!verifyUser)
        return NextResponse.json({error:"Unauthorized"} , {status:401})

try{
    const getParams = new URL(req.url).searchParams;
    const blogId = getParams.get('id')
    
if(!blogId) {
    return NextResponse.json({error:"Blog ID is required"}, {status:400});
}




    await dbConnect();

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (existingBlog.author.toString() !== verifyUser.id) {
                return NextResponse.json(
                    { error: "Forbidden: You can only update your own blogs" }, 
                    { status: 403 }
                );
            }
    const result = await Blog.findByIdAndDelete(blogId);
    if(!result) {
        return NextResponse.json({error:"Blog not found"}, {status:404});
    }
    return NextResponse.json({message:"Blog deleted successfully"}, {status:200});
}



catch(error){
    console.error("Error deleting blog:", error);
return NextResponse.json({error:"Internal Server Error"}, {status:500});
}

}
