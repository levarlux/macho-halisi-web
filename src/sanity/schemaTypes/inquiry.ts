import { defineField, defineType } from "sanity";

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
    defineField({
      name: "arrivalDate",
      title: "Arrival Date",
      type: "date",
    }),
    defineField({
      name: "departureDate",
      title: "Departure Date",
      type: "date",
    }),
    defineField({
      name: "adults",
      title: "Adults",
      type: "number",
      initialValue: 2,
    }),
    defineField({
      name: "children",
      title: "Children",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "safariType",
      title: "Safari/Tour Type",
      type: "string",
      options: {
        list: [
          { title: "Wildlife Safari", value: "wildlife" },
          { title: "Mountain Trekking", value: "trekking" },
          { title: "Cultural Tours", value: "cultural" },
          { title: "Beach Holiday", value: "beach" },
          { title: "Multiple Activities", value: "multiple" },
        ],
      },
    }),
    defineField({
      name: "message",
      title: "Message / Special Requirements",
      type: "text",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      initialValue: "website",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Quote Sent", value: "quote-sent" },
          { title: "Booked", value: "booked" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email", media: "status" },
    prepare(select: { title?: string; subtitle?: string }) {
      return {
        title: select.title || "Anonymous",
        subtitle: select.subtitle || "",
      };
    },
  },
});
