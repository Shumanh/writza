"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function View() {
  const [errors, setErrors] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const getBlogs = await fetch("/api/blogs/view", { method: "GET" });
        const data = await getBlogs.json();
        if (data?.error) setErrors(data.message);
        else setBlogs(data?.data);
      } catch (error) {
        setErrors("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading blogs...</div>;
  }

  if (errors) {
    return <div style={{ color: "red" }}>Error: {errors}</div>;
  }

  return (
    <div>
      <ul>
        {blogs.map((blogy) => (
          <li
            key={blogy._id}
            className="border border-gray-300 rounded-lg mt-4 p-4"
          >
            <Link href={`/blogs/${blogy.slug}`}>
              <div>
                <h3 className="text-xl font-semibold">{blogy.title}</h3>
                <h4 className="text-md text-white-600">{blogy.shortDescription}</h4>
                <p className="text-sm text-white-800 mt-2">{blogy.content}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};