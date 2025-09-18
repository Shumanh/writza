"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UnifiedRichEditor from "./unified-rich-editor";

export function UpdateBlogForm({ id }) {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [updating, setUpdating] = useState(false);

  // Editor fields (mirrors create page)
  const [titlePlain, setTitlePlain] = useState("");
  const [descriptionPlain, setDescriptionPlain] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentPlain, setContentPlain] = useState("");
  const [tagsPlain, setTagsPlain] = useState("");
  const [contentChars, setContentChars] = useState(0);

  const router = useRouter();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/view?id=${id}`);
        const data = await res.json();
        if (res.ok && data?.data) {
          const b = data.data;
          setTitlePlain(b.title || "");
          setDescriptionPlain(b.shortDescription || "");
          setContentHtml(b.content || "<p></p>");
          setContentPlain(typeof b.contentPlain === 'string' ? b.contentPlain : "");
          setTagsPlain(Array.isArray(b.tags) ? b.tags.join(", ") : (typeof b.tags === 'string' ? b.tags : (b.tags?.name || "")));

          // Restore any saved draft for this id
          const savedTitle = window.localStorage.getItem(`blog-update-title-${id}`);
          const savedDesc = window.localStorage.getItem(`blog-update-shortDescription-${id}`);
          const savedContentHtml = window.localStorage.getItem(`blog-update-content-html-${id}`);
          const savedContent = window.localStorage.getItem(`blog-update-content-${id}`);
          const savedTags = window.localStorage.getItem(`blog-update-tags-${id}`);
          if (savedTitle) setTitlePlain(savedTitle);
          if (savedDesc) setDescriptionPlain(savedDesc);
          if (savedContentHtml) setContentHtml(savedContentHtml);
          if (savedContent) setContentPlain(savedContent);
          if (savedTags) setTagsPlain(savedTags);

          if (savedContent || b.contentPlain) {
            setContentChars((savedContent || b.contentPlain || "").trim().length);
          }
        } else {
          setErrors({ general: data?.message || "Failed to fetch blog" });
        }
      } catch (e) {
        console.error(e);
        setErrors({ general: "An error occurred while fetching the blog" });
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBlog();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setUpdating(true);
    setErrors({});
    setMessage("");

    const blogData = {
      title: titlePlain.trim() || "Untitled",
      shortDescription: (descriptionPlain.trim() || "No description").slice(0, 150),
      content: contentHtml,
      tags: tagsPlain.trim() || "",
    };

    try {
      const response = await fetch(`/api/blogs/update?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Blog updated successfully!");
        // Clear update draft storage
        window.localStorage.removeItem(`blog-update-title-${id}`);
        window.localStorage.removeItem(`blog-update-shortDescription-${id}`);
        window.localStorage.removeItem(`blog-update-content-${id}`);
        window.localStorage.removeItem(`blog-update-content-html-${id}`);
        window.localStorage.removeItem(`blog-update-tags-${id}`);

        setTimeout(() => router.push("/blogs/view"), 1200);
      } else {
        setErrors(data.message || { general: "Failed to update blog" });
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div>Loading blog data...</div>;
  if (errors.general) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-red-600 mb-4">Error: {errors.general}</div>
        <a href="/blogs/view" className="text-blue-600 hover:underline">← Back to Blogs</a>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header matching create page */}
      <header className="sticky top-0 z-40 bg-white/95 supports-[backdrop-filter]:bg-white/60 backdrop-blur border-b border-gray-100 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-6">
              <h1 className="text-lg font-semibold text-gray-900">OwnTheWeb</h1>
              <span className="text-sm text-green-600">{saveStatus}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={updating || contentChars < 100}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update"}
              </button>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                S
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="relative flex flex-col h-full">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={titlePlain}
            onChange={(e) => {
              const v = e.target.value;
              setTitlePlain(v);
              setSaveStatus("Unsaved");
              window.localStorage.setItem(`blog-update-title-${id}`, v);
              setTimeout(() => setSaveStatus("Saved"), 500);
            }}
            className="w-full text-4xl text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none mb-5 flex-shrink-0 leading-[1.1111111] tracking-tight font-title"
            maxLength={50}
          />

          {/* Short Description */}
          <div className="mb-0 flex-shrink-0">
            <textarea
              placeholder="Short description (one or two sentences)"
              value={descriptionPlain}
              onChange={(e) => {
                const v = e.target.value.slice(0, 150);
                setDescriptionPlain(v);
                setSaveStatus("Unsaved");
                window.localStorage.setItem(`blog-update-shortDescription-${id}`, v);
                setTimeout(() => setSaveStatus("Saved"), 500);
              }}
              maxLength={150}
              className="w-full text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none border-none focus:outline-none focus:ring-0 short-description-textarea"
            />
            <div className="mt-2 mb-1 text-xs text-gray-500 text-right">{descriptionPlain.length}/150</div>
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600">Short Description: {errors.shortDescription[0]}</p>
            )}
          </div>

          {/* Content Editor (same as create) */}
          <div className="flex-1 min-h-0">
            <UnifiedRichEditor
              fieldType="content"
              placeholder="Edit your story..."
              initialValue={contentHtml || '<p></p>'}
              onChange={(html, plain, wordCount) => {
                setContentHtml(html);
                setContentPlain(plain);
                setContentChars(plain.trim().length);
                setSaveStatus("Unsaved");
                window.localStorage.setItem(`blog-update-content-${id}`, plain);
                window.localStorage.setItem(`blog-update-content-html-${id}`, html);
                setTimeout(() => setSaveStatus("Saved"), 500);
              }}
              minHeight="100%"
              showWordCount={false}
              enableImages={true}
              enableSlashCommands={true}
              className="border-none shadow-none text-lg leading-relaxed text-gray-800 placeholder-gray-400 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-headings:font-bold h-full"
              padding="0.5rem"
            />
          </div>

          {/* Tags */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tagsPlain}
              onChange={(e) => {
                const v = e.target.value;
                setTagsPlain(v);
                setSaveStatus("Unsaved");
                window.localStorage.setItem(`blog-update-tags-${id}`, v);
                setTimeout(() => setSaveStatus("Saved"), 500);
              }}
              className="w-full text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
            />
          </div>

          {/* Validation toast-like indicator */}
          {(errors.title || errors.content || errors.shortDescription) && (
            <div className="fixed bottom-20 right-6 bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm max-w-xs">
              {errors.title && (
                <p className="text-sm text-red-600 mb-1">Title: {errors.title[0]}</p>
              )}
              {errors.content && (
                <p className="text-sm text-red-600">Content: {errors.content[0]}</p>
              )}
              {errors.shortDescription && (
                <p className="text-sm text-red-600 mt-1">Short Description: {errors.shortDescription[0]}</p>
              )}
            </div>
          )}
        </div>

        {/* Character count indicator */}
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
          {contentChars}/100 chars
        </div>

        {/* Bottom update button removed; header button remains for submitting */}
      </main>

      {/* Toasts */}
      {errors.general && (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">Error</p>
                <p className="mt-1 text-sm text-gray-500">{errors.general}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">Success</p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
