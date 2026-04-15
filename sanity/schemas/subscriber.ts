import { defineField, defineType } from "sanity";

export const subscriber = defineType({
  name: "subscriber",
  title: "Newsletter Subscriber",
  type: "document",

  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      readOnly: true,
      description: "Where they signed up: newsletter-strip, blog-mid, events, store-coming-soon",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
      description: "Segments e.g. events, blog — used for targeted sends",
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Set to false to soft-unsubscribe without deleting",
    }),
  ],

  orderings: [
    {
      title: "Newest First",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "email",
      subtitle: "source",
      active: "active",
    },
    prepare({ title, subtitle, active }) {
      return {
        title: active === false ? `[unsubscribed] ${title}` : title,
        subtitle: subtitle ?? "unknown source",
      };
    },
  },
});
