import { defineField, defineType } from "sanity";

export const userOrder = defineType({
  name:  "userOrder",
  title: "Orders",
  type:  "document",

  fields: [
    defineField({
      name:       "clerkUserId",
      title:      "Clerk User ID",
      type:       "string",
      readOnly:   true,
      validation: (R) => R.required(),
    }),
    defineField({
      name:       "razorpayOrderId",
      title:      "Razorpay Order ID",
      type:       "string",
      readOnly:   true,
      validation: (R) => R.required(),
    }),
    defineField({
      name:       "razorpayPaymentId",
      title:      "Razorpay Payment ID",
      type:       "string",
      readOnly:   true,
    }),
    defineField({
      name:  "status",
      title: "Status",
      type:  "string",
      options: {
        list: [
          { title: "Pending",    value: "pending" },
          { title: "Paid",       value: "paid" },
          { title: "Processing", value: "processing" },
          { title: "Shipped",    value: "shipped" },
          { title: "Delivered",  value: "delivered" },
          { title: "Cancelled",  value: "cancelled" },
          { title: "Refunded",   value: "refunded" },
        ],
        layout: "dropdown",
      },
      initialValue: "pending",
      validation: (R) => R.required(),
    }),
    defineField({
      name:  "orderType",
      title: "Order Type",
      type:  "string",
      options: {
        list: [
          { title: "Store Product", value: "product" },
          { title: "Custom Build",  value: "build" },
          { title: "Counseling",    value: "counseling" },
          { title: "Event",         value: "event" },
        ],
        layout: "dropdown",
      },
      initialValue: "product",
    }),
    defineField({
      name:  "items",
      title: "Items",
      type:  "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name",      title: "Product Name", type: "string" }),
            defineField({ name: "productId", title: "Sanity Product ID", type: "string" }),
            defineField({ name: "slug",      title: "Product Slug", type: "string" }),
            defineField({ name: "qty",       title: "Quantity", type: "number", initialValue: 1 }),
            defineField({ name: "price",     title: "Unit Price (₹)", type: "number" }),
            defineField({ name: "imageUrl",  title: "Image URL", type: "url" }),
          ],
          preview: {
            select: { title: "name", subtitle: "price", qty: "qty" },
            prepare({ title, subtitle, qty }) {
              return { title: `${qty}× ${title}`, subtitle: `₹${subtitle}` };
            },
          },
        },
      ],
    }),
    defineField({
      name:       "totalAmount",
      title:      "Total Amount (₹)",
      type:       "number",
      readOnly:   true,
      validation: (R) => R.min(0),
    }),
    defineField({
      name:  "shippingAddress",
      title: "Shipping Address",
      type:  "object",
      fields: [
        defineField({ name: "name",    title: "Full Name",    type: "string" }),
        defineField({ name: "line1",   title: "Address Line 1", type: "string" }),
        defineField({ name: "line2",   title: "Address Line 2", type: "string" }),
        defineField({ name: "city",    title: "City",         type: "string" }),
        defineField({ name: "state",   title: "State",        type: "string" }),
        defineField({ name: "pincode", title: "Pincode",      type: "string" }),
        defineField({ name: "phone",   title: "Phone",        type: "string" }),
      ],
    }),
    defineField({
      name:       "createdAt",
      title:      "Ordered At",
      type:       "datetime",
      readOnly:   true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name:  "notes",
      title: "Notes",
      type:  "text",
      rows:  2,
    }),
  ],

  orderings: [
    { title: "Newest First", name: "newest", by: [{ field: "createdAt", direction: "desc" }] },
  ],

  preview: {
    select: {
      userId:  "clerkUserId",
      orderId: "razorpayOrderId",
      status:  "status",
      total:   "totalAmount",
    },
    prepare({ userId, orderId, status, total }) {
      return {
        title:    orderId ?? "No order ID",
        subtitle: `${userId?.slice(0, 16) ?? "—"} · ₹${total ?? 0} · ${status ?? "pending"}`,
      };
    },
  },
});
