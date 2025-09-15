"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';



export function Create() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleHtml, setTitleHtml] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [tagsHtml, setTagsHtml] = useState("");
  const [contentChars, setContentChars] = useState(0);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const blogsData = {
      title: titleHtml.replace(/<[^>]*>/g, "").trim() || "Untitled",
      shortDescription: descriptionHtml.replace(/<[^>]*>/g, "").trim() || "No description",
      content: contentHtml,
      tags: tagsHtml.replace(/<[^>]*>/g, "").trim() || "",
    };

    try {
      const response = await fetch("/api/blogs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogsData),
      });

      const data = await response.json();

      if (data.error === false) {
        setMessage(data.message);
        setErrors("");
        setTimeout(() => {
      
        }, 3000);
        e.target.reset();
    
        setTimeout(() => {
          router.push('/blogs/view')
        }, 2000);
      } else {
        setErrors(data.message);
      }
    } catch (error) {
      console.log(error);
      setErrors({ global: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Writza</h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Draft
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`text-sm font-medium ${contentChars < 100 ? "text-red-500" : "text-green-600"}`}>
                {contentChars >= 100 ? "✓" : `${contentChars}/100 chars`}
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || contentChars < 100}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  "Publish Article"
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Title Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Article Title
              </label>
              <div className="text-3xl font-bold">
                <InlineEditor
                  placeholder="Enter your article title..."
                  onChange={setTitleHtml}
                  className="text-3xl font-bold border-none shadow-none"
                />
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title[0]}</p>
              )}
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Short Description
              </label>
              <InlineEditor
                placeholder="Write a brief description that summarizes your article..."
                onChange={setDescriptionHtml}
                className="text-lg"
              />
              {errors.shortDescription && (
                <p className="mt-2 text-sm text-red-600">{errors.shortDescription[0]}</p>
              )}
            </div>

            {/* Content Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Article Content
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <NovelEditor onChange={(html) => {
                  setContentHtml(html);
                  const plain = html.replace(/<[^>]*>/g, "");
                  setContentChars(plain.trim().length);
                }} />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Use the rich text editor above. Type "/" for quick commands, drag & drop images, and format your content.
              </p>
              {errors.content && (
                <p className="mt-2 text-sm text-red-600">{errors.content[0]}</p>
              )}
            </div>

            {/* Tags Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tags (Optional)
              </label>
              <InlineEditor
                placeholder="Add tags to help readers find your article..."
                onChange={setTagsHtml}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your article will be saved automatically
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={loading || contentChars < 100}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Toast Notifications */}
      {errors.global && (
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
                <p className="mt-1 text-sm text-gray-500">{errors.global}</p>
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


