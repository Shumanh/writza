import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar/>
      <main className="flex-1 flex items-center justify-center">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

