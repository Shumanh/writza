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
        return NextResponse.json(allBlogs, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({
            error:true,
            message: "Failed to fetch blogs from the database."
        }, { status: 500 });
    }
}



