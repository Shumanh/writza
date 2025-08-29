"use client";

import Link from "next/link";
import { useState } from "react";
import {useRouter} from 'next/navigation'

export function Create() {
  const [errors, setErrors] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const blogsData = {
      title: formData.get("title"),
      shortDescription: formData.get("shortDescription"),
      content: formData.get("content"),
      tags: formData.get("tags"),
    };

    try {
      const response = await fetch("/api/blogs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogsData),
      });

      const res = await response.json();

      if (response.ok) {
        setMessage(res.message);
        setErrors("");
        setTimeout(() => {
;
}, 3000);
        e.target.reset();
        setTimeout(() => {
          router.push('/blogs/view')
        }, 2000);
      } else {
        setErrors(res.errors);
      }
    } catch (error) {
      console.log(error);
      setErrors({ global: "An unexpected error occured" });
    }
  }
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="h-full w-2/3 m-auto flex-col relative top-30 "
      >
        <h1 className="text-xl text-center font-bold">
          Welcome to the Asyncrohonous Blogging Site , Create a post from here
        </h1>

        <input
          type="text"
          className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
          name="title"
          placeholder="Enter your Title"
        />
        {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}

        <input
          type="text"
          className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
          name="shortDescription"
          placeholder="Describe in short"
        />
        {errors.shortDescription && (
          <p className="text-red-500 mt-1">{errors.shortDescription}</p>
        )}

        <input
          type="text"
          className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full h-60 flex "
          name="content"
          placeholder="Content"
        />
        {errors.content && (
          <p className="text-red-500 mt-1">{errors.content}</p>
        )}

        <input
          type="text"
          className="border p-2 rounded-md dark:border-gray-700 shadow-2xl mt-4 w-full"
          name="tags"
          placeholder="tags"
        />

        <div className="w-full  text-center">
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white  rounded-md  "
          >
            Submit Blog
          </button>
        </div>

       
        {errors.global && (
          <div className="mt-4 p-2 bg-red-500 text-white rounded-md">
            {errors.global}
          </div>
        )}

        {message && (
          <div className="mt-4 p-2 bg-green-500 text-white rounded-md">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}