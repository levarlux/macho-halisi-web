"use client";

import { useState, useEffect } from "react";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-charcoal bg-charcoal/95 py-3 backdrop-blur-sm lg:hidden">
      <div className="container-main flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-warm-white">
            Ready to explore?
          </p>
          <p className="font-body text-xs text-charcoal-light">
            We respond within 24 hours
          </p>
        </div>
        <a href="/inquire" className="btn-primary text-xs">
          Plan My Safari
        </a>
      </div>
    </div>
  );
}
