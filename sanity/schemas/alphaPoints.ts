import { defineField, defineType } from "sanity";

export const alphaPoints = defineType({
  name:  "alphaPoints",
  title: "Alpha Points Ledger",
  type:  "document",

  fields: [
    defineField({
      name: "clerkUserId", title: "Clerk User ID",
      type: "string", readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "event", title: "Earn Event",
      type: "string",
      options: {
        list: [
          { title: "Purchase",          value: "purchase"   },
          { title: "Event Registration", value: "event_reg" },
          { title: "Blog Read",          value: "blog_read"  },
          { title: "Referral",           value: "referral"   },
          { title: "Profile Complete",   value: "profile"    },
          { title: "First Purchase",     value: "first_buy"  },
          { title: "Newsletter Signup",  value: "newsletter" },
          { title: "Admin Adjustment",   value: "admin"      },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "points", title: "Points",
      type: "number", readOnly: true,
      validation: (R) => R.integer(),
    }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "referenceId", title: "Reference ID (order/event/blog)", type: "string" }),
    defineField({
      name: "createdAt", title: "Earned At", type: "datetime",
      readOnly: true, initialValue: () => new Date().toISOString(),
    }),
  ],

  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "createdAt", direction: "desc" }] },
  ],

  preview: {
    select: { userId: "clerkUserId", event: "event", points: "points" },
    prepare({ userId, event, points }) {
      return {
        title:    `${points > 0 ? "+" : ""}${points} pts`,
        subtitle: `${event} · ${userId?.slice(0, 14) ?? ""}`,
      };
    },
  },
});
