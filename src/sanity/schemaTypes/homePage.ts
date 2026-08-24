import { defineField, defineType } from "sanity";

const heroSlide = {
  name: "heroSlide",
  title: "Hero Slide",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      initialValue: "Explore",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "headline", media: "image" },
  },
};

const offeringCard = {
  name: "offeringCard",
  title: "Offering Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "link",
      title: "Link To",
      type: "reference",
      to: [
        { type: "tourPackage" },
        { type: "route" },
        { type: "region" },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
};

const trustBadge = {
  name: "trustBadge",
  title: "Trust Badge",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
    }),
  ],
};

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero Slides",
      type: "array",
      of: [heroSlide],
    }),
    defineField({
      name: "intro",
      title: "Introduction Section",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body Text", type: "text" }),
        defineField({
          name: "trustBadges",
          title: "Trust Badges",
          type: "array",
          of: [trustBadge],
        }),
      ],
    }),
    defineField({
      name: "offeringCards",
      title: "Offering Cards",
      type: "array",
      of: [offeringCard],
    }),
    defineField({
      name: "guidesSection",
      title: "Guides Section",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body Text", type: "text" }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "featuredVideo",
      title: "Featured Video",
      type: "object",
      fields: [
        defineField({
          name: "youtubeUrl",
          title: "YouTube URL",
          type: "url",
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "object",
          name: "galleryItem",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "caption", media: "image" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
