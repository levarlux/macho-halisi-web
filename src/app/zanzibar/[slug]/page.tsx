import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { regionBySlugQuery, allRegionSlugsQuery } from "@/lib/sanity/queries";
import { urlForWidth } from "@/lib/sanity/image";
import type { Region } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allRegionSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const region = await client.fetch<Region>(regionBySlugQuery, { slug });
  if (!region) return { title: "Destination Not Found" };
  return {
    title: region.seo?.metaTitle || region.name,
    description: region.seo?.metaDescription || region.description?.slice(0, 160),
  };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = await client.fetch<Region>(regionBySlugQuery, { slug });
  if (!region) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden bg-charcoal">
        {region.heroImage && (
          <img
            src={urlForWidth(region.heroImage, 1920)}
            alt={region.name}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="container-main relative flex h-full flex-col justify-end pb-12">
          <h1 className="text-warm-white">{region.name}</h1>
          <p className="mt-2 max-w-2xl font-body text-lg text-cream-dark">Tanzania</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            {/* Description */}
            {region.description && (
              <div className="mb-12">
                <p className="font-body text-lg leading-relaxed text-charcoal-light">
                  {region.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {region.highlights && region.highlights.length > 0 && (
              <div className="mb-12">
                <h2 className="section-heading text-2xl">Highlights</h2>
                <div className="divider-editorial" />
                <ul className="mt-6 space-y-3">
                  {region.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-charcoal-light">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Best time to visit */}
            {region.bestTimeToVisit && (
              <div className="mb-12 rounded bg-cream p-6">
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  Best Time to Visit
                </h3>
                <p className="mt-2 font-body text-charcoal-light">{region.bestTimeToVisit}</p>
              </div>
            )}

            <Link href="/inquire" className="btn-primary">
              Plan Your Visit
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {region.gallery && region.gallery.length > 0 && (
        <section className="bg-cream py-[var(--spacing-section-sm)]">
          <div className="container-main">
            <h2 className="section-heading text-2xl">Gallery</h2>
            <div className="divider-editorial" />
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {region.gallery.map((item, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={urlForWidth(item.image, 800)}
                    alt={item.caption || `${region.name} gallery ${i + 1}`}
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
