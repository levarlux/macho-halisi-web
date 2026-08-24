import { defineField, defineType } from "sanity";

export const accommodation = defineType({
  name: "accommodation",
  title: "Accommodation",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "starRating",
      title: "Star Rating",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "pricingRange",
      title: "Pricing Range",
      type: "string",
      options: {
        list: [
          { title: "Budget", value: "budget" },
          { title: "Mid-Range", value: "mid-range" },
          { title: "Luxury", value: "luxury" },
          { title: "Ultra-Luxury", value: "ultra-luxury" },
        ],
      },
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
          name: "accommodationGalleryItem",
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
      title: "name",
      subtitle: "pricingRange",
      media: "heroImage",
    },
  },
});
