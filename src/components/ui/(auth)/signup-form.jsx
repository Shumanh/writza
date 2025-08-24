"use client"
import Link from "next/link"
import { useState } from "react"


export  async  function SignupForm(e) {

  e.preventDefault()

  const formData = new FormData(e.target);

  const userData = {
username : formData.get('username') ,
  email : formData.get("email") , 
  password : formData.get("password") , 
  confirmPassword : formData.get('confirmpassword')
  }
  

try {
  const response =  await fetch('/api/auth/signup', {
method:"POST" , 
headers : {
"Content-Type":"application/json",
},
body: JSON.stringify(userData)
  })
}

catch(error){

}




return(

    
<div className = " w-full h-screen flex   ">   

<div className = "border w-1/3 h-[50%] m-auto rounded-md  bg-neutral-900 dark:border-gray-700 shadow ">
 <h1 className = "font-bold text-4xl text-center pt-6"> Sign up</h1>

<form  className=" ml-10 mr-10 ">

 <input 
   type="text"
    className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
    name="username"
    placeholder="Username" />
    
   
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
 name = "confirmPassword"
 placeholder="Confirm Password" />
    
  
          <button>
            Create Account
          </button>



<div className="flex justify-center mt-3">
    <p> Already have an account ? </p>
      <Link  href="/auth/login"className="ml-1 border-b-1" >Log in</Link>
</div>
 
    </form>

</div>
    
</div>
)

  
}