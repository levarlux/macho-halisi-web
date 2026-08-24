import { defineField, defineType } from "sanity";

export const travelInfoArticle = defineType({
  name: "travelInfoArticle",
  title: "Travel Info Article",
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
          { title: "FAQs", value: "faqs" },
          { title: "Climate & Clothing", value: "climate" },
          { title: "Safari Guidelines", value: "guidelines" },
          { title: "Photography", value: "photography" },
          { title: "Currency", value: "currency" },
          { title: "Park Rules", value: "park-rules" },
          { title: "Tipping", value: "tipping" },
          { title: "Health & Safety", value: "health-safety" },
          { title: "Useful Links", value: "useful-links" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "text",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
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
  },
});
