"use client"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { Signup } from "../actions/signup"

export  function SignupForm(){
    const initialState = { errors: {}, success: false }
    const [state, formAction] = useActionState( Signup, initialState)
    useEffect(() => {
      if (state?.success) {
        window.location.href = '/login'
      }
    }, [state?.success])

    return (
    
<div className = " w-full h-screen flex   ">   

<div className = "border w-1/3 h-[50%] m-auto rounded-md  bg-neutral-900 dark:border-gray-700 shadow ">
 <h1 className = "font-bold text-4xl text-center pt-6"> Sign up</h1>

<form action={formAction}

className=" ml-10 mr-10 ">

 <input 
   type="text"
    className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
    name="username"
    placeholder="Username" />
    {state?.errors?.username && (
      <p className="text-red-400 text-sm mt-1">{state.errors.username[0]}</p>
    )}
   
<input
type = "text"
className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
name = "email"
placeholder = "Email" />
    {state?.errors?.email && (
      <p className="text-red-400 text-sm mt-1">{state.errors.email[0]}</p>
    )}

<input
type = "password"
className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
name = "password"
placeholder="Password" />
    {state?.errors?.password && (
      <p className="text-red-400 text-sm mt-1">{state.errors.password[0]}</p>
    )}

<input
 type = "password"
 className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
 name = "confirmPassword"
 placeholder="Confirm Password" />
    {state?.errors?.confirmPassword && (
      <p className="text-red-400 text-sm mt-1">{state.errors.confirmPassword[0]}</p>
    )}
 
<button
type="submit"
className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full bg-white text-black">
    Create Account
</button>

{state?.success && (
  <p className="text-green-400 text-sm mt-3 text-center">Account created. Redirecting to login...</p>
)}

{state?.errors?.global && (
  <p className="text-red-400 text-sm mt-3 text-center">{state.errors.global}</p>
)}

<div className="flex justify-center mt-3">
    <p> Already have an account ? </p>
      <Link  href="/login"className="ml-1 border-b-1" >Log in</Link>
</div>
 
    </form>

</div>
    
</div>


    )
}