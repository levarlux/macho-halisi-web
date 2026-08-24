"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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

function DesktopDropdown({
  item,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavigationItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(onClose, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex items-center gap-1 px-4 py-2.5 font-body text-[13px] font-medium uppercase tracking-widest transition-colors hover:text-terracotta-light"
        aria-expanded={isOpen}
      >
        {item.label}
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pt-3"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div className="min-w-[240px] rounded-lg border border-cream-dark bg-warm-white p-2 shadow-xl">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-l border-t border-cream-dark bg-warm-white" />
            {item.children?.map((child) =>
              child.children ? (
                <div key={child.label} className="mb-1">
                  <div className="px-3 pt-2 pb-1 font-body text-[11px] font-semibold uppercase tracking-wider text-charcoal-light">
                    {child.label}
                  </div>
                  {child.children.map((grandchild) => (
                    <Link
                      key={grandchild.label}
                      href={resolveHref(grandchild)}
                      className="block rounded px-3 py-2 font-body text-sm text-charcoal transition-colors hover:bg-cream hover:text-terracotta"
                    >
                      {grandchild.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={child.label}
                  href={resolveHref(child)}
                  className="block rounded px-3 py-2 font-body text-sm text-charcoal transition-colors hover:bg-cream hover:text-terracotta"
                >
                  {child.label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeaderInner({ items }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <>
      {/* ── Desktop Nav ── */}
      <nav className="hidden items-center gap-0.5 lg:flex">
        {items.map((item) => {
          if (item.link) {
            return (
              <Link
                key={item.label}
                href={resolveHref(item)}
                className="px-4 py-2.5 font-body text-[13px] font-medium uppercase tracking-widest transition-colors hover:text-terracotta-light"
              >
                {item.label}
              </Link>
            );
          }
          return (
            <DesktopDropdown
              key={item.label}
              item={item}
              isOpen={openDropdown === item.label}
              onOpen={() => setOpenDropdown(item.label)}
              onClose={() => setOpenDropdown(null)}
            />
          );
        })}
      </nav>

      {/* ── Mobile Toggle ── */}
      <button
        className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-charcoal-light lg:hidden"
        onClick={() => {
          setMobileMenuOpen(!mobileMenuOpen);
          setMobileExpanded(null);
        }}
        aria-label="Toggle menu"
      >
        <div className="relative h-5 w-5">
          <span
            className={`absolute left-0 h-0.5 w-5 bg-warm-white transition-all duration-300 ${
              mobileMenuOpen ? "top-2 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-2 h-0.5 w-5 bg-warm-white transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 h-0.5 w-5 bg-warm-white transition-all duration-300 ${
              mobileMenuOpen ? "top-2 -rotate-45" : "top-4"
            }`}
          />
        </div>
      </button>

      {/* ── Mobile Menu ── */}
      <div
        className={`fixed inset-x-0 top-[73px] z-40 border-t border-cream-dark bg-warm-white shadow-2xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-h-[calc(100vh-73px)] overflow-y-auto px-6 py-6">
          <nav className="space-y-1">
            {items.map((item) => {
              if (item.link) {
                return (
                  <Link
                    key={item.label}
                    href={resolveHref(item)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 font-body text-sm font-medium text-charcoal transition-colors hover:bg-cream"
                  >
                    {item.label}
                  </Link>
                );
              }

              const isExpanded = mobileExpanded === item.label;

              return (
                <div key={item.label}>
                  <button
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-body text-sm font-medium text-charcoal transition-colors hover:bg-cream"
                    onClick={() =>
                      setMobileExpanded(isExpanded ? null : item.label)
                    }
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 text-charcoal-light transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="ml-4 border-l-2 border-cream-dark pl-4 pb-2">
                      {item.children?.map((child) =>
                        child.children ? (
                          <div key={child.label} className="mb-3">
                            <div className="mb-1 px-2 py-1 font-body text-[11px] font-semibold uppercase tracking-wider text-charcoal-light">
                              {child.label}
                            </div>
                            {child.children.map((grandchild) => (
                              <Link
                                key={grandchild.label}
                                href={resolveHref(grandchild)}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded px-2 py-2 font-body text-sm text-charcoal transition-colors hover:bg-cream"
                              >
                                {grandchild.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            key={child.label}
                            href={resolveHref(child)}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded px-2 py-2 font-body text-sm text-charcoal transition-colors hover:bg-cream"
                          >
                            {child.label}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-cream-dark pt-6">
            <Link
              href="/inquire"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary block w-full text-center text-sm"
            >
              Plan My Safari
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
