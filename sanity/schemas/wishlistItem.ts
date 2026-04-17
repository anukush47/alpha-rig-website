import { defineField, defineType } from "sanity";

export const wishlistItem = defineType({
  name:  "wishlistItem",
  title: "Wishlist Items",
  type:  "document",

  fields: [
    defineField({
      name: "clerkUserId", title: "Clerk User ID",
      type: "string", readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "productId", title: "Sanity Product ID",
      type: "string", readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({ name: "productName", title: "Product Name", type: "string", readOnly: true }),
    defineField({ name: "productSlug", title: "Product Slug", type: "string", readOnly: true }),
    defineField({ name: "price",       title: "Price (₹)",    type: "number", readOnly: true }),
    defineField({ name: "imageUrl",    title: "Image URL",    type: "url",    readOnly: true }),
    defineField({
      name: "addedAt", title: "Added At", type: "datetime",
      readOnly: true, initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: { title: "productName", subtitle: "price", userId: "clerkUserId" },
    prepare({ title, subtitle, userId }) {
      return { title: title ?? "—", subtitle: `₹${subtitle ?? 0} · ${userId?.slice(0, 14) ?? ""}` };
    },
  },
});
