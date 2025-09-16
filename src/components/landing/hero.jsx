export default function Hero() {
  return (
    <section className="w-full h-[80vh] flex flex-col justify-center items-center px-6">
      <div className="max-w-4xl text-center -mt-16 animate-fadeIn">
        <div className="mb-6 flex justify-center items-center gap-3">
          <span className="text-sm text-primary/70 tracking-wider font-medium">Read. Explore. Learn.</span>
        </div>

        <div className="mb-6">
          <span className="text-lg bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text font-semibold tracking-wide">
            TECH BLOGS FROM
          </span>
          <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-primary mt-1">DEVSG - Shumanh</h2>
        </div>

        <h1 className="font-bold text-5xl md:text-7xl leading-none text-primary animate-slideUp [animation-delay:300ms] opacity-0">
          Because the Future
          <br />
          Belongs to You.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-primary/70 mx-auto max-w-2xl animate-slideUp [animation-delay:600ms] opacity-0">
          Read the tech stories and experiences from DEVSG. Discover insights that shape the future of technology.
        </p>

        <div className="mt-10 flex justify-center items-center gap-4 animate-slideUp [animation-delay:900ms] opacity-0">
          <a
            href="blogs/view"
            className="px-8 py-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-400 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
       Hop-In
          </a>
        </div>
      </div>
    </section>
  );
}
