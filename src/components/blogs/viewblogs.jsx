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
                        <Link href={`/blogs/${blog.slug}`}>
                            <div style={{ cursor: "pointer", padding: "1rem", border: "1px solid #eee", margin: "0.5rem 0" }}>
                                <h3>{blog.title}</h3>
                                <p>{blog.shortDescription}</p>
                                <div>{blog.content}</div>
                                <div>{blog.tags}</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}