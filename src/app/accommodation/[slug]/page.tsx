import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { accommodationBySlugQuery, allAccommodationSlugsQuery } from "@/lib/sanity/queries";
import { urlForWidth } from "@/lib/sanity/image";
import type { Accommodation } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allAccommodationSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const acc = await client.fetch<Accommodation>(accommodationBySlugQuery, { slug });
  if (!acc) return { title: "Accommodation Not Found" };
  return {
    title: acc.seo?.metaTitle || acc.name,
    description: acc.seo?.metaDescription || acc.description?.slice(0, 160),
  };
}

const pricingLabels: Record<string, string> = {
  budget: "Budget",
  "mid-range": "Mid-Range",
  luxury: "Luxury",
  "ultra-luxury": "Ultra-Luxury",
};

export default async function AccommodationPage({ params }: Props) {
  const { slug } = await params;
  const acc = await client.fetch<Accommodation>(accommodationBySlugQuery, { slug });
  if (!acc) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden bg-charcoal">
        {acc.heroImage && (
          <img
            src={urlForWidth(acc.heroImage, 1920)}
            alt={acc.name}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="container-main relative flex h-full flex-col justify-end pb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-terracotta px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-warm-white">
              {pricingLabels[acc.pricingRange] || acc.pricingRange}
            </span>
            {acc.starRating && (
              <span className="font-body text-sm text-cream-dark">
                {"★".repeat(acc.starRating)}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-warm-white">{acc.name}</h1>
          {acc.region && (
            <p className="mt-2 font-body text-cream-dark">{acc.region.name}, Tanzania</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Description */}
              {acc.description && (
                <div className="mb-12">
                  <p className="font-body text-lg leading-relaxed text-charcoal-light">
                    {acc.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {acc.amenities && acc.amenities.length > 0 && (
                <div className="mb-12">
                  <h2 className="section-heading text-2xl">Amenities</h2>
                  <div className="divider-editorial" />
                  <ul className="mt-6 grid grid-cols-2 gap-3">
                    {acc.amenities.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 font-body text-charcoal-light">
                        <span className="text-terracotta">✓</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded bg-cream p-6">
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  Book This Property
                </h3>
                <p className="mt-2 font-body text-sm text-charcoal-light">
                  Inquire about availability and rates.
                </p>
                <Link
                  href={`/inquire?accommodation=${slug}`}
                  className="btn-primary mt-4 block text-center text-sm"
                >
                  Inquire Now
                </Link>
                <div className="mt-6 border-t border-cream-dark pt-6">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-body text-charcoal-light">Category</dt>
                      <dd className="font-body font-medium">{pricingLabels[acc.pricingRange]}</dd>
                    </div>
                    {acc.starRating && (
                      <div className="flex justify-between">
                        <dt className="font-body text-charcoal-light">Rating</dt>
                        <dd className="font-body font-medium">{"★".repeat(acc.starRating)}</dd>
                      </div>
                    )}
                    {acc.region && (
                      <div className="flex justify-between">
                        <dt className="font-body text-charcoal-light">Location</dt>
                        <dd className="font-body font-medium">{acc.region.name}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {acc.gallery && acc.gallery.length > 0 && (
        <section className="bg-cream py-[var(--spacing-section-sm)]">
          <div className="container-main">
            <h2 className="section-heading text-2xl">Gallery</h2>
            <div className="divider-editorial" />
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {acc.gallery.map((item, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={urlForWidth(item.image, 800)}
                    alt={item.caption || `${acc.name} gallery ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
