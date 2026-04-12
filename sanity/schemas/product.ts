import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
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
      name: "brand",
      title: "Brand",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "GPU", value: "GPU" },
          { title: "CPU", value: "CPU" },
          { title: "RAM", value: "RAM" },
          { title: "Storage", value: "Storage" },
          { title: "Case", value: "Case" },
          { title: "Cooling", value: "Cooling" },
          { title: "Peripherals", value: "Peripherals" },
          { title: "Alpha Rig Original", value: "Alpha Rig Original" },
        ],
        layout: "dropdown",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (R) => R.required(),
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
          ],
        },
      ],
      validation: (R) => R.min(1).error("At least one image required"),
    }),
    defineField({
      name: "price",
      title: "Price (₹)",
      type: "number",
      validation: (R) => R.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at Price (₹)",
      type: "number",
      description: "Original / crossed-out price for sale items",
      validation: (R) => R.positive(),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      description: "Show in store featured section",
      initialValue: false,
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
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
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
      price: "price",
      inStock: "inStock",
    },
    prepare({ title, subtitle, media, price, inStock }) {
      return {
        title: `${!inStock ? "⛔ " : ""}${title}`,
        subtitle: `${subtitle} · ₹${price?.toLocaleString("en-IN") ?? "—"}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Price (low to high)",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price (high to low)",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
  ],
});
