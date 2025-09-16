import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="text-primary flex items-center justify-between px-6 py-6 w-full max-w-7xl mx-auto">
      <a href="/">
        <div className="text-xl font-bold text-primary transition-transform duration-400 hover:-translate-y-0.5">OwnTheWeb</div>
      </a>
      
      <div className="flex text-base gap-8 items-center">
        <div className="flex gap-8">
          <Link href="/chat" className="text-primary/80 hover:text-primary transition-all duration-400 font-medium hover:-translate-y-0.5">
     Chat
          </Link>
          <Link href="/auth/login" className="text-primary/80 hover:text-primary transition-all duration-400 font-medium hover:-translate-y-0.5">
            Login
          </Link>
        </div>
        <Link href="/blogs/view" className="bg-primary text-white rounded-lg px-5 py-2.5 hover:bg-primary/90 transition-all duration-400 shadow-sm hover:shadow-md font-medium hover:-translate-y-0.5">
          Explore Blogs
        </Link>
      </div>
    </nav>
  );
}


