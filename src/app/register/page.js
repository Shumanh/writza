"use client"
import Link from "next/link"

export default function register(){
    return (
<div className = " w-full h-screen flex   ">   

<div className = "border w-1/3 h-[50%] m-auto rounded-md  bg-neutral-900 dark:border-gray-700 shadow ">
 <h1 className = "font-bold text-4xl text-center pt-6"> Sign up</h1>

<form className=" ml-10 mr-10   ">

 <input 
   type="text"
    className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
    name="fullname"
    placeholder="Full Name" />
   
<input
type = "text"
className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
name = "email"
placeholder = "Email" />

<input
type = "password"
className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
name = "password"
placeholder="Password" />

<input
type = "password"
className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
name = "Confirm password"
placeholder="Confirm Password" />
 
<button
type="submit"
className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full bg-white text-black">
    Create Account
</button>

<div className="flex justify-center mt-3">
    <p> Already have an account ? </p>
      <Link  href="/login"className="ml-1 border-b-1" >Log in</Link>
</div>
 
    </form>

</div>
    
</div>


    )
}