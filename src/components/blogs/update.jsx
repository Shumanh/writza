"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UpdateBlogForm({ id }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/view?id=${id}`);
        const data = await response.json();

        if (response.ok) {
          setBlog(data.blog);
        } else {
          setErrors({ general: data.message || "Failed to fetch blog" });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setErrors({ general: "An error occurred while fetching the blog" });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBlog();
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setUpdating(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(e.target);
    const blogData = {
      title: formData.get("title"),
      shortDescription: formData.get("shortDescription"),
      content: formData.get("content"),
      tags: formData.get("tags"),
    };

    try {
      const response = await fetch(`/api/blogs/update?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Blog updated successfully!");
        setTimeout(() => {
          router.push("/blogs/view");
        }, 2000);
      } else {
        if (data.message) {
      
          setErrors(data.message);
        } else {
          setErrors({ general: data.message || "Failed to update blog" });
        }
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <div>Loading blog data...</div>;
  }

  if (errors.general) {
    return (
      <div>
        <div style={{ color: "red", marginBottom: "1rem" }}>
          Error: {errors.general}
        </div>
        <Link href="/blogs/view">← Back to Blogs</Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div>
        <div style={{ color: "red", marginBottom: "1rem" }}>
          Blog not found
        </div>
        <Link href="/blogs/view">← Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/blogs/view">← Back to Blogs</Link>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Update Blog Post
        </h1>

        <div>
          <input
            type="text"
            name="title"
            defaultValue={blog.title}
            placeholder="Enter your Title"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
            required
          />
          {errors.title && (
            <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.title}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="shortDescription"
            defaultValue={blog.shortDescription}
            placeholder="Describe in short"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
            required
          />
          {errors.shortDescription && (
            <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.shortDescription}</p>
          )}
        </div>

        <div>
          <textarea
            name="content"
            defaultValue={blog.content}
            placeholder="Content"
            rows={10}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
              resize: "vertical"
            }}
            required
          />
          {errors.content && (
            <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.content}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="tags"
            defaultValue={blog.tags}
            placeholder="Tags (comma separated)"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            type="submit"
            disabled={updating}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: updating ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: updating ? "not-allowed" : "pointer"
            }}
          >
            {updating ? "Updating..." : "Update Blog"}
          </button>
        </div>

        {errors.general && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "4px",
              textAlign: "center"
            }}
          >
            {errors.general}
          </div>
        )}

        {message && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "4px",
              textAlign: "center"
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
