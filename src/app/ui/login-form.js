"use client"

import Link from "next/link"
import { Login } from "../actions/login"
import { useActionState, useEffect } from "react"

export function LoginForm() {
  const initialState = { errors: {}, success: false, message: "" }
  const [state, formAction] = useActionState(Login, initialState)

  useEffect(() => {
    if (state?.success) {
      window.location.href = '/'
    }
  }, [state?.success])

  return (
    <div className="flex h-screen">
      <div className="border w-[32%] h-[52%] m-auto bg-neutral-900 rounded-lg shadow dark:border dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-xl font-bold">Login to your account</h1>
          <p>Enter your email below to login to your account</p>
          {state?.message && (
            <p className="text-red-400 text-sm mt-2">{state.message}</p>
          )}
          <form action={formAction}>
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
                <button type="submit">Login</button>
              </div>
              <div className="border mt-4 p-1 rounded-lg shadow dark:border dark:border-gray-700 text-center">
                <button type="button">Login with Google</button>
              </div>
              <div className="mt-4 text-center">
                <p>
                  Don't have an account?
                  <Link href="/signup" className="ml-1 border-b-1">Sign up</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


