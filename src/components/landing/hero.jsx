export default function Hero() {
  return (
    <section className="   w-full flex h-[80vh] items-center justify-between gap-8 px-6 pt-16 md:pt-20">
      <div className="  
      ">
        <div className="mb-6 inline-flex items-center gap-3">
          
          <span className="text-sm text-sky-300/80 trdacking-wide">Write. Share. Inspire.</span>
        </div>

        <h1 className="font-bold text-5xl md:text-7xl leading-tight">
          Insights from minds that matter
        </h1>

        <p className="mt-4 text-lg md:text-xl text-white/70">
          Publish thoughtful stories with a beautiful writing experience. Join a
          community where ideas take center stage.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <a
            href="blogs/view"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-300 to-cyan-400 text-black font-medium hover:opacity-90 transition"
          >
            Wanna Read ? Hop-in.
          </a>
          
        </div>
      </div>

      
    </section>
  );
}
