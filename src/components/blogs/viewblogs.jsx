"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Eye, MessageSquare, Bookmark, MoreHorizontal } from "lucide-react";

export function View() {
  const [errors, setErrors] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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
    <div className="min-h-screen bg-white">
      {/* Header with Navigation - Only show if authenticated */}
      {isAdmin && (
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Writza
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/blogs/view"
                    className="text-gray-600 hover:text-gray-900 font-medium border-b-2 border-blue-500 pb-1"
                  >
                    View Blogs
                  </Link>
                  <Link
                    href="/blogs/create"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Create Blog
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/blogs/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  New Post
                </Link>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`max-w-4xl mx-auto px-6 ${isAdmin ? 'py-8' : 'py-16'}`}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Posts</h1>
          <p className="text-gray-600">
            {isAdmin
              ? "Manage and view all your blog posts"
              : "Discover our latest articles and insights"
            }
          </p>
        </div>

        {/* Blog Posts List (Medium-like) */}
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <article key={blog._id} className="py-6">
                <div className="flex items-start gap-6">
                  {/* Text Column */}
                  <div className="flex-1 min-w-0">
                    {/* Channel / Author row */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      {blog.category && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          <span className="text-[10px] font-bold bg-yellow-400 text-gray-900 rounded px-1">
                            {(() => {
                              const c = blog.category;
                              const label = typeof c === 'string' ? c : (c?.name || '');
                              return (label || '').slice(0,2).toUpperCase();
                            })()}
                          </span>
                          <span className="truncate">
                            In {(() => {
                              const c = blog.category;
                              return typeof c === 'string' ? c : (c?.name || '');
                            })()}
                          </span>
                        </span>
                      )}
                      {blog.author && (
                        <span className="truncate">
                          by {(() => {
                            const a = blog.author;
                            if (typeof a === 'string') return a;
                            return a?.name || a?.username || 'Unknown';
                          })()}
                        </span>
                      )}
                    </div>

                    {/* Title and excerpt */}
                    <Link href={`/blogs/${blog.slug}`} className="group block">
                      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-gray-800">
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
                          <p className="mt-1 text-gray-500 text-[15px] leading-6 line-clamp-2">{trimmed}</p>
                        ) : null;
                      })()}
                    </Link>

                    {/* Meta and actions row */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500" />
                        </div>
                        <time dateTime={blog.createdAt} className="whitespace-nowrap">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
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
                        {blog.tags && (
                          <span className="hidden sm:inline bg-gray-100 px-2 py-1 rounded text-xs">
                            {(() => {
                              const t = blog.tags;
                              if (Array.isArray(t)) return t.join(', ');
                              if (typeof t === 'string') return t;
                              // try common shapes like [{name: 'x'}]
                              if (Array.isArray(t?.items)) return t.items.join(', ');
                              if (t && typeof t === 'object') return t.name || '';
                              return String(t);
                            })()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600" aria-label="Bookmark">
                          <Bookmark className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600" aria-label="More">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <Link href={`/blogs/update/${blog._id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Edit
                            </Link>
                            <Link href={`/blogs/delete/${blog._id}`} className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Delete
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Column */}
                  <div className="shrink-0 w-40 h-28 relative rounded overflow-hidden bg-gray-100 border border-gray-200">
                    {blog.thumbnail || blog.coverImage || blog.imageUrl ? (
                      <Link href={`/blogs/${blog.slug}`} className="block w-full h-full">
                        <Image
                          src={(blog.thumbnail || blog.coverImage || blog.imageUrl)}
                          alt={blog.title || "Blog thumbnail"}
                          width={160}
                          height={112}
                          className="object-cover w-full h-full"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};