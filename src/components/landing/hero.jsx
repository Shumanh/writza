export default function Hero() {
  return (
    <section className="w-full flex h-[80vh] items-center justify-between gap-8 px-6 pt-16 md:pt-20">
      <div>
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="text-sm text-primary/70 tracking-wider font-medium">Read. Explore. Learn.</span>
        </div>

        <div className="mb-6">
          <span className="text-lg bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text font-semibold tracking-wide">
            TECH BLOGS FROM
          </span>
          <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-primary mt-1">DEVSG - SHUMANh</h2>
        </div>

        <h1 className="font-bold text-5xl md:text-7xl leading-tight text-primary">
          Because the Future Belongs to You.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-primary/70 max-w-2xl">
          Read the tech stories and experiences from DEVSG. Discover insights that shape the future of technology.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <a
            href="blogs/view"
            className="px-6 py-3.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition shadow-sm"
          >
            HOP-In
          </a>
        </div>
      </div>
    </section>
  );
}
