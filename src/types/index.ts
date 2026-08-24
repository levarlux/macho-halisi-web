import type { SanityImageSource } from "@sanity/image-url";

export interface SanityImage {
  asset: {
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
}

export interface SiteSettings {
  logo: SanityImageSource;
  companyName: string;
  tagline: string;
  slogan: string;
  phone: string;
  email: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  footerText: string;
}

export interface HeroSlide {
  headline: string;
  subheadline: string;
  image: SanityImageSource;
  ctaLabel: string;
  ctaLink: string;
}

export interface OfferingCard {
  title: string;
  subtitle: string;
  image: SanityImageSource;
  link: {
    _type: string;
    slug: { current: string };
  };
}

export interface HomePage {
  heroSlides: HeroSlide[];
  intro: {
    heading: string;
    body: string;
    trustBadges: { text: string; icon: string }[];
  };
  offeringCards: OfferingCard[];
  guidesSection: {
    heading: string;
    body: string;
    image: SanityImageSource;
  };
  featuredVideo: {
    youtubeUrl: string;
    caption: string;
  };
  gallery: { image: SanityImageSource; caption: string }[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude?: string;
  trekkingHours?: string;
  overnight?: string;
}

export interface TourPackage {
  _id: string;
  title: string;
  slug: { current: string };
  category: "wildlife" | "cultural" | "beach" | "trekking";
  duration: number;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string;
  exclusions: string;
  region: { name: string; slug: { current: string } };
  heroImage: SanityImageSource;
  gallery: { image: SanityImageSource; caption: string }[];
  seo: { metaTitle: string; metaDescription: string };
}

export interface MountainRoute {
  _id: string;
  title: string;
  slug: { current: string };
  mountain: string;
  duration: number;
  difficulty: "easy" | "moderate" | "challenging" | "strenuous";
  bestSeason: string;
  highlights: string[];
  overview: string;
  itinerary: ItineraryDay[];
  heroImage: SanityImageSource;
  gallery: { image: SanityImageSource; caption: string }[];
  seo: { metaTitle: string; metaDescription: string };
}

export interface Region {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  heroImage: SanityImageSource;
  gallery: { image: SanityImageSource; caption: string }[];
  seo: { metaTitle: string; metaDescription: string };
}

export interface Accommodation {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  amenities: string[];
  starRating: number;
  pricingRange: "budget" | "mid-range" | "luxury" | "ultra-luxury";
  region: { name: string; slug: { current: string } };
  heroImage: SanityImageSource;
  gallery: { image: SanityImageSource; caption: string }[];
  seo: { metaTitle: string; metaDescription: string };
}

export interface TravelInfoArticle {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  body: string;
  heroImage: SanityImageSource;
  seo: { metaTitle: string; metaDescription: string };
}

export interface NavigationItem {
  label: string;
  link: { _type: string; slug: { current: string } };
  children?: NavigationItem[];
}

export interface Navigation {
  items: NavigationItem[];
}

export interface Page {
  _id: string;
  title: string;
  slug: { current: string };
  body: string;
  seo: { metaTitle: string; metaDescription: string };
}
