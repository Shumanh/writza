"use client";
import { DeleteBlogs } from "@/components/blogs/deleteblogs";
import { AdminProtection } from "@/components/auth/admin-protection";

export default function DeleteBlogPage({ params }) {
  const { id } = params; // Next.js 13+ app router provides params

  return (
    <AdminProtection>
      <div>
        <h1>Delete Blog</h1>
        <DeleteBlogs id={id} />
      </div>
    </AdminProtection>
  );
}