
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
               
              </h1>

  
              {isAdmin && (
                <div className="flex space-x-4">
                  <Link
                    href="/blogs/create"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Create Blog
                  </Link>
                   <Link
                  href="/blogs/view"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Blogs
                </Link>
                 
                </div>
              )}

            </div>
          </div>
        </div>
     

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}