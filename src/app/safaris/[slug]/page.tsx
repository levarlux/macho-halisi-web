import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { tourPackageBySlugQuery, allTourPackageSlugsQuery } from "@/lib/sanity/queries";
import { urlForWidth } from "@/lib/sanity/image";
import type { TourPackage } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allTourPackageSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pkg = await client.fetch<TourPackage>(tourPackageBySlugQuery, { slug });
  if (!pkg) return { title: "Safari Not Found" };
  return {
    title: pkg.seo?.metaTitle || pkg.title,
    description: pkg.seo?.metaDescription || `${pkg.duration}-day ${pkg.category} safari in Tanzania`,
  };
}

export default async function TourPackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = await client.fetch<TourPackage>(tourPackageBySlugQuery, { slug });
  if (!pkg) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden bg-charcoal">
        {pkg.heroImage && (
          <img
            src={urlForWidth(pkg.heroImage, 1920)}
            alt={pkg.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="container-main relative flex h-full flex-col justify-end pb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-terracotta px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-warm-white">
              {pkg.category}
            </span>
            <span className="font-body text-sm text-cream-dark">
              {pkg.duration} {pkg.duration === 1 ? "Day" : "Days"}
            </span>
          </div>
          <h1 className="mt-3 text-warm-white">{pkg.title}</h1>
          {pkg.region && (
            <p className="mt-2 font-body text-cream-dark">{pkg.region.name}, Tanzania</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <div className="mb-12">
                  <h2 className="section-heading text-2xl">Highlights</h2>
                  <div className="divider-editorial" />
                  <ul className="mt-6 space-y-3">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-charcoal-light">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Itinerary */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <div className="mb-12">
                  <h2 className="section-heading text-2xl">Itinerary</h2>
                  <div className="divider-editorial" />
                  <div className="mt-6 space-y-6">
                    {pkg.itinerary.map((day) => (
                      <div key={day.day} className="border-l-2 border-terracotta/30 pl-6">
                        <h3 className="font-display text-lg font-semibold text-charcoal">
                          Day {day.day}
                          {day.title && <span className="text-charcoal-light">: {day.title}</span>}
                        </h3>
                        <p className="mt-2 font-body text-charcoal-light leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions / Exclusions */}
              <div className="grid gap-8 sm:grid-cols-2">
                {pkg.inclusions && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-charcoal">Included</h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-charcoal-light">
                      {pkg.inclusions}
                    </p>
                  </div>
                )}
                {pkg.exclusions && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-charcoal">Not Included</h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-charcoal-light">
                      {pkg.exclusions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded bg-cream p-6">
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  Interested in this safari?
                </h3>
                <p className="mt-2 font-body text-sm text-charcoal-light">
                  Fill out the inquiry form and we&apos;ll get back to you within 24 hours.
                </p>
                <Link
                  href={`/inquire?tour=${slug}`}
                  className="btn-primary mt-6 block text-center text-sm"
                >
                  Inquire Now
                </Link>
                <div className="mt-6 border-t border-cream-dark pt-6">
                  <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Quick Facts
                  </h4>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-body text-charcoal-light">Duration</dt>
                      <dd className="font-body font-medium">{pkg.duration} Days</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-body text-charcoal-light">Type</dt>
                      <dd className="font-body font-medium capitalize">{pkg.category}</dd>
                    </div>
                    {pkg.region && (
                      <div className="flex justify-between">
                        <dt className="font-body text-charcoal-light">Region</dt>
                        <dd className="font-body font-medium">{pkg.region.name}</dd>
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
      {pkg.gallery && pkg.gallery.length > 0 && (
        <section className="bg-cream py-[var(--spacing-section-sm)]">
          <div className="container-main">
            <h2 className="section-heading text-2xl">Gallery</h2>
            <div className="divider-editorial" />
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {pkg.gallery.map((item, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={urlForWidth(item.image, 800)}
                    alt={item.caption || `${pkg.title} gallery ${i + 1}`}
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
