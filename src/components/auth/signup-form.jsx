"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(e.target);

    const userData = {
      username: formData.get("username").trim(),
      email: formData.get("email").trim(),
      password: formData.get("password").trim(),
      confirmPassword: formData.get("confirmPassword").trim(),
    };

    const url = "/api/auth/signup";
    const options = { method: "POST", headers: { accept: "application/json" }, body: JSON.stringify(userData) };

    try {
      const response = await fetch(url, options);

      const data = await response.json();

      if (data.error === false) {
        setMessage(data.message);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      } else {
        setErrors(data.message || { global: "Something went wrong" });
      }
    } catch (error) {
      setErrors({ global: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md bg-neutral-900 border border-gray-800 rounded-2xl p-8 shadow-lg">
        <h2 className="text-white text-2xl font-semibold">Create an account</h2>
        <p className="text-gray-400 text-sm mt-1">Enter your details to create a new account</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errors.global && <div className="p-2 bg-red-600 text-white rounded-md">{errors.global}</div>}

          <div>
            <label className="text-gray-300 text-sm">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="mt-2 w-full rounded-lg border border-gray-700 bg-transparent px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="m@example.com"
              className="mt-2 w-full rounded-lg border border-gray-700 bg-transparent px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="mt-2 w-full rounded-lg border border-gray-700 bg-transparent px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="mt-2 w-full rounded-lg border border-gray-700 bg-transparent px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword[0]}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-white text-black py-3 font-medium hover:opacity-95 transition"
            >
              {loading ? "Creating Account" : "Create Account"}
            </button>
          </div>

          <div>
            <button
              type="button"
              className="w-full rounded-lg border border-gray-700 text-gray-200 py-3 mt-2 flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 transition"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.3 0 6 1.2 8.2 3.1l6.1-6.1C34 3.4 29.4 1 24 1 14 1 5.9 7.6 2.6 16.9l7.4 5.7C11.9 15 17.5 9.5 24 9.5z"
                />
              </svg>
              <span className="text-sm">Login with Google</span>
            </button>
          </div>

          {message && <div className="mt-2 p-2 bg-green-600 text-white rounded-md">{message}</div>}

          <div className="text-center text-gray-400 text-sm mt-3">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
