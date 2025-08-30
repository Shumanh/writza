"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteBlogs({ id }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return; 

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/blogs/delete?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Blog deleted successfully!");

        setTimeout(() => router.push("/blogs/my-blogs"), 2000); 
      } else {
        setMessage(data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("An error occurred while deleting the blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Are you sure you want to delete this blog?</p>
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Deleting..." : "Confirm Delete"}
      </button>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}