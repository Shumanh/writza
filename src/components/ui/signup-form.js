"use client"
import Link from "next/link"
import { useState } from "react"


export function SignupForm() {
  const [state, setState] = useState({ errors: {}, success: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        setState({ success: true, errors: {} });
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1000);
      } else {
        setState({ errors: result.message || {}, success: false });
      }
    } catch (error) {
      setState({ 
        errors: { global: 'Network error. Please try again.' }, 
        success: false 
      });
    } finally {
      setLoading(false);
    }
  };






return(

    
<div className = " w-full h-screen flex   ">   

<div className = "border w-1/3 h-[50%] m-auto rounded-md  bg-neutral-900 dark:border-gray-700 shadow ">
 <h1 className = "font-bold text-4xl text-center pt-6"> Sign up</h1>

<form onSubmit={handleSubmit} className=" ml-10 mr-10 ">

 <input 
   type="text"
    className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
    name="username"
    placeholder="Username" />
    {state?.errors?.username && (
      <p className="text-red-400 text-sm mt-1">{state.errors.username._errors[0]}</p>
    )}
   
<input
type = "text"
className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
name = "email"
placeholder = "Email" />
    {state?.errors?.email && (
      <p className="text-red-400 text-sm mt-1">{state.errors.email._errors[0]}</p>
    )}

<input
type = "password"
className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
name = "password"
placeholder="Password" />
    {state?.errors?.password && (
      <p className="text-red-400 text-sm mt-1">{state.errors.password._errors[0]}</p>
    )}

<input
 type = "password"
 className = "border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
 name = "confirmPassword"
 placeholder="Confirm Password" />
    {state?.errors?.confirmPassword && (
      <p className="text-red-400 text-sm mt-1">{state.errors.confirmPassword._errors[0]}</p>
    )}
 
  
          <button
            type="submit"
            disabled={loading}
            className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full bg-white text-black disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

{state?.success && (
  <p className="text-green-400 text-sm mt-3 text-center">Account created. Redirecting to login...</p>
)}

{state?.errors?.global && (
  <p className="text-red-400 text-sm mt-3 text-center">{state.errors.global}</p>
)}

<div className="flex justify-center mt-3">
    <p> Already have an account ? </p>
      <Link  href="/auth/login"className="ml-1 border-b-1" >Log in</Link>
</div>
 
    </form>

</div>
    
</div>
)

  
}