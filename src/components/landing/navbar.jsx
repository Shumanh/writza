import Link from "next/link";

export default function Navbar() {
  return (
    <nav className=" text-white flex items-center justify-between relative top-5  ">
      <a href="/">
<img
        src="/writza-wordmark.svg"
        alt="logo"
        className="w-50 h-15  relative left-20 items-center "
      />
</a>
      
      <div className="flex  text-lg relative right-35 gap-10 items-center">
        <div className="flex  gap-10  ">
          <button className="hover:text-sky-300 hover:border-b-2 hover:border-sky-300 ">
            {" "}
            Our Story{" "}
          </button>
          <button className="hover:text-sky-300 hover:border-b-2 hover:border-sky-300">
            {" "}
            Write{" "}
          </button>
          <Link href="/chat" className="hover:text-sky-300 hover:border-b-2 hover:border-sky-300">
            {" "}
            Chat{" "}
          </Link>
          <Link href="/auth/login" className="hover:text-sky-300 hover:border-b-2 hover:border-sky-300">
            {" "}
            Sign In{" "}
          </Link>
        </div>
        <Link href="/auth/signup" className=" border p-1 rounded-xl text-sky-300  hover:bg-sky-300 hover:text-black px-4">
          Get Started
        </Link>
      </div>
    </nav>
  );
}


