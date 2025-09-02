"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { headers } from "next/headers"

export function SignupForm() {
  
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [loading ,setLoading] = useState(false)
  const router = useRouter()


  async function handleSubmit(e){
    e.preventDefault()

    setLoading(true)
    setErrors({})
    setMessage('')

    const formData = new FormData(e.target);

    const userData = {
      username: formData.get('username').trim(),
      email: formData.get("email").trim(), 
      password: formData.get("password").trim(), 
      confirmPassword: formData.get('confirmPassword').trim()
    }


    const url = '/api/auth/signup'
    const options = {method : "POST" , headers : {accept:"application/json" , body:JSON.stringify(userData)}}

    try {
      const response = await fetch(url , options)

      const data = await response.json();

      if(data.error===false){
        setMessage(data.message)
        setTimeout(() => {
          router.push('/auth/login')
        }, 1000)
      }
      else{
          setErrors(data.message || { global: "Something went wrong" })
      }
    }
    catch(error){
      setErrors({global: "Network error. Please try again."})
    }
    finally{
      setLoading(false)
    }
  }

  return(
    <div className="w-full h-screen flex">   

      <div className="border w-1/3 h-[50%] m-auto rounded-md bg-neutral-900 dark:border-gray-700 shadow">
        <h1 className="font-bold text-4xl text-center pt-6"> Sign up</h1>

        <form onSubmit={handleSubmit} className="ml-10 mr-10">
          {errors.global && <div className="mt-4 p-2 bg-red-500 text-white rounded-md">{errors.global}</div>}

          <input 
            type="text"
            className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
            name="username"
            placeholder="Username"
          />
          {errors.username && <p className="text-red-500">{errors.username[0]}</p>} 
            
          <input
            type="email"
            className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
            name="email"
            placeholder="Email" />
          {errors.email && <p className="text-red-500">{errors.email[0]}</p>} 
            
          <input
            type="password"
            className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
            name="password"
            placeholder="Password" />
          {errors.password && <p className="text-red-500">{errors.password[0]}</p>} 
          
          <input
            type="password"
            className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
            name="confirmPassword"
            placeholder="Confirm Password" />

          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword[0]}</p>} 
          
            <div className = "w-full  text-center">

   <button type="submit" className="mt-4 p-2 bg-blue-500 text-white  rounded-md  ">
           {loading ? "Creating Account" : "Create Account"}

    </button>
 
 </div>

      {message && <div className="mt-4 p-2 bg-green-500 text-white rounded-md">{message}</div>}

          <div className="flex justify-center mt-3">
            <p> Already have an account ? </p>
            <Link href="/auth/login" className="ml-1 border-b-1">Log in</Link> 
          </div>
         
        </form>

      </div>
        
    </div>
  )
}