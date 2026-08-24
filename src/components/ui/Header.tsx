import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { navigationQuery } from "@/lib/sanity/queries";
import type { Navigation } from "@/types";
import HeaderInner from "./HeaderInner";

export default async function Header() {
  const nav = await client.fetch<Navigation>(navigationQuery);
  const items = nav?.items || [];

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-light/20 bg-charcoal text-warm-white">
      <div className="container-main flex items-center justify-between py-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta font-display text-lg font-bold text-warm-white">
            MH
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-base font-semibold leading-tight">
              Macho Halisi
            </span>
            <span className="font-body text-[11px] uppercase tracking-[0.2em] text-cream-dark">
              Tanzania Safaris
            </span>
          </div>
        </Link>

        {/* Nav */}
        <HeaderInner items={items} />

        {/* CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+255754474792"
            className="font-body text-xs text-cream-dark transition-colors hover:text-warm-white"
          >
            +255 754 474 792
          </a>
          <Link
            href="/inquire"
            className="rounded-lg bg-terracotta px-5 py-2.5 font-body text-[13px] font-semibold uppercase tracking-wider text-warm-white transition-all hover:bg-terracotta-light hover:shadow-lg"
          >
            Plan My Safari
          </Link>
        </div>
      </div>
    </header>
  );
}
