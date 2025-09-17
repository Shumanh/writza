"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import UnifiedRichEditor from "./unified-rich-editor";
import TagsModal from "@/components/ui/TagsModal";

export default function Create() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  
  const [titlePlain, setTitlePlain] = useState("");
  const [descriptionPlain, setDescriptionPlain] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentPlain, setContentPlain] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [tagsPlain, setTagsPlain] = useState("");
  const [contentChars, setContentChars] = useState(0);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();
  
  // Load saved content when component mounts
  useEffect(() => {
    try {
      const savedTitle = window.localStorage.getItem("blog-title");
      const savedDescription = window.localStorage.getItem("blog-description");
      const savedContent = window.localStorage.getItem("blog-content");
      const savedContentHtml = window.localStorage.getItem("blog-content-html");
      const savedTags = window.localStorage.getItem("blog-tags");
      
      if (savedTitle) setTitlePlain(savedTitle);
      if (savedDescription) setDescriptionPlain(savedDescription);
      if (savedContent) setContentPlain(savedContent);
      if (savedContentHtml) setContentHtml(savedContentHtml);
      if (savedTags) setTagsPlain(savedTags);
      
      // Update derived values
      if (savedContent) setContentChars(savedContent.trim().length);
    } catch (_error) {}
  }, []);

  // Mark draft as loaded once localStorage read attempt is done
  useEffect(() => {
    setDraftLoaded(true);
  }, []);

  async function submitWithTags(finalTags) {
    setPublishing(true);
    const blogsData = {
      title: titlePlain.trim() || "Untitled",
      shortDescription: (descriptionPlain.trim() || "No description").slice(0, 150),
      content: contentHtml,
      tags: (finalTags ?? tagsPlain).trim() || "",
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
        setTitlePlain("");
        setDescriptionPlain("");
        setContentHtml("");
        setContentPlain("");
        setTagsPlain("");
        setContentChars(0);
        
        // Clear localStorage after successful submission
        window.localStorage.removeItem("blog-title");
        window.localStorage.removeItem("blog-description");
        window.localStorage.removeItem("blog-content");
        window.localStorage.removeItem("blog-content-html");
        window.localStorage.removeItem("blog-tags");
        
        setTimeout(() => {
          setTagsModalOpen(false);
          router.push('/blogs/view')
        }, 1000);
      } else {
        setErrors(data.message);
      }
    } catch (_error) {
      setErrors({ global: "An unexpected error occurred" });
    } finally {
      setPublishing(false);
    }
  }

  function openTagsModalBeforePublish(e) {
    if (e) e.preventDefault();
    // open modal; user confirms with tags -> submitWithTags
    setTagsModalOpen(true);
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Minimal Header - Just essentials */}
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
                onClick={openTagsModalBeforePublish}
                disabled={publishing || contentChars < 100}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? "Publishing..." : "Publish"}
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
          {/* Seamless Title + Content Writing Flow */}
          <div className="flex flex-col h-full">
            {/* Title Field - Seamlessly integrated */}
            <input
              type="text"
              placeholder="Title"
              value={titlePlain}
              onChange={(e) => {
                const value = e.target.value;
                setTitlePlain(value);
                setSaveStatus("Unsaved");
                
                // Save to localStorage
                window.localStorage.setItem("blog-title", value);
                
                // Auto-populate description from content if available
                if (!descriptionPlain && contentPlain.trim()) {
                  const excerpt = contentPlain.substring(0, 150);
                  setDescriptionPlain(excerpt);
                  window.localStorage.setItem("blog-description", excerpt);
                }
                
                // Debounced save status update
                setTimeout(() => setSaveStatus("Saved"), 500);
              }}
              className="w-full text-4xl text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none mb-5 flex-shrink-0 leading-[1.1111111] tracking-tight font-title"
              style={{ fontFamily: 'inherit' }}
              maxLength="50"
            />

            {/* Short Description Field */}
            <div className="mb-0 flex-shrink-0">
              <textarea
                placeholder="Short description (one or two sentences)"
                value={descriptionPlain}
                onChange={(e) => {
                  const v = e.target.value.slice(0, 150);
                  setDescriptionPlain(v);
                  setSaveStatus("Unsaved");
                  
                  // Save to localStorage
                  window.localStorage.setItem("blog-description", v);
                  
                  // Debounced save status update
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

            {/* Content Editor - Flows directly from title */}
            <div className="flex-1 min-h-0">
              {draftLoaded && (
                <UnifiedRichEditor
                  fieldType="content"
                  placeholder="Tell your story..."
                  initialValue={contentHtml || '<p></p>'}
                  onChange={(html, plain, wordCount) => {
                  setContentHtml(html);
                  setContentPlain(plain);
                  setContentChars(plain.trim().length);
                  setSaveStatus("Unsaved");
                  
                  // Save to localStorage
                  window.localStorage.setItem("blog-content", plain);
                  window.localStorage.setItem("blog-content-html", html);
                  
                  // Auto-populate description from content if title exists but description doesn't
                  if (titlePlain && !descriptionPlain && plain.trim()) {
                    const excerpt = plain.substring(0, 150);
                    setDescriptionPlain(excerpt);
                    window.localStorage.setItem("blog-description", excerpt);
                  }
                  
                  // Debounced save status update
                  setTimeout(() => setSaveStatus("Saved"), 500);
                }}
                minHeight="100%"
                showWordCount={false}
                enableImages={true}
                enableSlashCommands={true}
                className="border-none shadow-none text-lg leading-relaxed text-gray-800 placeholder-gray-400 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-headings:font-bold h-full"
                padding="0.5rem"
              />
              )}
            </div>
          </div>
          
          {/* Floating validation indicators - unobtrusive */}
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
          
          {/* Floating title status - unobtrusive */}
          {titlePlain && (
            <div className="fixed bottom-32 right-6 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
              {titlePlain.length}/50 {titlePlain.length >= 7 ? '✓' : '(min 7)'}
            </div>
          )}
        </div>

        {/* Character count indicator - bottom right */}
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
          {contentChars}/100 chars
        </div>
      </main>

      {/* Tags Modal */}
      <TagsModal
        open={tagsModalOpen}
        initialTags={tagsPlain}
        loading={publishing}
        onConfirm={(val) => submitWithTags(val)}
        onCancel={() => setTagsModalOpen(false)}
      />

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
