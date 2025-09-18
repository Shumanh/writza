import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1">
        <div className="w-full">
          <Hero />
        </div>
      </main>
      <Footer />
    </div>
  );
}

