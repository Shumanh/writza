'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-3"></div>
              <h1 className="text-xl font-semibold text-gray-900">Writza Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {session?.user?.image && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt="Profile"
                  />
                )}
                <span className="text-sm text-gray-700 font-medium">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Welcome to your Dashboard!
            </h2>
            <p className="text-lg text-gray-700">
              Authentication successful! You&apos;re now logged in to Writza.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Your Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-800">Email:</span>
                <span className="ml-2 text-sm text-gray-700">{session?.user?.email}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-800">Name:</span>
                <span className="ml-2 text-sm text-gray-700">{session?.user?.name}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-800">Role:</span>
                <span className="ml-2 text-sm text-gray-700">{session?.user?.role || 'user'}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-800">User ID:</span>
                <span className="ml-2 text-sm text-gray-700 font-mono">{session?.user?.id}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-800">Verified:</span>
                <span className={`ml-2 text-sm font-medium ${session?.user?.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {session?.user?.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-800">Login Method:</span>
                <span className="ml-2 text-sm text-gray-700">
                  {session?.user?.image ? 'Google OAuth' : 'Credentials'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">✅ Authentication Success</h4>
                <p className="text-sm text-green-700 mt-1">
                  You have successfully authenticated with NextAuth! 
                  Your session is securely managed and will persist across browser refreshes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 