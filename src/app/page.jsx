import Hero from "@/components/ui/(landing)/hero";
import Navbar from "@/components/ui/(landing)/navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
      <div className="max-w-7xl flex m-auto">
        <Hero />
      </div>
      
    </>
  );
  
}
