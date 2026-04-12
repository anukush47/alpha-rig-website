import { defineField, defineType } from "sanity";

export const customBuild = defineType({
  name: "customBuild",
  title: "Custom Build",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Build Name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short descriptor shown under the name (e.g. 'Water Cooled · RGB')",
      validation: (R) => R.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (R) => R.required().min(40),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
      validation: (R) => R.min(1).error("At least one image required"),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Water Cooled", value: "water-cooled" },
          { title: "Air Cooled", value: "air-cooled" },
          { title: "RGB", value: "rgb" },
          { title: "Compact", value: "compact" },
          { title: "Workstation", value: "workstation" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      description: "Add each spec as a label/value pair",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label", validation: (R) => R.required() },
            { name: "value", type: "string", title: "Value", validation: (R) => R.required() },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "price",
      title: "Price (₹)",
      type: "number",
      validation: (R) => R.required().positive(),
    }),
    defineField({
      name: "featured",
      title: "Featured Build",
      type: "boolean",
      description: "Show this build in the homepage featured section",
      initialValue: false,
    }),
    defineField({
      name: "available",
      title: "Available for Commission",
      type: "boolean",
      description: "Set to false if this is a showcase-only build",
      initialValue: true,
    }),
    defineField({
      name: "completionDate",
      title: "Completion Date",
      type: "date",
      description: "When was this build completed/delivered?",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: `${featured ? "⭐ " : ""}${title}`,
        subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Completion Date (newest)",
      name: "completionDateDesc",
      by: [{ field: "completionDate", direction: "desc" }],
    },
    {
      title: "Price (high to low)",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
  ],
});
