import { defineField, defineType } from "sanity";

const routeItineraryDay = {
  name: "routeItineraryDay",
  title: "Route Day",
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
    defineField({
      name: "altitude",
      title: "Altitude",
      type: "string",
    }),
    defineField({
      name: "trekkingHours",
      title: "Trekking Hours",
      type: "string",
    }),
    defineField({
      name: "overnight",
      title: "Overnight Location",
      type: "string",
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

export const route = defineType({
  name: "route",
  title: "Mountain Route",
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
      name: "mountain",
      title: "Mountain",
      type: "string",
      options: {
        list: [
          { title: "Mount Kilimanjaro", value: "kilimanjaro" },
          { title: "Mount Meru", value: "meru" },
          { title: "Ol'doinyo Lengai", value: "lengai" },
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
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Easy", value: "easy" },
          { title: "Moderate", value: "moderate" },
          { title: "Challenging", value: "challenging" },
          { title: "Strenuous", value: "strenuous" },
        ],
      },
    }),
    defineField({
      name: "bestSeason",
      title: "Best Season",
      type: "string",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
    }),
    defineField({
      name: "itinerary",
      title: "Day-by-Day Itinerary",
      type: "array",
      of: [routeItineraryDay],
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
          name: "routeGalleryItem",
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
    select: {
      title: "title",
      subtitle: "mountain",
      media: "heroImage",
    },
    prepare(select: { title?: string; subtitle?: string }) {
      return {
        title: select.title,
        subtitle: select.subtitle,
      };
    },
  },
});
