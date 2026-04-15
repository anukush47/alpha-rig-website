import { defineField, defineType } from "sanity";

const TIER_LABEL: Record<string, string> = {
  title:     "Title Sponsor",
  gold:      "Gold Partner",
  silver:    "Silver Partner",
  community: "Community Partner",
};

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor / Partner",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
      ],
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "tier",
      title: "Partnership Tier",
      type: "string",
      options: {
        list: [
          { title: "Title Sponsor",     value: "title"     },
          { title: "Gold Partner",      value: "gold"      },
          { title: "Silver Partner",    value: "silver"    },
          { title: "Community Partner", value: "community" },
        ],
        layout: "radio",
      },
      initialValue: "community",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 2,
      description: "Displayed on the /sponsors page alongside logo",
      validation: (R) => R.max(160),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Only active sponsors appear on the site",
    }),
    defineField({
      name: "featuredOnHome",
      title: "Show on Homepage",
      type: "boolean",
      initialValue: false,
      description: "Include in the homepage sponsor bar",
    }),
    defineField({
      name: "startDate",
      title: "Partnership Start Date",
      type: "date",
    }),
  ],

  orderings: [
    {
      title: "Tier (Title → Community)",
      name: "tierOrder",
      by: [{ field: "tier", direction: "asc" }],
    },
    {
      title: "Name A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title:  "name",
      tier:   "tier",
      media:  "logo",
      active: "active",
    },
    prepare({ title, tier, media, active }) {
      return {
        title:    `${active ? "" : "[inactive] "}${title}`,
        subtitle: TIER_LABEL[tier] ?? tier,
        media,
      };
    },
  },
});
