"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function HeaderInner({ items }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 lg:flex">
        {items.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.children && setOpenDropdown(item.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {item.link ? (
              <Link
                href={resolveHref(item)}
                className="block px-3 py-2 font-body text-sm font-medium uppercase tracking-wide transition-colors hover:text-terracotta-light"
              >
                {item.label}
              </Link>
            ) : (
              <button
                className="flex items-center gap-1 px-3 py-2 font-body text-sm font-medium uppercase tracking-wide transition-colors hover:text-terracotta-light"
                aria-expanded={openDropdown === item.label}
              >
                {item.label}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}

            {item.children && openDropdown === item.label && (
              <div className="absolute left-0 top-full min-w-[220px] border-t-2 border-terracotta bg-charcoal py-2 shadow-lg">
                {item.children.map((child) =>
                  child.children ? (
                    <div key={child.label}>
                      <div className="px-4 py-1 font-body text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                        {child.label}
                      </div>
                      {child.children.map((grandchild) => (
                        <Link
                          key={grandchild.label}
                          href={resolveHref(grandchild)}
                          className="block px-6 py-1.5 font-body text-sm transition-colors hover:bg-charcoal-light hover:text-warm-white"
                        >
                          {grandchild.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={child.label}
                      href={resolveHref(child)}
                      className="block px-4 py-1.5 font-body text-sm transition-colors hover:bg-charcoal-light hover:text-warm-white"
                    >
                      {child.label}
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-charcoal-light bg-charcoal px-4 pb-6 lg:hidden">
          {items.map((item) => (
            <div key={item.label}>
              {item.link ? (
                <Link
                  href={resolveHref(item)}
                  className="block border-b border-charcoal-light py-3 font-body text-sm font-medium uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    className="flex w-full items-center justify-between border-b border-charcoal-light py-3 font-body text-sm font-medium uppercase tracking-wide"
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-4">
                      {item.children?.map((child) =>
                        child.children ? (
                          <div key={child.label}>
                            <div className="py-2 font-body text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                              {child.label}
                            </div>
                            {child.children.map((grandchild) => (
                              <Link
                                key={grandchild.label}
                                href={resolveHref(grandchild)}
                                className="block py-1.5 pl-4 font-body text-sm"
                              >
                                {grandchild.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            key={child.label}
                            href={resolveHref(child)}
                            className="block py-2 font-body text-sm"
                          >
                            {child.label}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <Link href="/inquire" className="btn-primary mt-4 w-full text-center text-xs">
            Plan My Safari
          </Link>
        </div>
      )}

      {/* Mobile toggle */}
      <button
        className="flex h-10 w-10 items-center justify-center lg:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </>
  );
}
