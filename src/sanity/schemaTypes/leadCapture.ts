import { defineField, defineType } from "sanity";

const formStep = {
  name: "formStep",
  title: "Form Step",
  type: "object",
  fields: [
    defineField({
      name: "stepNumber",
      title: "Step Number",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Step Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Step Description",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "stepNumber" },
    prepare(select: { title?: string; subtitle?: number }) {
      return {
        title: `Step ${select.subtitle}: ${select.title || "Untitled"}`,
      };
    },
  },
};

export const leadCapture = defineType({
  name: "leadCapture",
  title: "Lead Capture Settings",
  type: "document",
  fields: [
    defineField({
      name: "formTitle",
      title: "Form Title",
      type: "string",
      initialValue: "Plan My Safari",
    }),
    defineField({
      name: "formSteps",
      title: "Form Steps",
      type: "array",
      of: [formStep],
    }),
    defineField({
      name: "successTitle",
      title: "Success Message Title",
      type: "string",
      initialValue: "Thank You!",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "text",
      initialValue:
        "We've received your inquiry and will get back to you within 24 hours with a personalized safari proposal.",
    }),
    defineField({
      name: "responseTimePromise",
      title: "Response Time Promise",
      type: "string",
      initialValue: "We respond within 24 hours",
    }),
    defineField({
      name: "ctaLabel",
      title: "Persistent CTA Label",
      type: "string",
      initialValue: "Plan My Safari",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Lead Capture Settings" as string };
    },
  },
});
