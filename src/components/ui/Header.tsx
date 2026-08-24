import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { navigationQuery } from "@/lib/sanity/queries";
import type { Navigation } from "@/types";
import HeaderInner from "./HeaderInner";

export default async function Header() {
  const nav = await client.fetch<Navigation>(navigationQuery);
  const items = nav?.items || [];

  return (
    <header className="header-transparent fixed top-0 left-0 right-0 z-50 text-warm-white transition-all duration-500 data-[scrolled=true]:bg-charcoal data-[scrolled=true]:shadow-lg">
      <div className="container-main flex items-center justify-between py-0">
        {/* MH Monogram */}
        <Link href="/" className="relative z-50 flex items-center py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta font-display text-lg font-bold text-warm-white transition-transform hover:scale-105">
            MH
          </div>
        </Link>

        {/* Nav */}
        <HeaderInner items={items} />

        {/* CTA — desktop only */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/inquire"
            className="relative z-50 rounded-lg border-2 border-warm-white/30 px-6 py-2.5 font-body text-[13px] font-semibold uppercase tracking-[0.15em] text-warm-white transition-all hover:border-terracotta hover:bg-terracotta hover:text-warm-white"
          >
            Plan My Safari
          </Link>
        </div>
      </div>
    </header>
  );
}
