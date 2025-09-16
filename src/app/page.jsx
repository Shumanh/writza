import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";

export default function Home() {
  return (
    <>
      <Navbar/>
      <div className="max-w-7xl flex m-auto px-6">
        <Hero />
      </div>
    </>
  );
}

