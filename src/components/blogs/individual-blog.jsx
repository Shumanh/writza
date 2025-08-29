"use client"
import {useState , useEffect} from "react"

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
      <div>{blog.slugs}</div>
    </div>
  )
}