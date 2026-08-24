"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { urlForWidth } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

interface Slide {
  headline: string;
  subheadline?: string;
  image: SanityImageSource;
  ctaLabel?: string;
  ctaLink?: string;
}

interface Props {
  slides: Slide[];
}

export default function HeroCarousel({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, isAutoPlaying]);

  if (!slides || slides.length === 0) return null;

  return (
    <section
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {slide.image && (
            <img
              src={urlForWidth(slide.image, 1920)}
              alt={slide.headline}
              className="h-full w-full object-cover"
            />
          )}
          {/* Gradient overlay — no solid color, just depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="container-main pb-24 md:pb-32">
          <div className="max-w-3xl">
            {slides.map((slide, i) => (
              <div
                key={i}
                className="absolute bottom-24 left-0 right-0 md:bottom-32 transition-all duration-1000"
                style={{
                  opacity: i === current ? 1 : 0,
                  transform: i === current ? "translateY(0)" : "translateY(20px)",
                  pointerEvents: i === current ? "auto" : "none",
                }}
              >
                <div className="container-main">
                  <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
                    Macho Halisi Tanzania Safaris
                  </p>
                  <h1 className="font-display text-4xl font-bold leading-[1.1] text-warm-white drop-shadow-lg md:text-6xl lg:text-7xl">
                    {slide.headline}
                  </h1>
                  {slide.subheadline && (
                    <p className="mt-4 max-w-xl font-body text-base text-warm-white/80 drop-shadow md:text-lg">
                      {slide.subheadline}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href={slide.ctaLink || "/inquire"}
                      className="rounded-lg bg-terracotta px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-warm-white transition-all hover:bg-terracotta-light hover:shadow-xl"
                    >
                      {slide.ctaLabel || "Explore"}
                    </Link>
                    <Link
                      href="/about"
                      className="rounded-lg border border-warm-white/30 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-warm-white transition-all hover:border-warm-white hover:bg-warm-white/10"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`group relative h-1 transition-all duration-500 ${
              i === current ? "w-12 bg-terracotta" : "w-6 bg-warm-white/30 hover:bg-warm-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="h-5 w-5 text-warm-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
