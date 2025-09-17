
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function BlogsLayout({ children }) {

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        setLoggedIn(!!data.loggedIn);
      } catch (error) {
        console.error('Auth check error:', error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Ensure Twitter widgets are available within blogs routes too */}
      <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
      <main>
        {children}
      </main>
    </div>
  );
}