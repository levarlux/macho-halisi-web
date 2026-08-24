import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Serengeti", value: "serengeti" },
          { title: "Ngorongoro", value: "ngorongoro" },
          { title: "Tarangire", value: "tarangire" },
          { title: "Kilimanjaro", value: "kilimanjaro" },
          { title: "Zanzibar", value: "zanzibar" },
          { title: "Cultural", value: "cultural" },
          { title: "Other", value: "other" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "category", media: "image" },
  },
});
