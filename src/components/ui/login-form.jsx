"use client"

import Link from "next/link"
import { useState } from "react"



export function LoginForm() {
  const [state,setState] = useState({errors:{},success:false})
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
  
  

  try{
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if(response.ok){
      setState({success:true,errors:{}})
      setTimeout(() => {
        window.location.href = '/blogs'
       
      }, 1000)
        } else {
      if(result.errors) {
        setState({errors: result.errors, success: false})
      } else {
        setState({errors: {global: result.message}, success: false})
      }
    }
  }catch(error){
    setState({errors:{global:'Network error. Please try again.'},success:false})
  }finally{
    setLoading(false)
  }
};



  return (
    <div className="flex h-screen">
      <div className="border w-[32%] h-[52%] m-auto bg-neutral-900 rounded-lg shadow dark:border dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-xl font-bold">Login to your account</h1>
          <p>Enter your email below to login to your account</p>
          {state?.errors?.global && (
            <p className="text-red-400 text-sm mt-2">{state.errors.global}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label>Enter your email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="me@example.com"
                className="flex p-1 border border-white w-full mt-2 rounded-lg shadow dark:border-gray-700 pl-2"
              />
              {state?.errors?.email && (
                <p className="text-red-400 text-sm mt-1">{state.errors.email[0]}</p>
              )}
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
              {state?.errors?.password && (
                <p className="text-red-400 text-sm mt-1">{state.errors.password[0]}</p>
              )}
              <div className="p-1 border border-white mt-6 rounded-lg shadow dark:border dark:border-gray-700 pl-2 text-center bg-white text-black">
                <button type="submit"
                disabled={loading}

                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
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