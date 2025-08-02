import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

// Define different rate limit configurations for different routes
const apiLimits = {
  // Default API rate limit: 60 requests per minute
  default: { interval: 60 * 1000, limit: 60 },
  
  // Auth endpoints: 5 requests per minute (login attempts, registration)
  auth: { interval: 60 * 1000, limit: 5 },
  
  // Blog endpoints: 30 requests per minute
  blogs: { interval: 60 * 1000, limit: 30 },
};

// Create limiters
const defaultLimiter = rateLimit(apiLimits.default);
const authLimiter = rateLimit(apiLimits.auth);
const blogsLimiter = rateLimit(apiLimits.blogs);

export async function middleware(request) {
  // Only apply rate limiting to API routes
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Get client IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "anonymous";
  
  // Determine which limiter to use based on the path
  let limiter = defaultLimiter;
  if (pathname.startsWith('/api/auth')) {
    limiter = authLimiter;
  } else if (pathname.startsWith('/api/blogs')) {
    limiter = blogsLimiter;
  }
  
  try {
    // Check rate limit
    await limiter.check(ip);
    return NextResponse.next();
  } catch (error) {
    // Rate limit exceeded
    console.warn(`[SECURITY] Rate limit exceeded for ${pathname} from IP: ${ip}`);
    
    return new Response(
      JSON.stringify({ error: "Too many requests, please try again later" }),
      { 
        status: 429, 
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      }
    );
  }
}

// Configure which paths this middleware applies to
export const config = {
  matcher: '/api/:path*',
};