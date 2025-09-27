
"use client";
import {useState , useEffect, useRef, useContext} from "react";
import { createRoot } from "react-dom/client";
import { Tweet } from "react-tweet";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, MessageSquare, Clock, Heart, Bookmark, MoreHorizontal, Search, Bell } from "lucide-react";
import { AppContext } from "@/app/providers";

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/blogs/view", label: "blog" },
  { href: "https://x.com/shumanh_", label: "twitter", external: true },
  { href: "https://github.com/Shumanh", label: "github", external: true },
  { href: "mailto:theshumanhere@gmail.com", label: "mail", external: true },
];

export function IndividualBlog({ id }) {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const { font } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("D");

async function getBlog(){

  try{ 
     const response = await fetch(`/api/blogs/view?id=${id}` ,{method : "GET"})

    const data = await response.json()
    
    if(response.ok){
      setBlog(data.data)
      // Initialize local like count
      setLikesCount(typeof data.data?.likesCount === 'number' ? data.data.likesCount : 0)
      const authorSeed = data.data?.author?.username || data.data?.author?.name || data.data?.author || "";
      const initial = String(authorSeed).trim().charAt(0).toUpperCase();
      setUserInitial(initial || "D");
    }
    else{
      setError(data.message || "Failed to fetch the blogs")
    }

  }

catch(error){
    setError('An error occurred while fetching the blog')
} finally { 
  setLoading(false)
}

}

useEffect(() => {
    if (id) {
      getBlog()
    }
  }, [id])

 // Increment view count once per session for this blog
 useEffect(() => {
   if (!id) return;
   try {
     const key = `viewed:${id}`;
     const alreadyViewed = sessionStorage.getItem(key);
     if (alreadyViewed) return;
     // Fire-and-forget; we don't block UI
     fetch(`/api/blogs/view?id=${id}`, { method: 'POST' })
       .then(res => res.json())
       .then((_d) => {
         sessionStorage.setItem(key, '1');
         // Optionally update local blog.views
         setBlog(prev => prev ? { ...prev, views: typeof _d?.views === 'number' ? _d.views : (typeof prev.views === 'number' ? prev.views + 1 : 1) } : prev)
       })
       .catch(() => {});
   } catch (_e) {}
 }, [id])

 // Initialize liked state from session for this blog
 useEffect(() => {
   if (!id) return;
   try {
     const likedKey = `liked:${id}`;
     setLiked(!!sessionStorage.getItem(likedKey));
   } catch (_e) {}
 }, [id])

 async function handleLike() {
   if (!id) return;
   const likedKey = `liked:${id}`;
   // Prevent double-like in this session
   if (liked) return;
   // Optimistic update
   setLiked(true);
   setLikesCount((c) => (typeof c === 'number' ? c + 1 : 1));
   try {
     const res = await fetch(`/api/blogs/like?id=${id}`, { method: 'POST' });
     const data = await res.json();
     if (!res.ok || data?.error) {
       // Revert on failure
       setLiked(false);
       setLikesCount((c) => Math.max(0, (typeof c === 'number' ? c - 1 : 0)));
       return;
     }
     if (typeof data.likesCount === 'number') setLikesCount(data.likesCount);
     try { sessionStorage.setItem(likedKey, '1'); } catch (_e) {}
   } catch (_e) {
     setLiked(false);
     setLikesCount((c) => Math.max(0, (typeof c === 'number' ? c - 1 : 0)));
   }
 }
  
  // Load/refresh Twitter embeds after content mounts or changes
  const contentRef = useRef(null);
  useEffect(() => {
    if (!blog) return;
    const container = contentRef.current;
    if (!container) return;
    let debounceTimer = null;
    const schedule = (fn) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fn, 50);
    };
    const loadAndRender = () => {
      const normalizeTweetUrl = (href) => {
        if (!href || typeof href !== 'string') return href;
        try {
          const u = new URL(href, window.location.origin);
          if (u.hostname === 'x.com' || u.hostname === 'www.x.com') {
            u.hostname = 'twitter.com';
          }
          u.search = '';
          u.hash = '';
          return u.toString();
        } catch (_e) {
          return href.replace(/^(https?:\/\/)(www\.)?x\.com\//, '$1twitter.com/');
        }
      };
      try {
        const appendAnchorIfMissing = (el, href) => {
          if (!href) return;
          if (el.querySelector && (el.querySelector('a[href*="twitter.com/"]') || el.querySelector('a[href*="x.com/"]'))) return;
          const a = document.createElement('a');
          a.setAttribute('href', normalizeTweetUrl(href));
          a.textContent = href;
          el.appendChild(a);
        };
        container.querySelectorAll('[data-type="tweet"]').forEach((node) => {
          const src = node.getAttribute('data-src');
          const id = node.getAttribute('data-tweet-id');
          const href = src || (id ? `https://x.com/i/web/status/${id}` : null);
          appendAnchorIfMissing(node, href);
        });
        container.querySelectorAll('[data-src]').forEach((node) => {
          const src = node.getAttribute('data-src') || '';
          if (/https?:\/\/(?:www\.)?(twitter\.com|x\.com)\/[^\s/]+\/status\/\d+/.test(src)) {
            appendAnchorIfMissing(node, normalizeTweetUrl(src));
          }
        });
        // legacy nodes that used a plain `src` attribute
        container.querySelectorAll('[src]').forEach((node) => {
          const src = node.getAttribute('src') || '';
          if (/https?:\/\/(?:www\.)?(twitter\.com|x\.com)\/[^\s/]+\/status\/\d+/.test(src)) {
            appendAnchorIfMissing(node, normalizeTweetUrl(src));
          }
        });
        // placeholders with data-tweet-id
        container.querySelectorAll('[data-tweet-id]').forEach((node) => {
          const id = node.getAttribute('data-tweet-id');
          if (id) appendAnchorIfMissing(node, `https://x.com/i/web/status/${id}`);
        });
      } catch (_e) {}
      // Convert Twitter/X links into embeds using react-tweet
      if (!container) return;
      const links = container.querySelectorAll('a[href*="twitter.com/"], a[href*="x.com/"]');
      links.forEach((link) => {
        const href = normalizeTweetUrl(link.getAttribute('href') || '');
        if (href !== link.getAttribute('href')) link.setAttribute('href', href);
        // Match /status/1234567890 in the URL
        const match = href.match(/status\/(\d+)/);
        if (!match) return;
        const tweetId = match[1];

        // Avoid re-embedding if already rendered
        if (link.closest('.twitter-tweet, .tweet-embed-placeholder')) return;

        // Replace the link with a placeholder and render the tweet
        const placeholder = document.createElement('div');
        // Use not-prose to avoid Tailwind Typography styles (like rounded corners on img)
        placeholder.className = 'tweet-embed-placeholder not-prose';
        link.replaceWith(placeholder);
        try {
          const root = createRoot(placeholder);
          root.render(<Tweet id={tweetId} />);
        } catch (_e) {}
      });

      // Finally, detect plain-text tweet URLs (not anchors) and embed them
      const tweetUrlRegex = /https?:\/\/(?:x\.com|twitter\.com)\/[^\s/]+\/status\/(\d+)/g;
      const candidates = container.querySelectorAll('p, div, li');
      candidates.forEach((el) => {
        // Skip if this element already contains an embed
        if (el.querySelector && el.querySelector('.twitter-tweet, .tweet-embed-placeholder')) return;
        let html = el.innerHTML;
        if (!html || html.includes('class="tweet-embed-placeholder"')) return;
        // If element already has an anchor for the tweet, we processed above
        if (el.querySelector && el.querySelector('a[href*="twitter.com/"] , a[href*="x.com/"]')) return;

        // Replace plain URLs with placeholders
        let replaced = false;
        html = html.replace(tweetUrlRegex, (_m, id) => {
          replaced = true;
          // Mark placeholder with not-prose to isolate from Typography styles
          return `<div class="tweet-embed-placeholder not-prose" data-tweet-id="${id}"></div>`;
        });
        if (!replaced) return;
        el.innerHTML = html;
      });

      // Render any placeholders created from plain text
      const placeholders = container.querySelectorAll('.tweet-embed-placeholder[data-tweet-id]');
      const seen = new Set();
      placeholders.forEach((ph) => {
        const id = ph.getAttribute('data-tweet-id');
        if (!id) return;
        if (seen.has(id)) {
          ph.remove();
          return;
        }
        seen.add(id);
        if (ph.getAttribute('data-rendered') === '1') return;
        if (ph.querySelector('iframe')) {
          ph.setAttribute('data-rendered', '1');
          return;
        }
        try {
          const root = createRoot(ph);
          root.render(<Tweet id={id} />);
          ph.setAttribute('data-rendered', '1');
        } catch (_e) {}
      });
    };
    // Initial render
    loadAndRender();
    // Observe for DOM changes and re-embed if needed
    const observer = new MutationObserver(() => schedule(loadAndRender));
    observer.observe(container, { childList: true, subtree: true });
    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [blog?.content]);

  // Early return blocks must come AFTER all hooks to preserve hook order
  if (loading){
    return <div>loading.....</div>
  }
  if (error){
    return <div>Error: {error}</div>
  }
  if (!blog){
    return <div>No blog found.</div>
  }

  // Derive safe fields AFTER ensuring blog is available
  const authorName = (() => {
    const a = blog.author;
    if (typeof a === 'string') return a;
    return a?.name || a?.username || 'Unknown';
  })();
  const categoryName = (() => {
    const c = blog.category;
    return typeof c === 'string' ? c : (c?.name || '');
  })();
  // Prefer the persisted shortDescription from DB
  const subtitle = blog.shortDescription || blog.descriptionPlain || blog.excerpt || '';
  const hero = blog.coverImage || blog.thumbnail || blog.imageUrl || '';
  const words = typeof blog.contentPlain === 'string' ? blog.contentPlain.trim().split(/\s+/).length : 0;
  const readMins = words ? Math.max(1, Math.round(words / 200)) : null;

  return (
    <article className={`bg-white font-default ${font}`}>
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-8 text-sm lowercase tracking-wide text-gray-700 font-title">
          {NAV_LINKS.map(({ href, label, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-150 hover:text-gray-900"
              >
                {label}
              </a>
            ) : (
              <Link key={label} href={href} className="transition-colors duration-150 hover:text-gray-900">
                {label}
              </Link>
            ),
          )}
        </nav>
      </header>
      <header className="max-w-3xl mx-auto px-6 pt-8 md:pt-10 space-y-2">
        {/* Category badge */}
        {categoryName && (
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium">
              <span className="inline-block w-5 h-5 rounded bg-yellow-400 text-gray-900 text-[10px] font-bold flex items-center justify-center">
                {categoryName.slice(0,2).toUpperCase()}
              </span>
              {categoryName}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight leading-tight text-gray-900 mt-0 font-blog">
          {blog.title}
        </h1>
        {subtitle && (
          <p className="text-lg text-gray-600 mt-1">{subtitle}</p>
        )}

        {/* Author and meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {/* Avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
          <span className="font-medium text-gray-900">{authorName}</span>
          <time className="inline-flex items-center gap-1" dateTime={blog.createdAt}>
            <Calendar className="h-4 w-4" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
          </time>
          {readMins && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {readMins} min read
            </span>
          )}
          {typeof blog.views === 'number' && (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {Intl.NumberFormat('en-US', { notation: 'compact' }).format(blog.views)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Heart className={`h-4 w-4 ${liked ? 'text-blue-600 fill-blue-600' : ''}`} />
            {Intl.NumberFormat('en-US', { notation: 'compact' }).format(likesCount || 0)}
          </span>
          {typeof blog.commentsCount === 'number' && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {blog.commentsCount}
            </span>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {hero && (
        <div className="mt-6 max-w-3xl mx-auto px-6">
          <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50" style={{ aspectRatio: '16/9' }}>
            <Image src={hero} alt={blog.title || 'Cover image'} fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="prose prose-stone max-w-3xl mx-auto px-6 py-6 mt-4 text-gray-800 font-default prose-headings:font-title prose-headings:text-gray-900 prose-p:leading-relaxed prose-li:leading-relaxed prose-img:rounded-lg prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl">
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: blog.content }} />
        {blog.tags && (
          <div className="mt-8 text-sm text-gray-600">
            Tags: {Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags?.name || String(blog.tags))}
          </div>
        )}
        {/* Like button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleLike}
            disabled={liked}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${liked ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-default' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            aria-pressed={liked}
          >
            <Heart className={`h-4 w-4 ${liked ? 'text-blue-600 fill-blue-600' : ''}`} />
            {liked ? 'Liked' : 'Like'} • {Intl.NumberFormat('en-US', { notation: 'compact' }).format(likesCount || 0)}
          </button>
        </div>

        {/* Admin actions */}
        {(blog.canEdit || blog.canDelete) && (
          <div className="mt-8 flex items-center gap-4">
            {blog.canEdit && (
              <Link href={`/blogs/update/${blog._id}`} className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Edit
              </Link>
            )}
            {blog.canDelete && (
              <Link href={`/blogs/delete/${blog._id}`} className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
                Delete
              </Link>
            )}
          </div>
        )}
      </main>
    </article>
  )
}