import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
    let getAllBlogs;

    try {
        await dbConnect();
        getAllBlogs = await Blog.find({});
        return NextResponse.json(getAllBlogs, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({
            error: "Failed to fetch blogs from the database."
        }, { status: 500 });
    }
}

