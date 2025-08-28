"use client";

import { useState , useEffect } from "react";

export function Myblogs() {
  const [errors, setErrors] = useState("");
  const [blog , setBlogs] = useState("")
  const [loading, setLoading] = useState(true);


  async function getMyBlogs() {

    try { 
    const myBlogs = await fetch ('/api/blogs/my-blogs' , {method: "GET"})
    const data = await myBlogs.json();
    if (!myBlogs.ok){
setErrors(data.errors)
    }
    else{
      setBlogs(data.blogs)
    }
  
    }
    catch(error){
console.error("errors" , error)
       setErrors("An unexpected error occurred. Please try again later.")
    }
finally { 
  setLoading(false)
}
  }

  useEffect( ()=>{
getMyBlogs()
  } , [])

if(loading )
  return  <div>.....loading blogs</div>

  if (errors) {
        return <div style={{color: 'red'}}>Error: {errors}</div>
    }

    return (
        <div>
            <ul>
                {blog.map((blog) => (
                    <li key={blog._id}>
                        <h3>{blog.title}</h3>
                        <p>{blog.shortDescription}</p>
                        <div>{blog.content}</div>
                        <div>{blog.tags}</div>
                       
                    </li>
                ))}
            </ul>
        </div>
    )
}
