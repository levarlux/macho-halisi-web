import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import StickyCTA from "@/components/ui/StickyCTA";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://machohalisi.com"),
  title: {
    default: "Macho Halisi Tanzania Safaris — Serengeti, Kilimanjaro, Zanzibar",
    template: "%s | Macho Halisi Tanzania Safaris",
  },
  description:
    "Locally owned Tanzania safari operator. Safaris, Kilimanjaro trekking, Zanzibar beach holidays, and cultural tours. Over 14 years of crafting lifetime adventures.",
  keywords: [
    "Tanzania safari",
    "Serengeti National Park",
    "Kilimanjaro trekking",
    "Zanzibar holiday",
    "Ngorongoro Crater",
    "safari operator",
    "Tanzania tours",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Macho Halisi Tanzania Safaris",
    title: "Macho Halisi Tanzania Safaris",
    description: "Your passport to adventure 365 days a year. Locally owned Tanzania safaris, Kilimanjaro trekking, and Zanzibar beach holidays.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Macho Halisi Tanzania Safaris",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${sourceSans.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
