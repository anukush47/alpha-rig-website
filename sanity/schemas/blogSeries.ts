import { defineField, defineType } from "sanity";

export const blogSeries = defineType({
  name: "blogSeries",
  title: "Blog Series",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Series Title",
      type: "string",
      validation: (R) => R.required().min(2).max(80),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Shown on series listing and individual posts",
      validation: (R) => R.max(200),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
      ],
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Hide the series from listings without deleting it",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "coverImage",
      active: "active",
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active === false ? "[hidden] " : ""}${title}`,
        subtitle: (subtitle ?? "").slice(0, 80),
        media,
      };
    },
  },

  orderings: [
    {
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
