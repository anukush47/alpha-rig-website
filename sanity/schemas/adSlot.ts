import { defineField, defineType } from "sanity";

export const adSlot = defineType({
  name: "adSlot",
  title: "Ad Slot",
  type: "document",

  fields: [
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: [
          { title: "Blog — After Intro",    value: "blog-after-intro" },
          { title: "Blog — Mid Article",    value: "blog-mid"         },
          { title: "Blog — End of Article", value: "blog-end"         },
          { title: "Sidebar — Trending",    value: "sidebar-trending" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
      description: "Where this ad appears on the site",
    }),
    defineField({
      name: "label",
      title: "Internal Label",
      type: "string",
      description: "Your reference name — e.g. 'Corsair March 2025'",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: false,
      description: "When off, this slot falls back to Google AdSense",
    }),

    // ── Brand creative ──────────────────────────────────────────────────────────
    defineField({
      name: "sponsorName",
      title: "Sponsor Name",
      type: "string",
      description: "Shown as 'Presented by [name]'",
    }),
    defineField({
      name: "sponsorLogo",
      title: "Sponsor Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (R) => R.max(60),
    }),
    defineField({
      name: "body",
      title: "Body Copy",
      type: "string",
      description: "1–2 sentences",
      validation: (R) => R.max(140),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "Learn More",
    }),
    defineField({
      name: "ctaUrl",
      title: "CTA URL",
      type: "url",
    }),

    // ── Advanced ────────────────────────────────────────────────────────────────
    defineField({
      name: "customHtml",
      title: "Custom HTML / Embed (advanced)",
      type: "text",
      description: "Paste brand-supplied HTML. When present, overrides all fields above.",
    }),
    defineField({
      name: "startDate",
      title: "Campaign Start",
      type: "date",
    }),
    defineField({
      name: "endDate",
      title: "Campaign End",
      type: "date",
      description: "Slot auto-falls back to AdSense after this date",
    }),
  ],

  preview: {
    select: {
      label:    "label",
      position: "position",
      active:   "active",
    },
    prepare({ label, position, active }) {
      const posLabel: Record<string, string> = {
        "blog-after-intro": "Blog · After Intro",
        "blog-mid":         "Blog · Mid",
        "blog-end":         "Blog · End",
        "sidebar-trending": "Sidebar · Trending",
      };
      return {
        title:    `${active ? "🟢" : "⚫"} ${label ?? "Unnamed"}`,
        subtitle: posLabel[position] ?? position,
      };
    },
  },
});
