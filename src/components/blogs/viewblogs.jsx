"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MessageSquare, Bookmark, MoreHorizontal, Search, Bell, Heart } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export function View() {
  const [errors, setErrors] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
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
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
        const data = await response.json();
        const ok = !!data.loggedIn;
        setLoggedIn(ok);
        if (ok) {
          setCurrentUser({ id: data.id, username: data.username, role: data.role });
          const seed = data.username || data.id || "";
          setUserInitial(String(seed).charAt(0).toUpperCase() || "U");
        } else {
          setCurrentUser(null);
          setUserInitial(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setLoggedIn(false);
        setCurrentUser(null);
        setUserInitial(null);
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

    checkAuth();
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
        <div className="max-w-[1192px] mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-6 flex-1 min-w-0">
              <Link href="/" className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                OwnTheWeb
              </Link>
              {loggedIn && (
                <nav className="flex items-center space-x-3 sm:space-x-6">
                  <Link
                    href="/blogs/view"
                    className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/blogs/create"
                    className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm whitespace-nowrap hidden sm:inline"
                  >
                    Create Blog
                  </Link>
                </nav>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-5">
              <button className="text-gray-600 hover:text-gray-900 p-1">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              {loggedIn && (
                <>
                  <button className="text-gray-600 hover:text-gray-900 p-1 hidden sm:block">
                    <Bell className="h-5 w-5" />
                  </button>
                  <Link
                    href="/blogs/create"
                    className="border border-gray-900 text-gray-900 hover:bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap"
                  >
                    <span className="sm:hidden">+</span>
                    <span className="hidden sm:inline">Write</span>
                  </Link>
                </>
              )}
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                {userInitial || "S"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Medium Style */}
      <main className="max-w-[900px] mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Simplified header */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8">
          <div className="flex space-x-8">
            <button className="text-sm text-gray-900 font-medium border-b border-gray-900 pb-3 sm:pb-4 px-1">
              For you
            </button>
          </div>
        </div>

        {/* Blog Posts List (Medium-style) */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-6">
              {loggedIn
                ? "Start creating your first blog post to share your thoughts with the world."
                : "Check back soon for new content."}
            </p>
            {loggedIn && (
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
              <article key={blog._id} className="py-6 sm:py-8">
                <div className="flex items-start gap-4 sm:gap-8">
                  {/* Text Column */}
                  <div className="flex-1 min-w-0">
                    {/* Author without profile image */}
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="font-medium text-gray-900">
                        {(() => {
                          const a = blog.author;
                          if (typeof a === "string") return a;
                          return a?.name || a?.username || "Unknown";
                        })()}
                      </span>
                      <span className="text-gray-500">·</span>
                      <time dateTime={blog.createdAt} className="text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      {blog.category && (
                        <>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">
                            In{" "}
                            {(() => {
                              const c = blog.category;
                              return typeof c === "string" ? c : c?.name || "";
                            })()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title and excerpt */}
                    <Link href={`/blogs/${blog.slug}`} className="group block">
                      <h2 className="text-base sm:text-lg font-bold font-title text-gray-900 group-hover:text-gray-800 mb-1 leading-tight">
                        {blog.title}
                      </h2>
                      {(() => {
                        const main =
                          blog.shortDescription ||
                          blog.descriptionPlain ||
                          blog.description ||
                          blog.excerpt ||
                          (typeof blog.contentPlain === "string" ? blog.contentPlain : "");
                        const text = typeof main === "string" ? main : "";
                        const trimmed = text.length > 0 ? text : "";
                        return trimmed ? (
                          <p className="text-gray-600 text-xs sm:text-sm leading-snug line-clamp-2 overflow-hidden">
                            {trimmed}
                          </p>
                        ) : null;
                      })()}
                    </Link>

                    {/* Meta and actions row - Medium style */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {/* Read time estimate */}
                        <span className="text-gray-500">
                          {(() => {
                            // Calculate read time using actual word count when possible
                            // Fallback: if contentPlain isn't available, try stripping HTML from blog.content
                            let text = "";
                            if (typeof blog.contentPlain === "string" && blog.contentPlain.trim()) {
                              text = blog.contentPlain.trim();
                            } else if (typeof blog.content === "string" && blog.content.trim()) {
                              // naive HTML strip
                              text = blog.content.replace(/<[^>]+>/g, "").trim();
                            }

                            const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
                            const wpm = 200; // words per minute
                            const minutes = words > 0 ? Math.ceil(words / wpm) : 1;
                            // keep between 1 and 30 minutes
                            return Math.max(1, Math.min(30, minutes)) + " min read";
                          })()}
                        </span>

                        {/* Tags */}
                        {(() => {
                          const t = blog.tags;
                          const tagsList = Array.isArray(t)
                            ? t.filter(Boolean).map(String)
                            : typeof t === "string"
                              ? t
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              : Array.isArray(t?.items)
                                ? t.items.filter(Boolean).map(String)
                                : t && typeof t === "object" && t.name
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
                        {typeof blog.views === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {Intl.NumberFormat("en-US", { notation: "compact" }).format(blog.views)}
                          </span>
                        )}
                        {typeof blog.likesCount === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-4 w-4 text-blue-600 fill-blue-600" />
                            {Intl.NumberFormat("en-US", { notation: "compact" }).format(blog.likesCount)}
                          </span>
                        )}
                        {typeof blog.commentsCount === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {blog.commentsCount}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 relative">
                        <button className="text-gray-400 hover:text-gray-600 p-1" aria-label="Bookmark">
                          <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        {loggedIn &&
                          String((blog.author && (blog.author._id || blog.author)) || "") ===
                            String(currentUser?.id) && (
                            <>
                              <button
                                className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                                aria-label="More"
                                onClick={() => toggleMenu(blog._id)}
                              >
                                <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                              {menuOpenId === blog._id && (
                                <div className="absolute right-0 top-8 z-20 w-32 sm:w-36 rounded-md border border-gray-200 bg-white shadow-lg py-1">
                                  <Link
                                    href={`/blogs/update/${blog._id}`}
                                    className="block w-full text-left px-3 py-2.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 touch-manipulation"
                                    onClick={() => setMenuOpenId(null)}
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    type="button"
                                    className="block w-full text-left px-3 py-2.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 touch-manipulation"
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
}
