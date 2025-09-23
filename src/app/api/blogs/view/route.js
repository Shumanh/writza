import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import View from "@/models/View";
import {getUserFromCookies} from '@/lib/auth/cookies'
import User from "@/models/User";



export async function GET(request) {
    try {
        // const user = await getUserFromCookies ();
        // if (user.error) {
        //     return NextResponse.json(
        //         { error: true, message: "User is unauthorized" },
        //         { status: 401 }
        //     );
        // }


        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (id) {
    
            const blog = await Blog.findById(id).populate('author' , 'username');
            if (!blog) {
                return NextResponse.json(
                    { error: true, message: "Blog not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                error: false,
               data : blog
            } , {status : 200});
        } else {
 
            const allBlogs = await Blog.find().populate('author' , 'username');
            return NextResponse.json({
                error: false,
                data : allBlogs
            } , {status : 200});
        }
    } catch (error) {
        console.error('Blog fetch error:', error);
        return NextResponse.json(
            { error: true, message: 'An error occurred while fetching blogs.' },
            { status: 500 }
        );
    }
}

// Increment view count for a blog
export async function POST(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: true, message: 'Missing blog id' }, { status: 400 });
        }
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.ip || '0.0.0.0';
        const userAgent = request.headers.get('user-agent') || '';

        // Check if this IP viewed recently (e.g., last 24h) to avoid multiple counts
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const already = await View.findOne({ blog: id, ip, createdAt: { $gte: since } }).select('_id');
        let updated;
        if (!already) {
            await View.create({ blog: id, ip, userAgent });
            updated = await Blog.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } },
                { new: true, runValidators: true }
            ).select('views');
        } else {
            updated = await Blog.findById(id).select('views');
        }
        if (!updated) {
            return NextResponse.json({ error: true, message: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json({ error: false, views: updated.views }, { status: 200 });
    } catch (error) {
        console.error('Increment view error:', error);
        return NextResponse.json({ error: true, message: 'Failed to increment views' }, { status: 500 });
    }
}