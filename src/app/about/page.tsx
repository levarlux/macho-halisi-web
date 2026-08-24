import Link from "next/link";
import { urlForWidth } from "@/lib/sanity/image";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { SiteSettings } from "@/types";

export const metadata = {
  title: "Our Company",
  description: "Learn about Macho Halisi Tanzania Safaris — over 14 years crafting lifetime adventures.",
};

export default async function AboutPage() {
  const site = await client.fetch<SiteSettings>(siteSettingsQuery);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-charcoal py-24">
        <div className="container-main">
          <h1 className="text-warm-white">Our Company</h1>
          <div className="divider-editorial" />
        </div>
      </section>

      {/* Story */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-body text-lg leading-relaxed text-charcoal-light">
                Macho Halisi has been crafting exciting safaris and lifetime adventures for visitors
                to Tanzania for over fourteen years. Our founder, Dawson Minja, lives in Karatu with
                wife and three small children. A visionary in Tanzanian tourism, Dawson saw an
                opportunity to provide travellers to his home nation with a safe, exciting option for
                safaris that also offer value for money and set out to make it happen.
              </p>
              <p className="mt-6 font-body text-lg leading-relaxed text-charcoal-light">
                His first venture was to build Kudu Lodge and Campsite, a popular stop on the northern
                safari circuit. From there, the obvious extension was to offer game drives to the nearby
                national parks and other areas of interest. The company now owns 15 vehicles, specifically
                outfitted for optimum wildlife viewing and employs knowledgeable safari guides year round.
                It&apos;s become the favourite of travellers from around the world including America, the UK
                and Europe.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-cream">
              <p className="flex h-full items-center justify-center font-body text-charcoal-light">
                Safari vehicle photo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="bg-cream py-[var(--spacing-section)]">
        <div className="container-main">
          <h2 className="section-heading">Why Book With Us</h2>
          <div className="divider-editorial" />
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Expert Local Knowledge",
                body: "Our qualified safari experts have assisted many travelers to craft the perfect blend of comfort and adventure, ensuring that whatever your desires are, they will make sure your goals are met.",
              },
              {
                title: "14+ Years Experience",
                body: "From the time you contact us until you begin your journey with one of our qualified guides in our well maintained vehicles, we will stop at nothing to ensure you are happy.",
              },
              {
                title: "Arrive as Guest, Leave as Friend",
                body: "We understand the concerns you may have for taking a holiday so far from home. We assure you that you'll arrive as a guest and leave as a friend.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded bg-warm-white p-6">
                <h3 className="font-display text-xl font-semibold text-charcoal">{item.title}</h3>
                <p className="mt-3 font-body text-charcoal-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Home - Karatu */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="section-heading">Our Home — Karatu</h2>
              <div className="divider-editorial" />
              <p className="mt-6 font-body text-lg leading-relaxed text-charcoal-light">
                Macho Halisi&apos;s offices are situated on the Kudu Lodge compound, in the Crater
                Highland town of Karatu. Ideally situated within driving distance to the gate of the
                Ngorongoro Conservation Area, Lake Manyara National Park, Lake Eyasi and Tarangire
                National Park, Karatu is a perfect base for a safari.
              </p>
              <p className="mt-4 font-body text-charcoal-light">
                Besides the Iraqw, nearby are communities of Maasai, Datoga and the last remaining
                bushmen in east Africa, the Hadzaabe. We can arrange village visits to any of these tribes.
              </p>
              <Link href="/inquire" className="btn-primary mt-8 inline-flex">
                Plan Your Safari
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-cream order-1 lg:order-2">
              <p className="flex h-full items-center justify-center font-body text-charcoal-light">
                Karatu landscape photo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-terracotta py-16">
        <div className="container-main text-center">
          <h2 className="font-display text-3xl font-bold text-warm-white">
            Ready to Start Your Adventure?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-warm-white/90">
            We look forward to helping you craft the safari of your dreams.
          </p>
          <a href="tel:+255754474792" className="btn-primary mt-8 inline-flex items-center gap-2 bg-warm-white text-charcoal hover:bg-cream-dark">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
