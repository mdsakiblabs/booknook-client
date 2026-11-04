import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#101211]">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-[#d5ff3f]/5 blur-[130px]" />

      <div className="relative mx-auto grid min-h-[680px] max-w-[1440px] items-center gap-14 px-5 py-20 md:grid-cols-2 md:px-10 lg:gap-20 lg:py-24">
        {/* Left Content */}
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Your next chapter starts here
            </span>
          </div>

          <h1 className="max-w-2xl font-heading text-6xl leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-[100px]">
            ESCAPE INTO
            <br />
            ANOTHER
            <br />
            <span className="text-accent italic">WORLD.</span>
          </h1>

          <p className="mt-8 max-w-md font-body text-base leading-8 text-muted">
            Some stories stay with you forever. Explore a collection of books
            that inspire, challenge, and take you somewhere new.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/books"
              className="group inline-flex items-center gap-4 rounded-lg bg-accent px-7 py-4 font-ui text-sm font-bold text-[#101211] transition-all duration-300 hover:-translate-y-1 hover:bg-accent-hover"
            >
              EXPLORE LIBRARY
              <span className="text-lg transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </Link>

            <Link
              href="/books"
              className="font-ui text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              Discover our collection
            </Link>
          </div>

          {/* Editorial Metadata */}
          <div className="mt-16 flex flex-wrap gap-10 border-t border-white/10 pt-7">
            <div>
              <p className="font-heading text-3xl text-foreground">01</p>
              <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-muted">
                Discover
              </p>
            </div>

            <div>
              <p className="font-heading text-3xl text-foreground">∞</p>
              <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-muted">
                Possibilities
              </p>
            </div>

            <div>
              <p className="font-heading text-3xl text-accent">24/7</p>
              <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-muted">
                Your library
              </p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -right-5 -top-5 z-10 hidden h-28 w-28 rounded-full border border-accent/40 md:block" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#191d1a]">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000&q=85"
              alt="A cinematic library filled with books"
              className="h-[480px] w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105 sm:h-[580px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#101211] via-transparent to-black/10" />

            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
              <div>
                <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-accent">
                  A world beyond pages
                </p>
                <p className="mt-2 font-heading text-3xl text-white">
                  Find your next story.
                </p>
              </div>

              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-xl text-white">
                ↗
              </span>
            </div>
          </div>

          {/* Floating Label */}
          <div className="absolute right-5 top-5 z-20 hidden rounded-xl border border-white/10 bg-[#191d1a]/95 px-5 py-4 shadow-2xl backdrop-blur-md sm:block">
            <p className="font-ui text-[10px] uppercase tracking-widest text-muted">
              The reading experience
            </p>
            <p className="mt-1 font-heading text-xl text-foreground">
              Beyond ordinary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
