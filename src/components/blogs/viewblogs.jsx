"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Eye, MessageSquare, Bookmark, MoreHorizontal, Search, Bell } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export function View() {
  const [errors, setErrors] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  function toggleMenu(id) {
    setMenuOpenId((prev) => (prev === id ? null : id));
  }

  function openDeleteModal(id) {
    setMenuOpenId(null);
    setConfirmId(id);
  }

  async function confirmDelete() {
    if (!confirmId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/blogs/delete?id=${confirmId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        // remove locally
        setBlogs((prev) => prev.filter((b) => b._id !== confirmId));
        setConfirmId(null);
      } else {
        alert(data.message || "Failed to delete blog");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while deleting the blog");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const response = await fetch('/api/auth/verify-admin', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        setIsAdmin(!data.error && data.isAdmin);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    }

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

    checkAdminStatus();
    fetchBlogs();
  }, []);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{errors}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-default">
      {/* Medium-style Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1192px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-xl font-bold text-gray-900">
                OwnTheWeb
              </Link>
              {isAdmin && (
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/blogs/view"
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    View Blogs
                  </Link>
                  <Link
                    href="/blogs/create"
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Create Blog
                  </Link>
                </nav>
              )}
            </div>
            <div className="flex items-center space-x-5">
              <button className="text-gray-600 hover:text-gray-900">
                <Search className="h-5 w-5" />
              </button>
              {isAdmin && (
                <>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Bell className="h-5 w-5" />
                  </button>
                  <Link
                    href="/blogs/create"
                    className="border border-gray-900 text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-full text-sm transition-colors"
                  >
                    Write
                  </Link>
                </>
              )}
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                S
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Medium Style */}
      <main className="max-w-[900px] mx-auto px-4 py-10">
        {/* Simplified header */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <button className="text-sm text-gray-900 font-medium border-b border-gray-900 pb-4 px-1">
              For you
            </button>
          </div>
        </div>

        {/* Blog Posts List (Medium-style) */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-6">
              {isAdmin
                ? "Start creating your first blog post to share your thoughts with the world."
                : "Check back soon for new content."
              }
            </p>
            {isAdmin && (
              <Link
                href="/blogs/create"
                className="border border-gray-900 text-gray-900 hover:bg-gray-50 px-6 py-2 rounded-full font-medium transition-colors inline-flex items-center"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <article key={blog._id} className="py-8">
                <div className="flex items-start gap-8">
                  {/* Text Column */}
                  <div className="flex-1 min-w-0">
                    {/* Author without profile image */}
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="font-medium text-gray-900">
                        {(() => {
                          const a = blog.author;
                          if (typeof a === 'string') return a;
                          return a?.name || a?.username || 'Unknown';
                        })()}
                      </span>
                      <span className="text-gray-500">·</span>
                      <time dateTime={blog.createdAt} className="text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                      {blog.category && (
                        <>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">
                            In {(() => {
                              const c = blog.category;
                              return typeof c === 'string' ? c : (c?.name || '');
                            })()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title and excerpt */}
                    <Link href={`/blogs/${blog.slug}`} className="group block">
                      <h2 className="text-lg font-bold font-title text-gray-900 group-hover:text-gray-800 mb-1 leading-tight">
                        {blog.title}
                      </h2>
                      {(() => {
                        const main =
                          blog.shortDescription ||
                          blog.descriptionPlain ||
                          blog.description ||
                          blog.excerpt ||
                          (typeof blog.contentPlain === 'string' ? blog.contentPlain : '');
                        const text = typeof main === 'string' ? main : '';
                        const trimmed = text.length > 0 ? text : '';
                        return trimmed ? (
                          <p className="text-gray-600 text-sm leading-snug line-clamp-2 overflow-hidden">{trimmed}</p>
                        ) : null;
                      })()}
                    </Link>

                    {/* Meta and actions row - Medium style */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {/* Read time estimate */}
                        <span className="text-gray-500">
                          {(() => {
                            // Calculate read time based on content length
                            // Average reading speed: 200 words per minute
                            // Average word length: 5 characters
                            const contentLength = blog.contentPlain?.length || 0;
                            const wordCount = contentLength / 5;
                            const readTimeMinutes = wordCount / 200;
                            // Ensure minimum 1 minute, maximum realistic time
                            return Math.max(1, Math.min(30, Math.ceil(readTimeMinutes))) + ' min read';
                          })()}
                        </span>
                        
                        {/* Tags */}
                        {(() => {
                          const t = blog.tags;
                          const tagsList = Array.isArray(t)
                            ? t.filter(Boolean).map(String)
                            : typeof t === 'string'
                              ? t.split(',').map(s => s.trim()).filter(Boolean)
                              : Array.isArray(t?.items)
                                ? t.items.filter(Boolean).map(String)
                                : (t && typeof t === 'object' && t.name)
                                  ? [String(t.name)]
                                  : [];
                          return tagsList.length ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {tagsList.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={`${blog._id}-tag-${idx}`}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : null;
                        })()}
                        
                        {/* Stats */}
                        {typeof blog.views === 'number' && (
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {Intl.NumberFormat('en-US', { notation: 'compact' }).format(blog.views)}
                          </span>
                        )}
                        {typeof blog.commentsCount === 'number' && (
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {blog.commentsCount}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 relative">
                        <button className="text-gray-400 hover:text-gray-600" aria-label="Bookmark">
                          <Bookmark className="h-5 w-5" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              aria-label="More"
                              onClick={() => toggleMenu(blog._id)}
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            {menuOpenId === blog._id && (
                              <div className="absolute right-0 top-8 z-10 w-36 rounded-md border border-gray-200 bg-white shadow-md py-1">
                                <Link
                                  href={`/blogs/update/${blog._id}`}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={() => setMenuOpenId(null)}
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                  onClick={() => openDeleteModal(blog._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Removed thumbnail column */}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!confirmId}
        title="Delete this blog?"
        description="This action cannot be undone. The blog will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};
