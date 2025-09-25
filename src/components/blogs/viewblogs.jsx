"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MessageSquare, Bookmark, MoreHorizontal, Search, Bell, Heart } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { AppContext } from "@/app/providers";

export function View() {
  const { font } = useContext(AppContext);
  const [errors, setErrors] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [userInitial, setUserInitial] = useState("D");
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
          const initial = String(seed).trim().charAt(0).toUpperCase();
          setUserInitial(initial || "D");
        } else {
          setCurrentUser(null);
          setUserInitial("D");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setLoggedIn(false);
        setCurrentUser(null);
        setUserInitial("D");
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

  function handleWriteClick() {
    if (loggedIn) {
      router.push("/blogs/create");
    } else {
      router.push("/auth/login");
    }
  }

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
    <div className={`min-h-screen bg-white text-gray-900 font-blog ${font}`}>
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-6 text-sm lowercase tracking-wide text-gray-700">
            <Link href="/" className="font-semibold text-gray-900 transition-colors duration-150 hover:text-gray-700">
              devsg
            </Link>
            <Link href="/blogs/view" className="transition-colors duration-150 hover:text-gray-900">
              blogs
            </Link>
            {loggedIn && (
              <Link href="/blogs/create" className="transition-colors duration-150 hover:text-gray-900">
                create blog
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <button
              type="button"
              className="p-2 transition-colors hover:text-gray-800"
              aria-label="Search"
              onClick={() => router.push("/blogs/view")}
            >
              <Search className="h-4 w-4" />
            </button>
            {loggedIn && (
              <button
                type="button"
                className="hidden sm:flex p-2 transition-colors hover:text-gray-800"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleWriteClick}
              className="rounded-full border border-gray-900 px-4 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              {loggedIn ? "Write" : "Log in"}
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
              {userInitial}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">recent writing</p>
          <h1 className="text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-gray-900 font-blog uppercase">Thoughts on engineering, systems, and product</h1>
        </header>

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
          <div className="flex flex-col">
            {blogs.map((blog, index) => {
              const isOwner =
                loggedIn && String((blog.author && (blog.author._id || blog.author)) || "") === String(currentUser?.id);

              const mainText = (() => {
                const main =
                  blog.shortDescription ||
                  blog.descriptionPlain ||
                  blog.description ||
                  blog.excerpt ||
                  (typeof blog.contentPlain === "string" ? blog.contentPlain : "");
                return typeof main === "string" ? main : "";
              })();

              let readTime = "1 min read";
              if (mainText) {
                const words = mainText.split(/\s+/).filter(Boolean).length;
                const minutes = Math.max(1, Math.min(30, Math.ceil(words / 200)));
                readTime = `${minutes} min read`;
              }

              const tagsList = (() => {
                const t = blog.tags;
                if (Array.isArray(t)) return t.filter(Boolean).map(String);
                if (typeof t === "string")
                  return t
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                if (Array.isArray(t?.items)) return t.items.filter(Boolean).map(String);
                if (t && typeof t === "object" && t.name) return [String(t.name)];
                return [];
              })();

              return (
                <article
                  key={blog._id}
                  className={`border-b border-gray-200 py-10 first:pt-0 ${index === blogs.length - 1 ? "last:border-b-0" : ""}`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>
                        {(() => {
                          const a = blog.author;
                          if (typeof a === "string") return a;
                          return a?.name || a?.username || "Unknown";
                        })()}
                      </span>
                      <span aria-hidden>·</span>
                      <time dateTime={blog.createdAt}>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </time>
                      <span aria-hidden>·</span>
                      <span>{readTime}</span>
                    </div>

                    <Link href={`/blogs/${blog.slug}`} className="group inline-flex flex-col gap-3">
                      <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-gray-700 font-blog">
                        {blog.title}
                      </h2>
                      {mainText && (
                        <p className="max-w-3xl text-base text-gray-500 line-clamp-2">{mainText}</p>
                      )}
                    </Link>

                    {tagsList.length ? (
                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                        {tagsList.slice(0, 3).map((tag, idx) => (
                          <span key={`${blog._id}-tag-${idx}`}>{tag}</span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>{readTime}</span>
                        {typeof blog.views === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {Intl.NumberFormat("en-US", { notation: "compact" }).format(blog.views)}
                          </span>
                        )}
                        {typeof blog.likesCount === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-4 w-4 text-blue-600" />
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

                      <div className="relative flex items-center gap-3 text-gray-400">
                        <button className="p-1 transition-colors hover:text-gray-600" aria-label="Bookmark">
                          <Bookmark className="h-4 w-4" />
                        </button>
                        {isOwner && (
                          <>
                            <button
                              className="p-1 transition-colors hover:text-gray-600"
                              aria-label="More options"
                              onClick={() => toggleMenu(blog._id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {menuOpenId === blog._id && (
                              <div className="absolute right-0 top-7 z-20 w-40 rounded-md border border-gray-200 bg-white py-2 text-left text-sm shadow-lg">
                                <Link
                                  href={`/blogs/update/${blog._id}`}
                                  className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                                  onClick={() => setMenuOpenId(null)}
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  className="block w-full px-4 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
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
                </article>
              );
            })}
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
