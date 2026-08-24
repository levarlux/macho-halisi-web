import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      initialValue: "Macho Halisi Tanzania Safaris",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue:
        "Serengeti National Park Safaris, Ngorongoro Crater, Tarangire, Mount Kilimanjaro",
    }),
    defineField({
      name: "slogan",
      title: "Slogan",
      type: "string",
      initialValue: "Your Passport to Adventure 365 Days a Year",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      initialValue: "+255 754 474 792",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      initialValue: "info@machohalisi.com",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "twitter", title: "Twitter URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Copyright Text",
      type: "string",
      initialValue: "© 2026 Macho Halisi LTD. All rights reserved.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
