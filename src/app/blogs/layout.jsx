import Link from 'next/link';

export default function BlogsLayout({ children }) {
  return (
    <div className="min-h-screen ">
      <nav className=" bg-white shadow-sm border-b flex justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
              
               <Link
                  href="/blogs/view"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
               Blogs
                </Link>
                </h1>

              <div className="flex space-x-4">
                <Link
                  href="/blogs/create"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Blog
                </Link>
                <Link
                  href="/blogs/my-blogs"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}