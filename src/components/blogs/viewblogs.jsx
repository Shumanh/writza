"use client"

import { useEffect, useState} from "react"
import Link from 'next/link'

export function View() {
    const [errors, setErrors] = useState('')
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect( () =>{

    async function fetchBlogs() {
        try {
            const getBlogs = await fetch("/api/blogs/view", {method: "GET"})
            const data = await getBlogs.json()
            if (data?.error) setErrors(data.message) 
             else setBlogs(data?.blogs)
        } catch (error) {
            setErrors("An unexpected error occurred. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    fetchBlogs();
    },[]);
  

    
    if (loading) {
        return <div>Loading blogs...</div>
    }

    if (errors) {
        return <div style={{color: 'red'}}>Error: {errors}</div>
    }

    return (
        <div>
            <ul>
                {blogs.map((blog) => (
                    <li key={blog._id}>
                        <h3>{blog.title}</h3>
                        <p>{blog.shortDescription}</p>
                        <div>{blog.content}</div>
                        <div>{blog.tags}</div>
                       
                    </li>
                ))}
            </ul>
           



 <div className="flex justify-center mt-3">
          <Link href="/blogs/my-blogs" className="ml-1 border-b-1">
            See my blog
          </Link>
        </div>


         <div className="flex justify-center mt-3">
                  <Link href="/blogs/create" className="ml-1 border-b-1">
                    Create
                  </Link>
                </div>



            


        </div>
    )
}