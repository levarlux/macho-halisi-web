import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { navigationQuery } from "@/lib/sanity/queries";
import type { Navigation } from "@/types";
import HeaderInner from "./HeaderInner";

export default async function Header() {
  const nav = await client.fetch<Navigation>(navigationQuery);
  const items = nav?.items || [];

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-warm-white">
      <div className="container-main flex items-center justify-between py-4">
        {/* Logo placeholder */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-terracotta font-display text-xl font-bold text-warm-white">
            MH
          </div>
          <span className="hidden font-display text-lg font-semibold md:block">
            Macho Halisi
          </span>
        </Link>

        <HeaderInner items={items} />

        {/* CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/inquire" className="btn-primary text-xs">
            Plan My Safari
          </Link>
        </div>
      </div>
    </header>
  );
}
