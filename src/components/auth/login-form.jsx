"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.target);

    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const url = "/api/auth/login";
    const options = { method: "POST", headers: { accept: "application/json" }, body: JSON.stringify(userData) };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.error === false) {
        setMessage(data.message);
        setTimeout(() => {
          router.push("/blogs/view");
        }, 1000);
      } else {
        setErrors(data.message || { global: "Something went wrong" });
      }
    } catch (error) {
      // no-op
      setErrors({ global: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-lg border border-gray-800 p-6">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-white">Login to your account</h1>
        <p className="text-sm text-gray-400 mb-6">Enter your email below to login to your account</p>

        <form onSubmit={handleSubmit}>
          {errors.global && <div className="mt-2 p-2 bg-red-600 text-white rounded-md">{errors.global}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="m@example.com"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email[0]}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <Link href="#" className="text-sm text-gray-400 hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password[0]}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-white text-black font-medium hover:brightness-95 transition"
              >
                {loading ? "Logging in ..." : "Login"}
              </button>

              {message && <div className="mt-4 p-2 bg-green-600 text-white rounded-md text-center">{message}</div>}
            </div>

            <div>
              <button
                type="button"
                className="w-full py-3 rounded-lg border border-gray-700 text-gray-200 bg-neutral-900 hover:bg-neutral-800 transition"
              >
                Login with Google
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-white underline ml-1">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
