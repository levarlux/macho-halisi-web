import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { homePageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { urlFor, urlForWidth } from "@/lib/sanity/image";
import type { HomePage, SiteSettings } from "@/types";

export default async function HomePage() {
  const [homeData, siteData] = await Promise.all([
    client.fetch<HomePage>(homePageQuery),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ]);

  if (!homeData) {
    return (
      <div className="container-main py-24 text-center">
        <h1>Welcome to Macho Halisi Tanzania Safaris</h1>
        <p className="mt-4 text-charcoal-light">
          Content is being configured in Sanity Studio. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[80vh] min-h-[500px] overflow-hidden bg-charcoal">
        {homeData.heroSlides?.[0]?.image && (
          <img
            src={urlForWidth(homeData.heroSlides[0].image, 1920)}
            alt={homeData.heroSlides[0].headline}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
        <div className="container-main relative flex h-full flex-col justify-end pb-16 md:pb-24">
          <h1 className="max-w-3xl text-warm-white drop-shadow-lg">
            {homeData.heroSlides?.[0]?.headline || siteData?.tagline}
          </h1>
          {homeData.heroSlides?.[0]?.subheadline && (
            <p className="mt-4 max-w-2xl font-body text-lg text-cream-dark drop-shadow md:text-xl">
              {homeData.heroSlides[0].subheadline}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={homeData.heroSlides?.[0]?.ctaLink || "/inquire"}
              className="btn-primary"
            >
              {homeData.heroSlides?.[0]?.ctaLabel || "Plan My Safari"}
            </Link>
            <Link
              href="/about"
              className="btn-secondary border-warm-white text-warm-white hover:bg-warm-white hover:text-charcoal"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      {homeData.intro && (
        <section className="bg-warm-white py-[var(--spacing-section)]">
          <div className="container-main">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="section-heading">{homeData.intro.heading}</h2>
              <div className="divider-editorial mx-auto" />
              <p className="section-subheading mx-auto mt-6">
                {homeData.intro.body}
              </p>
            </div>
            {homeData.intro.trustBadges && homeData.intro.trustBadges.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                {homeData.intro.trustBadges.map((badge, i) => (
                  <div key={i} className="text-center">
                    <span className="text-3xl">{badge.icon}</span>
                    <p className="mt-2 font-body text-sm font-medium text-charcoal">
                      {badge.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Offerings ── */}
      {homeData.offeringCards && homeData.offeringCards.length > 0 && (
        <section className="bg-cream py-[var(--spacing-section)]">
          <div className="container-main">
            <div className="mb-12">
              <h2 className="section-heading">Explore Tanzania</h2>
              <div className="divider-editorial" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homeData.offeringCards.map((card, i) => {
                const href = card.link?.slug?.current
                  ? `/${card.link._type === "tourPackage" ? "safaris" : card.link._type === "route" ? "trekking" : ""}/${card.link.slug.current}`
                  : "#";
                return (
                  <Link key={i} href={href} className="group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {card.image && (
                        <img
                          src={urlForWidth(card.image, 800)}
                          alt={card.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-display text-xl font-semibold text-warm-white drop-shadow">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="mt-1 font-body text-sm text-cream-dark drop-shadow">
                            {card.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Guides Section ── */}
      {homeData.guidesSection && (
        <section className="bg-warm-white py-[var(--spacing-section)]">
          <div className="container-main">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="section-heading">{homeData.guidesSection.heading}</h2>
                <div className="divider-editorial" />
                <p className="mt-6 font-body text-lg leading-relaxed text-charcoal-light">
                  {homeData.guidesSection.body}
                </p>
                <Link href="/about/why-book" className="btn-primary mt-8 inline-flex">
                  Why Book With Us
                </Link>
              </div>
              {homeData.guidesSection.image && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={urlForWidth(homeData.guidesSection.image, 800)}
                    alt={homeData.guidesSection.heading}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Video ── */}
      {homeData.featuredVideo?.youtubeUrl && (
        <section className="bg-charcoal py-[var(--spacing-section)]">
          <div className="container-main">
            <h2 className="section-heading text-center text-warm-white">
              Experience the Wild
            </h2>
            <div className="divider-editorial mx-auto" />
            <div className="mx-auto mt-8 max-w-4xl">
              <div className="relative aspect-video overflow-hidden rounded">
                <iframe
                  src={homeData.featuredVideo.youtubeUrl.replace("watch?v=", "embed/")}
                  title={homeData.featuredVideo.caption || "Safari video"}
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                />
              </div>
              {homeData.featuredVideo.caption && (
                <p className="mt-4 text-center font-body text-sm text-cream-dark">
                  {homeData.featuredVideo.caption}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {homeData.gallery && homeData.gallery.length > 0 && (
        <section className="bg-cream py-[var(--spacing-section)]">
          <div className="container-main">
            <h2 className="section-heading text-center">From the Field</h2>
            <div className="divider-editorial mx-auto" />
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {homeData.gallery.map((item, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden">
                  <img
                    src={urlForWidth(item.image, 600)}
                    alt={item.caption || `Gallery ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="p-4 font-body text-sm text-warm-white">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="bg-terracotta py-16">
        <div className="container-main text-center">
          <h2 className="font-display text-3xl font-bold text-warm-white md:text-4xl">
            Ready for the Adventure of a Lifetime?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-warm-white/90">
            Let us craft your perfect Tanzania safari. From the Serengeti to
            Kilimanjaro, your journey starts with a conversation.
          </p>
          <Link
            href="/inquire"
            className="btn-primary mt-8 bg-warm-white text-charcoal hover:bg-cream-dark"
          >
            Start Planning
          </Link>
        </div>
      </section>
    </>
  );
}
