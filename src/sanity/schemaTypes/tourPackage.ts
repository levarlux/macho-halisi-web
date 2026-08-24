import { defineField, defineType } from "sanity";

const itineraryDay = {
  name: "itineraryDay",
  title: "Itinerary Day",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Day Number",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Day Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "day" },
    prepare(select: { title?: string; subtitle?: number }) {
      return {
        title: `Day ${select.subtitle}: ${select.title || "Untitled"}`,
      };
    },
  },
};

export const tourPackage = defineType({
  name: "tourPackage",
  title: "Tour Package",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Wildlife Safari", value: "wildlife" },
          { title: "Cultural Tour", value: "cultural" },
          { title: "Beach Holiday", value: "beach" },
          { title: "Mountain Trekking", value: "trekking" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration (days)",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "itinerary",
      title: "Day-by-Day Itinerary",
      type: "array",
      of: [itineraryDay],
    }),
    defineField({
      name: "inclusions",
      title: "What's Included",
      type: "text",
    }),
    defineField({
      name: "exclusions",
      title: "What's Not Included",
      type: "text",
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "region" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "object",
          name: "tourGalleryItem",
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
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "heroImage" },
    prepare(select: { title?: string; subtitle?: string }) {
      return {
        title: select.title,
        subtitle: select.subtitle ? select.subtitle.charAt(0).toUpperCase() + select.subtitle.slice(1) : undefined,
      };
    },
  },
});
