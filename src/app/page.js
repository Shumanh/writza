import Hero from "./(landing)/components/hero";
import Navbar from "./(landing)/components/navbar";


export default function Home() {
  return (
    <>
   
      <Navbar />
      <div className="max-w-7xl flex m-auto">
        <Hero />
      </div>
    </>
  );
}
