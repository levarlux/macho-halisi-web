"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-warm-white/10 bg-charcoal/95 backdrop-blur-sm lg:hidden">
      <div className="flex items-stretch">
        <a
          href="tel:+255754474792"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-warm-white transition-colors hover:bg-charcoal"
        >
          <svg className="h-4 w-4 text-terracotta-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contact Us
        </a>
        <div className="w-px bg-warm-white/10" />
        <Link
          href="/inquire"
          className="flex flex-1 items-center justify-center gap-2 bg-terracotta py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-warm-white transition-colors hover:bg-terracotta-light"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Plan My Safari
        </Link>
      </div>
    </div>
  );
}
