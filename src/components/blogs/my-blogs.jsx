"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Myblogs() {
  const [errors, setErrors] = useState("");
  const [blog, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getMyBlogs() {
    try { 
      const myBlogs = await fetch('/api/blogs/my-blogs', {method: "GET"})
      const data = await myBlogs.json();
      if (!myBlogs.ok) {
        setErrors(data.errors)
      } else {
        setBlogs(data.blogs)
      }
    } catch(error) {
      console.error("errors", error)
      setErrors("An unexpected error occurred. Please try again later.")
    } finally { 
      setLoading(false)
    }
  }

  useEffect(() => {
    getMyBlogs()
  }, [])

  if (loading) 
    return <div>Loading your blogs...</div>

  if (errors) {
    return <div style={{color: 'red'}}>Error: {errors}</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Blogs</h2>
      <ul>
        {blog.map((blog) => (
          <li key={blog._id}>
            <Link href={`/blogs/${blog.slug}`}>
              <div style={{ 
                cursor: "pointer", 
                padding: "1rem", 
                border: "1px solid #eee", 
                margin: "0.5rem 0",
                borderRadius: "8px"
              }}>
                <h3 className="font-bold text-lg">{blog.title}</h3>
                <p className=" mt-2">{blog.shortDescription}</p>
                <div className=" mt-3">{blog.content}</div>
                <div className="text-sm0 mt-2">Tags: {blog.tags}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
