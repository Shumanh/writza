"use client"
import {useState , useEffect} from "react"
import Link from "next/link";

 export function IndividualBlog({id})
 {
  const[blog , setBlog] = useState(null)
  const [error , setError] = useState('')
const [loading ,setLoading ] = useState(true)

async function getBlog(){

  try{ 
     const response = await fetch(`/api/blogs/view?id=${id}` ,{method : "GET"})

    const data = await response.json()
    
    if(response.ok){
      setBlog(data.blog)
    }
    else{
      setError(data.message || "Failed to fetch the blogs")
    }

  }

catch(error){
console.error("getblogerror", error)
    setError('An error occurred while fetching the blog')
} finally { 
  setLoading(false)
}

}

useEffect(() => {
    if (id) {
      getBlog()
    }
  }, [id])

if (loading){
  return <div>loading.....</div>
}
  if (error){
     return <div>Error: {error}</div>
  }
  
  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.shortDescription}</p>
      <div>{blog.content}</div>
      <div>{blog.tags}</div>


  <div className = " flex ">
      {blog.canEdit &&   (
        <div style={{ marginTop: "1rem" }}>
          <Link
            href={`/blogs/update/${blog._id}`}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "0.5rem 1rem",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block"
            }}
          >
            Update
          </Link>
        </div>
      )}

      {blog.canDelete &&   (
        <div style={{ marginTop: "1rem" }}>
          <Link
            href={`/blogs/delete/${blog._id}`}
            className = "ml-4"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "0.5rem 1rem",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
           Delete
          </Link>
        </div>
      )}
      </div>
    </div>
  )
}