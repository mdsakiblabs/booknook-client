"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    eyebrow: "Your next chapter starts here",
    title: "ESCAPE INTO",
    highlight: "ANOTHER WORLD.",
    description:
      "Some stories stay with you forever. Discover books that inspire, challenge your perspective and take you somewhere new.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=85",
    imageAlt: "A cinematic library filled with books",
    imageLabel: "A world beyond pages",
    imageTitle: "Find your next story.",
    number: "01",
    theme: "THE ART OF READING",
  },
  {
    id: 2,
    eyebrow: "Knowledge changes everything",
    title: "DISCOVER",
    highlight: "NEW PERSPECTIVES.",
    description:
      "Explore new ideas, discover different worlds and expand the way you see things. Every great book opens another door.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=85",
    imageAlt: "Books arranged inside a beautiful library",
    imageLabel: "Explore new ideas",
    imageTitle: "Knowledge has no limits.",
    number: "02",
    theme: "BEYOND THE ORDINARY",
  },
  {
    id: 3,
    eyebrow: "A collection worth exploring",
    title: "YOUR NEXT",
    highlight: "GREAT READ.",
    description:
      "From timeless classics to unforgettable stories, find something worth reading and make your next chapter count.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400&q=85",
    imageAlt: "A collection of books ready to be explored",
    imageLabel: "Your reading journey",
    imageTitle: "Every book has a story.",
    number: "03",
    theme: "THE BOOKNOOK COLLECTION",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((current) => (current + 1) % slides.length);
  }, []);

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentSlide = slides[activeSlide];

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#101211] md:pb-20 lg:pb-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#D5FF3F]/[0.045] blur-[130px]" />

      {/* Main Hero */}
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center  px-5 py-8 md:gap-10 md:px-10 md:py-12 lg:h-[520px] lg:grid-cols-2 lg:gap-12 lg:py-5 xl:gap-20">
        {/* LEFT CONTENT */}
        <div className="flex min-w-0 flex-col justify-center lg:h-full">
          <div className="mb-4 flex h-5 shrink-0 items-center gap-3 sm:mb-5">
            <span className="h-px w-10 shrink-0 bg-accent" />

            <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.18em] text-accent sm:text-xs sm:tracking-[0.23em]">
              {currentSlide.eyebrow}
            </span>
          </div>

          {/* Fixed Content Area */}
          <div
            key={currentSlide.id}
            className="hero-content min-h-[230px] sm:min-h-[235px] lg:flex lg:h-[300px] lg:min-h-0 lg:shrink-0 lg:flex-col lg:justify-center"
          >
            <h1 className="font-heading text-[clamp(2.3rem,8vw,5.5rem)] leading-[0.94] tracking-tight text-foreground lg:text-[clamp(2.8rem,6.2vw,5.5rem)]">
              {currentSlide.title}
              <br />
              <span className="italic text-accent">
                {currentSlide.highlight}
              </span>
            </h1>

            <p className="mt-4 min-h-[84px] max-w-[470px] line-clamp-3 text-sm leading-7 text-muted sm:mt-5 sm:text-base sm:leading-8 lg:mt-4 lg:h-[96px] lg:min-h-0 lg:overflow-hidden">
              {currentSlide.description}
            </p>
          </div>

          {/* Desktop CTA - Original Position */}
          <div className="mt-5 hidden shrink-0 flex-wrap items-center gap-x-5 gap-y-3 lg:mt-7 lg:flex lg:gap-6">
            <Link
              href="/books"
              className="group inline-flex items-center gap-3 rounded-lg bg-accent px-5 py-3.5 font-ui text-[11px] font-bold tracking-wide text-[#101211] transition-all duration-300 hover:-translate-y-1 hover:bg-[#C1EA2F] sm:gap-4 sm:px-7 sm:text-xs"
            >
              EXPLORE LIBRARY
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>

            <Link
              href="/books"
              className="font-ui text-xs font-medium text-foreground transition-colors hover:text-accent sm:text-sm"
            >
              Discover our collection
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="mt-9 hidden shrink-0 border-t border-white/[0.10] pt-5 lg:block">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <span className="font-heading text-4xl text-accent">
                  {currentSlide.number}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-ui text-[10px] font-semibold uppercase tracking-[0.17em] text-foreground sm:text-xs">
                    {currentSlide.theme}
                  </p>

                  <p className="mt-1 font-ui text-[9px] uppercase tracking-[0.18em] text-muted">
                    BOOKNOOK / AFTER DARK
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-lg text-foreground transition-all hover:border-accent hover:bg-accent hover:text-[#101211]"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-lg text-foreground transition-all hover:border-accent hover:bg-accent hover:text-[#101211]"
                >
                  →
                </button>
              </div>
            </div>

            {/* Desktop Slide Indicators */}
            <div className="mt-5 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    activeSlide === index
                      ? "w-12 bg-accent"
                      : "w-6 bg-white/20 hover:bg-white/50"
                  }`}
                />
              ))}

              <span className="ml-2 font-ui text-[10px] tracking-widest text-muted">
                0{activeSlide + 1} / 0{slides.length}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative mx-auto w-full max-w-[560px] lg:justify-self-end">
          <div className="absolute -right-5 -top-5 z-10 hidden h-24 w-24 rounded-full border border-accent/40 md:block" />

          {/* Fixed Image Container */}
          <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#191D1A] sm:h-[360px] sm:rounded-2xl md:h-[420px] lg:h-[440px]">
            <img
              key={currentSlide.image}
              src={currentSlide.image}
              alt={currentSlide.imageAlt}
              className="hero-image absolute inset-0 block h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#101211] via-black/5 to-black/10" />

            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />

            {/* Image Caption */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 sm:gap-4 sm:p-8">
              <div className="min-w-0">
                <p className="font-ui text-[9px] uppercase tracking-[0.18em] text-accent sm:text-[10px] sm:tracking-[0.23em]">
                  {currentSlide.imageLabel}
                </p>

                <p className="mt-1.5 font-heading text-xl text-white sm:mt-2 sm:text-3xl">
                  {currentSlide.imageTitle}
                </p>
              </div>

              <Link
                href="/books"
                aria-label="Explore library"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-lg text-white transition-all hover:border-accent hover:bg-accent hover:text-[#101211] sm:h-12 sm:w-12 sm:text-xl"
              >
                ↗
              </Link>
            </div>

          </div>

          {/* Mobile Slide Navigation */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 lg:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-heading text-2xl text-accent">
                {currentSlide.number}
              </span>

              <div className="flex items-center gap-1.5">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={activeSlide === index ? "true" : undefined}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      activeSlide === index
                        ? "w-8 bg-accent"
                        : "w-3 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <span className="hidden truncate font-ui text-[9px] uppercase tracking-wider text-muted sm:block">
                {currentSlide.theme}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-base text-foreground transition-all active:border-accent active:bg-accent active:text-[#101211]"
              >
                ←
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 bg-accent text-base text-[#101211] transition-all active:scale-95"
              >
                →
              </button>
            </div>
          </div>

          {/* Mobile CTA - Below Image and Slide Navigation */}
          <div className="mt-5 flex w-full items-center gap-2 lg:hidden sm:mt-6 sm:gap-3">
            <Link
              href="/books"
              className="group inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-2 py-3.5 font-ui text-[10px] font-bold tracking-wide text-[#101211] transition-all duration-300 hover:bg-[#C1EA2F] active:scale-[0.98] sm:gap-3 sm:px-4 sm:text-xs"
            >
              <span className="whitespace-nowrap">EXPLORE LIBRARY</span>
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>

            <Link
              href="/books"
              className="inline-flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-white/20 px-2 py-3.5 font-ui text-[10px] font-semibold text-foreground transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent active:scale-[0.98] sm:px-4 sm:text-xs"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .hero-content {
          animation: contentFade 450ms ease both;
        }

        .hero-image {
          animation: imageFade 650ms ease both;
        }

        @keyframes contentFade {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageFade {
          from {
            opacity: 0.4;
            transform: scale(1.025);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-content,
          .hero-image {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
