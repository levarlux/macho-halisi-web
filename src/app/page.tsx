import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { homePageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { urlForWidth } from "@/lib/sanity/image";
import type { HomePage, SiteSettings } from "@/types";
import HeroCarousel from "@/components/ui/HeroCarousel";

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

  // Filter slides that have images for the carousel
  const heroSlides = homeData.heroSlides?.filter((s) => s.image) || [];

  return (
    <>
      {/* ── Hero Carousel ── */}
      {heroSlides.length > 0 ? (
        <HeroCarousel slides={heroSlides} />
      ) : (
        <section className="relative h-screen min-h-[600px] flex items-end bg-charcoal">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
          <div className="container-main relative pb-24 md:pb-32">
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
              Macho Halisi Tanzania Safaris
            </p>
            <h1 className="font-display text-4xl font-bold text-warm-white md:text-6xl lg:text-7xl">
              {siteData?.tagline || "Tanzania Safaris"}
            </h1>
            <p className="mt-4 max-w-xl font-body text-warm-white/80">
              {siteData?.slogan || "Your passport to adventure 365 days a year"}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/inquire" className="rounded-lg bg-terracotta px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-warm-white transition-all hover:bg-terracotta-light">
                Plan My Safari
              </Link>
              <Link href="/about" className="rounded-lg border border-warm-white/30 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-warm-white transition-all hover:border-warm-white hover:bg-warm-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Intro ── */}
      {homeData.intro && (
        <section className="bg-warm-white py-[var(--spacing-section)]">
          <div className="container-main">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
                Welcome
              </p>
              <h2 className="section-heading">{homeData.intro.heading}</h2>
              <div className="divider-editorial mx-auto" />
              <p className="section-subheading mx-auto mt-6">
                {homeData.intro.body}
              </p>
            </div>
            {homeData.intro.trustBadges && homeData.intro.trustBadges.length > 0 && (
              <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                {homeData.intro.trustBadges.map((badge, i) => (
                  <div key={i} className="text-center">
                    <span className="text-3xl">{badge.icon}</span>
                    <p className="mt-3 font-body text-sm font-medium text-charcoal">
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
            <div className="mb-14 text-center">
              <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
                What We Offer
              </p>
              <h2 className="section-heading">Explore Tanzania</h2>
              <div className="divider-editorial mx-auto" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homeData.offeringCards.map((card, i) => {
                const href = card.link?.slug?.current
                  ? `/${card.link._type === "tourPackage" ? "safaris" : card.link._type === "route" ? "trekking" : ""}/${card.link.slug.current}`
                  : "#";
                return (
                  <Link key={i} href={href} className="group">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      {card.image && (
                        <img
                          src={urlForWidth(card.image, 800)}
                          alt={card.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-display text-xl font-semibold text-warm-white">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="mt-1 font-body text-sm text-warm-white/70">
                            {card.subtitle}
                          </p>
                        )}
                        <span className="mt-3 inline-block font-body text-xs font-semibold uppercase tracking-wider text-terracotta-light transition-all group-hover:translate-x-1">
                          Discover →
                        </span>
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
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
                  Our Team
                </p>
                <h2 className="section-heading">{homeData.guidesSection.heading}</h2>
                <div className="divider-editorial" />
                <p className="mt-6 font-body text-lg leading-relaxed text-charcoal-light">
                  {homeData.guidesSection.body}
                </p>
                <Link
                  href="/about"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-charcoal px-6 py-3 font-body text-sm font-semibold uppercase tracking-wider text-charcoal transition-all hover:bg-charcoal hover:text-warm-white"
                >
                  Why Book With Us
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              {homeData.guidesSection.image && (
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={urlForWidth(homeData.guidesSection.image, 800)}
                    alt={homeData.guidesSection.heading}
                    className="aspect-[4/3] w-full object-cover"
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
            <div className="mb-12 text-center">
              <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
                Watch
              </p>
              <h2 className="section-heading text-warm-white">Experience the Wild</h2>
              <div className="divider-editorial mx-auto" />
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <iframe
                  src={homeData.featuredVideo.youtubeUrl.replace("watch?v=", "embed/")}
                  title={homeData.featuredVideo.caption || "Safari video"}
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {homeData.gallery && homeData.gallery.length > 0 && (
        <section className="bg-cream py-[var(--spacing-section)]">
          <div className="container-main">
            <div className="mb-12 text-center">
              <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
                Gallery
              </p>
              <h2 className="section-heading">From the Field</h2>
              <div className="divider-editorial mx-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {homeData.gallery.map((item, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={urlForWidth(item.image, 600)}
                    alt={item.caption || `Gallery ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
      <section className="relative overflow-hidden bg-terracotta py-20">
        <div className="absolute inset-0 bg-[url('/favicon.svg')] bg-center bg-no-repeat opacity-5" />
        <div className="container-main relative text-center">
          <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-warm-white/70">
            Start Your Journey
          </p>
          <h2 className="font-display text-3xl font-bold text-warm-white md:text-5xl">
            Ready for the Adventure<br className="hidden md:block" /> of a Lifetime?
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-body text-lg text-warm-white/90">
            Let us craft your perfect Tanzania safari. From the Serengeti to
            Kilimanjaro, your journey starts with a conversation.
          </p>
          <Link
            href="/inquire"
            className="mt-10 inline-flex rounded-lg bg-warm-white px-10 py-4 font-body text-sm font-semibold uppercase tracking-wider text-charcoal transition-all hover:bg-cream-dark hover:shadow-xl"
          >
            Start Planning
          </Link>
        </div>
      </section>
    </>
  );
}
