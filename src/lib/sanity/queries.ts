import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    logo { asset->{url, metadata { dimensions } } },
    companyName,
    tagline,
    slogan,
    phone,
    email,
    socialLinks,
    footerText
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroSlides[] {
      headline,
      subheadline,
      image { asset->{url, metadata { dimensions } } },
      ctaLabel,
      ctaLink
    },
    intro {
      heading,
      body,
      trustBadges[] {
        text,
        icon
      }
    },
    offeringCards[] {
      title,
      subtitle,
      image { asset->{url, metadata { dimensions } } },
      link-> {
        _type,
        slug
      }
    },
    guidesSection {
      heading,
      body,
      image { asset->{url, metadata { dimensions } } }
    },
    featuredVideo {
      youtubeUrl,
      caption
    },
    gallery[] {
      image { asset->{url, metadata { dimensions } } },
      caption
    }
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    items[] {
      label,
      link-> {
        _type,
        slug
      },
      children[] {
        label,
        link-> {
          _type,
          slug
        },
        children[] {
          label,
          link-> {
            _type,
            slug
          }
        }
      }
    }
  }
`;

export const tourPackageBySlugQuery = groq`
  *[_type == "tourPackage" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    duration,
    highlights,
    itinerary[] {
      day,
      title,
      description
    },
    inclusions,
    exclusions,
    region-> {
      name,
      slug
    },
    heroImage { asset->{url, metadata { dimensions } } },
    gallery[] {
      image { asset->{url, metadata { dimensions } } },
      caption
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export const routeBySlugQuery = groq`
  *[_type == "route" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mountain,
    duration,
    difficulty,
    bestSeason,
    highlights,
    overview,
    itinerary[] {
      day,
      title,
      description,
      altitude,
      trekkingHours,
      overnight
    },
    heroImage { asset->{url, metadata { dimensions } } },
    gallery[] {
      image { asset->{url, metadata { dimensions } } },
      caption
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export const regionBySlugQuery = groq`
  *[_type == "region" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    highlights,
    bestTimeToVisit,
    heroImage { asset->{url, metadata { dimensions } } },
    gallery[] {
      image { asset->{url, metadata { dimensions } } },
      caption
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export const accommodationBySlugQuery = groq`
  *[_type == "accommodation" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    amenities,
    starRating,
    pricingRange,
    region-> {
      name,
      slug
    },
    heroImage { asset->{url, metadata { dimensions } } },
    gallery[] {
      image { asset->{url, metadata { dimensions } } },
      caption
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export const travelInfoBySlugQuery = groq`
  *[_type == "travelInfoArticle" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    body,
    heroImage { asset->{url, metadata { dimensions } } },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export const allTourPackagesQuery = groq`
  *[_type == "tourPackage"] | order(title asc) {
    _id,
    title,
    slug,
    category,
    duration,
    heroImage { asset->{url, metadata { dimensions } } }
  }
`;

export const allRegionsQuery = groq`
  *[_type == "region"] | order(name asc) {
    _id,
    name,
    slug,
    heroImage { asset->{url, metadata { dimensions } } }
  }
`;

export const allAccommodationsQuery = groq`
  *[_type == "accommodation"] | order(name asc) {
    _id,
    name,
    slug,
    starRating,
    pricingRange,
    region-> {
      name,
      slug
    },
    heroImage { asset->{url, metadata { dimensions } } }
  }
`;

export const allRoutesQuery = groq`
  *[_type == "route"] | order(mountain asc, title asc) {
    _id,
    title,
    slug,
    mountain,
    duration,
    difficulty,
    heroImage { asset->{url, metadata { dimensions } } }
  }
`;

export const allTravelInfoQuery = groq`
  *[_type == "travelInfoArticle"] | order(category asc, title asc) {
    _id,
    title,
    slug,
    category
  }
`;

// ── Generic CMS Page ──────────────────────────────────────

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    heroImage { asset->{url, metadata { dimensions } } },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ── Slug Lists for generateStaticParams ───────────────────

export const allTourPackageSlugsQuery = groq`
  *[_type == "tourPackage"] { "slug": slug.current }
`;

export const allRouteSlugsQuery = groq`
  *[_type == "route"] { "slug": slug.current }
`;

export const allRegionSlugsQuery = groq`
  *[_type == "region"] { "slug": slug.current }
`;

export const allAccommodationSlugsQuery = groq`
  *[_type == "accommodation"] { "slug": slug.current }
`;

export const allTravelInfoSlugsQuery = groq`
  *[_type == "travelInfoArticle"] { "slug": slug.current }
`;

export const allPageSlugsQuery = groq`
  *[_type == "page"] { "slug": slug.current }
`;
