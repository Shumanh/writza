"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateBlogPage({ params }) {
    const [formData, setFormData] = useState({
        title: "", shortDescription: "", content: "", tags: ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Simple function to update blog
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const response = await fetch(`/api/blogs/update?id=${params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            router.push("/blogs/my-blogs");
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Title"
                required
            />
            <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                placeholder="Short Description"
                required
            />
            <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Content"
                required
            />
            <input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="Tags"
            />
            <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Blog"}
            </button>
        </form>
    );
}