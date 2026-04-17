import { defineField, defineType } from "sanity";

export const savedBuild = defineType({
  name:  "savedBuild",
  title: "Saved Builds",
  type:  "document",

  fields: [
    defineField({
      name: "clerkUserId", title: "Clerk User ID",
      type: "string", readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "name", title: "Build Name",
      type: "string", validation: (R) => R.required().max(80),
    }),
    defineField({
      name: "components", title: "Components",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "part",  title: "Part Type", type: "string",
            options: { list: ["CPU","GPU","RAM","Motherboard","Storage","PSU","Case","Cooling","Peripherals","Other"] } }),
          defineField({ name: "name",  title: "Component Name", type: "string" }),
          defineField({ name: "brand", title: "Brand",          type: "string" }),
          defineField({ name: "price", title: "Price (₹)",      type: "number" }),
        ],
        preview: {
          select: { title: "name", part: "part", price: "price" },
          prepare({ title, part, price }) {
            return { title: `${part}: ${title}`, subtitle: `₹${price ?? 0}` };
          },
        },
      }],
    }),
    defineField({ name: "totalBudget", title: "Total Budget (₹)", type: "number" }),
    defineField({ name: "notes",       title: "Notes",             type: "text", rows: 3 }),
    defineField({ name: "useCase",     title: "Use Case",          type: "string",
      options: { list: ["Gaming","Streaming","Workstation","Office","Budget","Enthusiast"] } }),
    defineField({
      name: "quoteRequested", title: "Quote Requested?",
      type: "boolean", initialValue: false,
    }),
    defineField({
      name: "createdAt", title: "Created At", type: "datetime",
      readOnly: true, initialValue: () => new Date().toISOString(),
    }),
  ],

  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "createdAt", direction: "desc" }] },
  ],

  preview: {
    select: { title: "name", budget: "totalBudget", userId: "clerkUserId" },
    prepare({ title, budget, userId }) {
      return { title: title ?? "Untitled Build", subtitle: `₹${budget ?? 0} · ${userId?.slice(0, 14) ?? ""}` };
    },
  },
});
