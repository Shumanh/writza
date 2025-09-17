import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import Blog from "@/models/Blog";

export async function POST(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: true, message: 'Missing blog id' }, { status: 400 });
    }
    const updated = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likesCount: 1 } },
      { new: true, runValidators: true }
    ).select('likesCount');
    if (!updated) {
      return NextResponse.json({ error: true, message: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ error: false, likesCount: updated.likesCount }, { status: 200 });
  } catch (error) {
    console.error('Increment like error:', error);
    return NextResponse.json({ error: true, message: 'Failed to increment likes' }, { status: 500 });
  }
}
