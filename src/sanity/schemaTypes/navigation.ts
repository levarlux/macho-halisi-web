import { defineField, defineType } from "sanity";

const referenceTypes = [
  { type: "tourPackage" },
  { type: "route" },
  { type: "region" },
  { type: "accommodation" },
  { type: "travelInfoArticle" },
  { type: "page" },
];

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Main Navigation",
    }),
    defineField({
      name: "items",
      title: "Navigation Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "reference",
              to: referenceTypes,
            }),
            defineField({
              name: "children",
              title: "Sub-items",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "navChild",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "link",
                      title: "Link",
                      type: "reference",
                      to: referenceTypes,
                    }),
                    defineField({
                      name: "children",
                      title: "Sub-items",
                      type: "array",
                      of: [
                        {
                          type: "object",
                          name: "navGrandchild",
                          fields: [
                            defineField({
                              name: "label",
                              title: "Label",
                              type: "string",
                              validation: (rule) => rule.required(),
                            }),
                            defineField({
                              name: "link",
                              title: "Link",
                              type: "reference",
                              to: referenceTypes,
                            }),
                          ],
                          preview: {
                            select: { title: "label" },
                          },
                        },
                      ],
                    }),
                  ],
                  preview: {
                    select: { title: "label" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "label" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Main Navigation" };
    },
  },
});
