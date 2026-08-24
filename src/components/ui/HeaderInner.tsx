"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import type { NavigationItem } from "@/types";

interface Props {
  items: NavigationItem[];
}

function resolveHref(item: NavigationItem): string {
  if (!item.link?.slug?.current) return "#";
  const type = item.link._type;
  const slug = item.link.slug.current;
  if (type === "tourPackage") return `/safaris/${slug}`;
  if (type === "route") return `/trekking/${slug}`;
  if (type === "region") return `/zanzibar/${slug}`;
  if (type === "accommodation") return `/accommodation/${slug}`;
  if (type === "travelInfoArticle") return `/travel-info/${slug}`;
  if (type === "page") return `/${slug}`;
  return `/${slug}`;
}

/* ── Desktop Mega-Menu Panel ─────────────────────────── */

function MegaMenuPanel({
  item,
  isOpen,
  onClose,
}: {
  item: NavigationItem;
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(onClose, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Group children into columns
  const columns: { title: string; links: NavigationItem[] }[] = [];
  let currentColumn: { title: string; links: NavigationItem[] } | null = null;

  item.children?.forEach((child) => {
    if (child.children) {
      if (currentColumn) columns.push(currentColumn);
      currentColumn = {
        title: child.label,
        links: child.children,
      };
    } else {
      if (!currentColumn) {
        currentColumn = { title: "", links: [] };
      }
      currentColumn.links.push(child);
    }
  });
  if (currentColumn) columns.push(currentColumn);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Full-width panel */}
      <div className="border-t border-terracotta/40 bg-warm-white shadow-2xl">
        <div className="mx-auto max-w-7xl px-8 py-10">
          {/* Category header */}
          <div className="mb-8 flex items-center gap-3">
            <span className="font-display text-2xl font-semibold text-charcoal">
              {item.label}
            </span>
            <div className="h-px flex-1 bg-cream-dark" />
          </div>

          {/* Editorial columns */}
          <div className="grid gap-10" style={{ gridTemplateColumns: `repeat(${Math.max(columns.length, 3)}, 1fr)` }}>
            {columns.map((col) => (
              <div key={col.title || "main"}>
                {col.title && (
                  <h4 className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal-light">
                    {col.title}
                  </h4>
                )}
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={resolveHref(link)}
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-md px-3 py-2.5 font-body text-sm text-charcoal transition-all hover:bg-cream hover:text-terracotta"
                      >
                        <span className="h-1 w-1 rounded-full bg-terracotta/0 transition-all group-hover:bg-terracotta group-hover:scale-125" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom accent */}
          <div className="mt-8 flex items-center gap-4 border-t border-cream-dark pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta/10">
              <svg className="h-5 w-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="font-body text-xs font-medium uppercase tracking-wider text-charcoal-light">
                Ready to plan?
              </p>
              <p className="font-body text-sm text-charcoal">
                Speak with a safari expert — +255 754 474 792
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Header Component ─────────────────────────── */

export default function HeaderInner({ items }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 80;
    setScrolled(isScrolled);
    // Update header element for transparent→solid transition
    const header = document.querySelector("header");
    if (header) {
      header.setAttribute("data-scrolled", String(isScrolled));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop Nav ── */}
      <nav className="hidden items-center gap-1 lg:flex">
        {items.map((item) => {
          if (item.link) {
            return (
              <Link
                key={item.label}
                href={resolveHref(item)}
                className="group relative px-4 py-2 font-body text-[13px] font-medium uppercase tracking-[0.18em] text-warm-white/80 transition-colors hover:text-warm-white"
              >
                {item.label}
                <span className="absolute bottom-0 left-4 right-4 h-px scale-x-0 bg-terracotta transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            );
          }

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="group relative flex items-center gap-1.5 px-4 py-2 font-body text-[13px] font-medium uppercase tracking-[0.18em] text-warm-white/80 transition-colors hover:text-warm-white"
                aria-expanded={openDropdown === item.label}
              >
                {item.label}
                <svg
                  className={`h-3 w-3 transition-transform duration-300 ${
                    openDropdown === item.label ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-4 right-4 h-px scale-x-0 bg-terracotta transition-transform duration-300 group-hover:scale-x-100" />
              </button>

              <MegaMenuPanel
                item={item}
                isOpen={openDropdown === item.label}
                onClose={() => setOpenDropdown(null)}
              />
            </div>
          );
        })}
      </nav>

      {/* ── Mobile Toggle ── */}
      <button
        className="relative z-50 flex h-11 w-11 items-center justify-center lg:hidden"
        onClick={() => {
          setMobileOpen(!mobileOpen);
          setMobileExpanded(null);
        }}
        aria-label="Toggle menu"
      >
        <div className="relative h-5 w-5">
          <span
            className={`absolute left-0 h-0.5 rounded-full bg-warm-white transition-all duration-300 ${
              mobileOpen ? "top-2 w-5 rotate-45" : "top-0 w-5"
            }`}
          />
          <span
            className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-warm-white transition-all duration-300 ${
              mobileOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 h-0.5 rounded-full bg-warm-white transition-all duration-300 ${
              mobileOpen ? "top-2 w-5 -rotate-45" : "top-4 w-3"
            }`}
          />
        </div>
      </button>

      {/* ── Mobile Full-Screen Takeover ── */}
      <div
        className={`fixed inset-0 z-40 bg-charcoal transition-all duration-500 ease-out lg:hidden ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col pt-[72px]">
          <div className="flex-1 overflow-y-auto px-8 py-10">
            <nav className="space-y-1">
              {items.map((item, i) => {
                if (item.link) {
                  return (
                    <Link
                      key={item.label}
                      href={resolveHref(item)}
                      onClick={() => setMobileOpen(false)}
                      className="block border-b border-warm-white/10 py-4 font-display text-2xl font-medium text-warm-white transition-colors hover:text-terracotta-light"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                const isExpanded = mobileExpanded === item.label;

                return (
                  <div key={item.label} className="border-b border-warm-white/10">
                    <button
                      className="flex w-full items-center justify-between py-4 font-display text-2xl font-medium text-warm-white transition-colors hover:text-terracotta-light"
                      onClick={() =>
                        setMobileExpanded(isExpanded ? null : item.label)
                      }
                    >
                      {item.label}
                      <svg
                        className={`h-5 w-5 text-cream-dark transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? "max-h-[800px] pb-4" : "max-h-0"
                      }`}
                    >
                      {item.children?.map((child) =>
                        child.children ? (
                          <div key={child.label} className="mb-4 ml-4">
                            <div className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-cream-dark">
                              {child.label}
                            </div>
                            {child.children.map((grandchild) => (
                              <Link
                                key={grandchild.label}
                                href={resolveHref(grandchild)}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 pl-4 font-body text-base text-warm-white/80 transition-colors hover:text-terracotta-light"
                              >
                                {grandchild.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            key={child.label}
                            href={resolveHref(child)}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2.5 pl-4 font-body text-base text-warm-white/80 transition-colors hover:text-terracotta-light"
                          >
                            {child.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom CTA in mobile menu */}
          <div className="border-t border-warm-white/10 px-8 py-6">
            <Link
              href="/inquire"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg bg-terracotta py-4 text-center font-body text-sm font-semibold uppercase tracking-wider text-warm-white transition-colors hover:bg-terracotta-light"
            >
              Plan My Safari
            </Link>
            <p className="mt-4 text-center font-body text-xs text-cream-dark">
              +255 754 474 792 · info@machohalisi.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
