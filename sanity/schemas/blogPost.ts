import { defineField, defineType } from "sanity";

// ── Category taxonomy ─────────────────────────────────────────────────────────
export const BLOG_CATEGORIES = [
  { title: "AI Hardware",               value: "AI Hardware"               },
  { title: "CPUs & Processing",         value: "CPUs & Processing"         },
  { title: "GPUs & Gaming",             value: "GPUs & Gaming"             },
  { title: "Storage & Memory",          value: "Storage & Memory"          },
  { title: "PC Building & Upgrades",    value: "PC Building & Upgrades"    },
  { title: "Troubleshooting & Fixes",   value: "Troubleshooting & Fixes"   },
  { title: "Cooling & Power",           value: "Cooling & Power"           },
  { title: "Connectivity & Future Tech", value: "Connectivity & Future Tech" },
  { title: "Esports & Gaming Culture",  value: "Esports & Gaming Culture"  },
  { title: "Security & Privacy",        value: "Security & Privacy"        },
];

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["value"];

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",

  groups: [
    { name: "content",       title: "Content",       default: true },
    { name: "meta",          title: "Meta"                         },
    { name: "seo",           title: "SEO"                          },
    { name: "monetization",  title: "Monetization"                 },
  ],

  fields: [
    // ── Core ──────────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (R) => R.required().min(4).max(120),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      validation: (R) => R.max(220),
      description: "Short preview on listing pages (max 220 chars)",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (R) => R.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal",     value: "normal"     },
            { title: "H2",         value: "h2"         },
            { title: "H3",         value: "h3"         },
            { title: "H4",         value: "h4"         },
            { title: "Blockquote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold",      value: "strong"    },
              { title: "Italic",    value: "em"        },
              { title: "Code",      value: "code"      },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (R) =>
                      R.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  },
                  { name: "blank", type: "boolean", title: "Open in new tab", initialValue: false },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt",     type: "string", title: "Alt text"  },
            { name: "caption", type: "string", title: "Caption"   },
          ],
        },
        {
          type: "object",
          name: "codeBlock",
          title: "Code Block",
          fields: [
            { name: "language", type: "string", title: "Language" },
            { name: "code",     type: "text",   title: "Code"     },
          ],
          preview: {
            select: { language: "language", code: "code" },
            prepare({ language, code }) {
              return { title: `[${language ?? "code"}]`, subtitle: (code ?? "").slice(0, 60) };
            },
          },
        },
        {
          type: "object",
          name: "proTip",
          title: "Pro Tip",
          fields: [
            { name: "tip", type: "text", title: "Tip content" },
          ],
          preview: {
            select: { tip: "tip" },
            prepare({ tip }) { return { title: "💡 Pro Tip", subtitle: (tip ?? "").slice(0, 80) }; },
          },
        },
        {
          type: "object",
          name: "comparisonTable",
          title: "Comparison Table",
          fields: [
            { name: "caption", type: "string", title: "Table caption" },
            {
              name: "rows",
              type: "array",
              title: "Rows",
              of: [{
                type: "object",
                fields: [
                  { name: "feature", type: "string",  title: "Feature"  },
                  { name: "a",       type: "string",  title: "Column A" },
                  { name: "b",       type: "string",  title: "Column B" },
                  { name: "c",       type: "string",  title: "Column C (optional)" },
                ],
              }],
            },
          ],
        },
      ],
    }),

    // ── Meta ──────────────────────────────────────────────────────────────────
    defineField({
      name: "category",
      title: "Primary Category",
      type: "string",
      group: "meta",
      options: { list: BLOG_CATEGORIES, layout: "radio" },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subcategories",
      title: "Subcategories",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: {
        list: BLOG_CATEGORIES,
        layout: "tags",
      },
      description: "Pick 2–3 additional categories this post fits into",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "SEO keywords, component names, brands, etc.",
    }),
    defineField({
      name: "author",
      title: "Author Name",
      type: "string",
      group: "meta",
      initialValue: "Anupam",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "authorBio",
      title: "Author Bio",
      type: "text",
      rows: 2,
      group: "meta",
      initialValue:
        "Anupam is the founder of Alpha Rig, focused on simplifying PC hardware and helping users make smarter tech decisions.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
      group: "meta",
      description: "Estimated reading time — auto-fill or override manually",
      validation: (R) => R.min(1).max(60),
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description: "Pin this post to the top of the blog listing",
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides title in <head>. 50–60 chars for best results.",
      validation: (R) => R.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "150–160 chars for best results.",
      validation: (R) => R.max(165),
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO Keywords",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "5–8 keywords: mix of short-tail and long-tail",
    }),

    // ── Series ────────────────────────────────────────────────────────────────
    defineField({
      name: "series",
      title: "Series",
      type: "reference",
      to: [{ type: "blogSeries" }],
      group: "meta",
      description: "Add this post to a content series",
    }),

    // ── Engagement ────────────────────────────────────────────────────────────
    defineField({
      name: "likes",
      title: "Likes / Claps",
      type: "number",
      group: "meta",
      initialValue: 0,
      readOnly: true,
      description: "Auto-incremented via API when readers clap — do not edit manually",
      validation: (R) => R.min(0),
    }),

    // ── Monetization ─────────────────────────────────────────────────────────
    defineField({
      name: "sponsored",
      title: "Sponsored Post",
      type: "boolean",
      group: "monetization",
      initialValue: false,
      description: "Shows a 'Sponsored' badge on the post card and article header",
    }),
    defineField({
      name: "sponsorName",
      title: "Sponsor Name",
      type: "string",
      group: "monetization",
      description: "Shown as 'Presented by [name]'",
      hidden: ({ document }) => !document?.sponsored,
    }),
    defineField({
      name: "sponsorUrl",
      title: "Sponsor URL",
      type: "url",
      group: "monetization",
      hidden: ({ document }) => !document?.sponsored,
    }),
  ],

  preview: {
    select: {
      title:     "title",
      author:    "author",
      category:  "category",
      media:     "coverImage",
      featured:  "featured",
      sponsored: "sponsored",
    },
    prepare({ title, author, category, media, featured, sponsored }) {
      return {
        title:    `${featured ? "⭐ " : ""}${sponsored ? "💰 " : ""}${title}`,
        subtitle: `${author ?? "—"} · ${category ?? "Uncategorised"}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: "Published (newest first)",
      name:  "publishedAtDesc",
      by:    [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Featured first",
      name:  "featuredFirst",
      by:    [{ field: "featured", direction: "desc" }, { field: "publishedAt", direction: "desc" }],
    },
  ],
});
