
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BlogsLayout({ children }) {

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    }

    checkAdminStatus();
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
      <main>
        {children}
      </main>
    </div>
  );
}