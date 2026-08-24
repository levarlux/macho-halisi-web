const FOOTER_SECTIONS = [
  {
    title: "Safaris",
    links: [
      { label: "6 Days Northern Parks", href: "/safaris/6-days-northern-parks" },
      { label: "7 Days Northern Parks", href: "/safaris/7-days-northern-parks" },
      { label: "7 Days Forest & Plains", href: "/safaris/7-days-forest-plains" },
      { label: "Safari Inclusions", href: "/safaris/inclusions" },
    ],
  },
  {
    title: "Trekking",
    links: [
      { label: "Kilimanjaro", href: "/trekking/kilimanjaro" },
      { label: "Mount Meru", href: "/trekking/meru" },
      { label: "Ol'doinyo Lengai", href: "/trekking/lengai" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Zanzibar", href: "/zanzibar" },
      { label: "Swahili Coast", href: "/swahili-coast/pangani" },
      { label: "Cultural Tours", href: "/cultural-tours" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Why Book With Us", href: "/about/why-book" },
      { label: "Our Home – Karatu", href: "/about/karatu" },
      { label: "Contacts", href: "/contacts" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-warm-white">
      <div className="container-main py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-terracotta font-display text-lg font-bold">
                MH
              </div>
              <span className="font-display text-lg font-semibold">
                Macho Halisi
              </span>
            </div>
            <p className="mb-6 font-body text-sm leading-relaxed text-cream-dark">
              Your passport to adventure 365 days a year. Locally owned and
              operated, crafting lifetime safaris across Tanzania.
            </p>
            <div className="space-y-2 font-body text-sm">
              <p>Karatu, Arusha – Tanzania</p>
              <p>
                <a href="tel:+255754474792" className="transition-colors hover:text-terracotta-light">
                  +255 754 474 792
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@machohalisi.com"
                  className="transition-colors hover:text-terracotta-light"
                >
                  info@machohalisi.com
                </a>
              </p>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-cream-dark">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-body text-sm transition-colors hover:text-terracotta-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-charcoal-light pt-8 md:flex-row">
          <p className="font-body text-xs text-charcoal-light">
            © 2026 Macho Halisi LTD. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/MACHOHALISITOUR/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs transition-colors hover:text-terracotta-light"
            >
              Facebook
            </a>
            <a href="/privacy" className="font-body text-xs transition-colors hover:text-terracotta-light">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
