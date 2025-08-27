"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation';


export function LoginForm() {

  const [message , setMessage] = useState('')
  const [errors , setErrors] = useState('')
 

  const router = useRouter()

async function handleSubmit (e){

e.preventDefault()
setErrors('')
setMessage('')


const formData = new FormData(e.target)

const userData = {
  email: formData.get("email") , 
  password : formData.get("password")
}

try{

const response = await fetch("/api/auth/login" , {
  method:"POST" , 
headers:{
  "Content-Type" : "application/json"
} , 
body:JSON.stringify(userData)
})

const res = await response.json()
console.log(res)

if(response.ok){
setMessage("Login sucessful...!!")
setTimeout(()=>{
router.push('/blogs/view')
 } , 1000)
}else{
  setErrors(res.errors)
}

}

catch(error){
 console.log(error)
   setErrors( {global : error.message || "An unexpected error occurred"})

}

}


  return (
    <div className="flex h-screen">
      <div className="border w-[32%] h-[52%] m-auto bg-neutral-900 rounded-lg shadow dark:border dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-xl font-bold">Login to your account</h1>
          <p>Enter your email below to login to your account</p>

          
          
          <form onSubmit={handleSubmit}>

 {errors.global && <div className="mt-4 p-2 bg-red-500 text-white rounded-md">{errors.global}</div>}




            <div className="mt-4">
              <label>Enter your email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="me@example.com"
                className="flex p-1 border border-white w-full mt-2 rounded-lg shadow dark:border-gray-700 pl-2"
              />
                {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}

             
              <div className="mt-4 flex justify-between mr-4">
                <label>password</label>
                <p>Forgot your Password?</p>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="flex p-1 border border-white mt-2 rounded-lg shadow dark:border w-full dark:border-gray-700 pl-2"
              />
               {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
            
              
              <div className="p-1 border border-white mt-6 rounded-lg shadow dark:border dark:border-gray-700 pl-2 text-center bg-white text-black">
                <button type="submit">
                Login 
                </button>

            {message && <div className="mt-4 p-2 bg-green-500 text-white rounded-md">{message}</div>}

              </div>
              <div className="border mt-4 p-1 rounded-lg shadow dark:border dark:border-gray-700 text-center">
                <button type="button">Login with Google</button>
              </div>
              <div className="mt-4 text-center">
                <p>
                  Don't have an account?
                  <Link href="/auth/signup" className="ml-1 border-b-1">Sign up</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}