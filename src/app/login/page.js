"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'



export default function Login(){

const router = useRouter();

async function handleSubmit(e){
    e.preventDefault()
const formData = new FormData(e.currentTarget);
const email = formData.get('email')
const password = formData.get('password')


const response = await fetch('api/auth/login' , {
    method : 'POST' , 
    headers: { 'Content-type':'application/json'},
    body:JSON.stringify({email,password}) ,
})

if(response.ok){
    router.push('/')
}
else{
    alert('Login failed')
}

}

    return (
        <div className = " flex  h-screen">
<div className = " border- w-[32%] h-[52%] m-auto bg-neutral-900 rounded-lg shadow dark:border  dark:border-gray-700" >
    
    <div className = " p-6 ">
  
 <h1 className = " text-xl font-bold">
   Login to your account
  </h1>
  <p> Enter your email below to login to your account</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
            <label> Enter your email</label>

<input type="email" id="email" name="email" placeholder="me@example.com" className="flex p-1 border border-white w-full mt-2 rounded-lg shadow  dark:border-gray-700 pl-2" />

   <div className = "mt-4  flex justify-between mr-4">
       <label>  password</label>
    <p>Forgot your Password ?</p>
    </div>
  <input type="password" id="password" name="password"  className="flex p-1 border border-white  mt-2 rounded-lg shadow dark:border w-full dark:border-gray-700 pl-2" />
<div className=" p-1 border border-white  mt-6 rounded-lg shadow dark:border dark:border-gray-700 pl-2 text-center bg-white text-black">
     <button type="submit">Login</button>
</div>

<div className = "border mt-4  p-1 rounded-lg shadow dark:border dark:border-gray-700 text-center">
    <button > Login with Google</button>
</div>

<div className="mt-4 text-center">
    <p>
        Don't have an account? 
            <Link  href="/signup" className="ml-1 border-b-1">Sign up</Link>

        </p> 
    </div>
        </div>
      </form>        
</div>
    </div>
        </div>
    

    )
}   
 