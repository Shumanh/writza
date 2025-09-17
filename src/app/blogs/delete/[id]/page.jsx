"use client";
import { DeleteBlogs } from "@/components/blogs/deleteblogs";

export default function DeleteBlogPage({ params }) {
  const { id } = params; // Next.js 13+ app router provides params

  return (
    <DeleteBlogs id={id} />
  );
}
