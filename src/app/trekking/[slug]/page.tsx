import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { routeBySlugQuery, allRouteSlugsQuery } from "@/lib/sanity/queries";
import { urlForWidth } from "@/lib/sanity/image";
import type { MountainRoute } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allRouteSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const route = await client.fetch<MountainRoute>(routeBySlugQuery, { slug });
  if (!route) return { title: "Route Not Found" };
  return {
    title: route.seo?.metaTitle || route.title,
    description: route.seo?.metaDescription || `${route.mountain} trekking route - ${route.duration} days`,
  };
}

const difficultyColors: Record<string, string> = {
  easy: "bg-deep-green",
  moderate: "bg-khaki",
  challenging: "bg-terracotta",
  strenuous: "bg-red-700",
};

export default async function MountainRoutePage({ params }: Props) {
  const { slug } = await params;
  const route = await client.fetch<MountainRoute>(routeBySlugQuery, { slug });
  if (!route) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden bg-charcoal">
        {route.heroImage && (
          <img
            src={urlForWidth(route.heroImage, 1920)}
            alt={route.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="container-main relative flex h-full flex-col justify-end pb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-terracotta px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-warm-white">
              {route.mountain}
            </span>
            <span className="rounded bg-charcoal-light px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-warm-white">
              {route.difficulty}
            </span>
            <span className="font-body text-sm text-cream-dark">
              {route.duration} {route.duration === 1 ? "Day" : "Days"}
            </span>
          </div>
          <h1 className="mt-3 text-warm-white">{route.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main */}
            <div className="lg:col-span-2">
              {/* Overview */}
              {route.overview && (
                <div className="mb-12">
                  <h2 className="section-heading text-2xl">Overview</h2>
                  <div className="divider-editorial" />
                  <p className="mt-6 font-body text-lg leading-relaxed text-charcoal-light">
                    {route.overview}
                  </p>
                </div>
              )}

              {/* Best Season */}
              {route.bestSeason && (
                <div className="mb-8 rounded bg-cream p-6">
                  <h3 className="font-display text-lg font-semibold text-charcoal">Best Time to Go</h3>
                  <p className="mt-2 font-body text-charcoal-light">{route.bestSeason}</p>
                </div>
              )}

              {/* Highlights */}
              {route.highlights && route.highlights.length > 0 && (
                <div className="mb-12">
                  <h2 className="section-heading text-2xl">Highlights</h2>
                  <div className="divider-editorial" />
                  <ul className="mt-6 space-y-3">
                    {route.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-charcoal-light">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Itinerary */}
              {route.itinerary && route.itinerary.length > 0 && (
                <div>
                  <h2 className="section-heading text-2xl">Day-by-Day Itinerary</h2>
                  <div className="divider-editorial" />
                  <div className="mt-6 space-y-8">
                    {route.itinerary.map((day) => (
                      <div key={day.day} className="border-l-2 border-terracotta/30 pl-6">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <h3 className="font-display text-lg font-semibold text-charcoal">
                            Day {day.day}
                          </h3>
                          {day.title && (
                            <span className="font-body text-sm text-charcoal-light">{day.title}</span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 font-body text-xs text-charcoal-light">
                          {day.altitude && <span>Altitude: {day.altitude}</span>}
                          {day.trekkingHours && <span>Trekking: {day.trekkingHours}</span>}
                          {day.overnight && <span>Overnight: {day.overnight}</span>}
                        </div>
                        <p className="mt-3 font-body leading-relaxed text-charcoal-light">
                          {day.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded bg-cream p-6">
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  Plan This Trek
                </h3>
                <Link
                  href={`/inquire?route=${slug}`}
                  className="btn-primary mt-4 block text-center text-sm"
                >
                  Inquire Now
                </Link>
                <div className="mt-6 border-t border-cream-dark pt-6">
                  <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Quick Facts
                  </h4>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-body text-charcoal-light">Mountain</dt>
                      <dd className="font-body font-medium">{route.mountain}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-body text-charcoal-light">Duration</dt>
                      <dd className="font-body font-medium">{route.duration} Days</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-body text-charcoal-light">Difficulty</dt>
                      <dd className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${difficultyColors[route.difficulty] || "bg-charcoal-light"}`} />
                        <span className="font-body font-medium capitalize">{route.difficulty}</span>
                      </dd>
                    </div>
                    {route.bestSeason && (
                      <div className="flex justify-between">
                        <dt className="font-body text-charcoal-light">Best Season</dt>
                        <dd className="font-body font-medium">{route.bestSeason}</dd>
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
      {route.gallery && route.gallery.length > 0 && (
        <section className="bg-cream py-[var(--spacing-section-sm)]">
          <div className="container-main">
            <h2 className="section-heading text-2xl">Gallery</h2>
            <div className="divider-editorial" />
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {route.gallery.map((item, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={urlForWidth(item.image, 800)}
                    alt={item.caption || `${route.title} gallery ${i + 1}`}
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
