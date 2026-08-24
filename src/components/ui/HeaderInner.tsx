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

/* ── Desktop Transparent Dropdown ─────────────────────── */

function DropdownMenu({
  item,
  isOpen,
  onClose,
}: {
  item: NavigationItem;
  isOpen: boolean;
  onClose: () => void;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(onClose, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isOpen || !item.children?.length) return null;

  // Group children into columns
  const columns: { title: string; links: NavigationItem[] }[] = [];
  let currentColumn: { title: string; links: NavigationItem[] } | null = null;

  item.children.forEach((child) => {
    if (child.children) {
      if (currentColumn) columns.push(currentColumn);
      currentColumn = { title: child.label, links: child.children };
    } else {
      if (!currentColumn) currentColumn = { title: "", links: [] };
      currentColumn.links.push(child);
    }
  });
  if (currentColumn) columns.push(currentColumn);

  return (
    <div
      className="absolute left-0 top-full z-50 pt-2"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Transparent dropdown — no background, no shadow, no border */}
      <div className="min-w-[200px] py-2">
        <div
          className="flex gap-10"
          style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
          {columns.map((col) => (
            <div key={col.title || "main"}>
              {col.title && (
                <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta-light">
                  {col.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={resolveHref(link)}
                      onClick={onClose}
                      className="group flex items-center gap-2 rounded px-3 py-2 font-body text-[13px] text-warm-white/60 transition-all duration-200 hover:translate-x-1 hover:text-terracotta-light"
                    >
                      <span className="h-px w-0 bg-terracotta-light transition-all duration-200 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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

  const isContact = (label: string) =>
    label.toLowerCase().includes("contact");

  return (
    <>
      {/* ── Desktop Nav ── */}
      <nav className="hidden items-center gap-1 lg:flex">
        {items.map((item) => {
          // Items with children → hover dropdown
          if (item.children && item.children.length > 0) {
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="group relative px-4 py-2 font-body text-[13px] font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:text-terracotta-light"
                  aria-expanded={openDropdown === item.label}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-4 right-4 h-px scale-x-0 bg-terracotta-light transition-transform duration-300 group-hover:scale-x-100" />
                </button>

                <DropdownMenu
                  item={item}
                  isOpen={openDropdown === item.label}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            );
          }

          // "Contacts" → outlined button
          if (isContact(item.label)) {
            return (
              <Link
                key={item.label}
                href={resolveHref(item)}
                className="ml-2 rounded-lg border border-warm-white/40 px-5 py-2 font-body text-[12px] font-semibold uppercase tracking-[0.15em] text-warm-white transition-all hover:border-terracotta-light hover:bg-terracotta-light/10"
              >
                {item.label}
              </Link>
            );
          }

          // Simple links → no opacity reduction
          return (
            <Link
              key={item.label}
              href={resolveHref(item)}
              className="group relative px-4 py-2 font-body text-[13px] font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:text-terracotta-light"
            >
              {item.label}
              <span className="absolute bottom-0 left-4 right-4 h-px scale-x-0 bg-terracotta-light transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
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
