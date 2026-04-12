import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Event Name",
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
      name: "game",
      title: "Game / Type",
      type: "string",
      description: "E.g. VALORANT, BGMI, EXHIBITION",
      validation: (R) => R.required(),
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "prizePool",
      title: "Prize Pool (₹)",
      type: "number",
      validation: (R) => R.positive(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Upcoming", value: "upcoming" },
          { title: "Registration Open", value: "registration-open" },
          { title: "Live", value: "live" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
      initialValue: "upcoming",
    }),
    defineField({
      name: "registrationLink",
      title: "Registration Link",
      type: "url",
      description: "External registration URL (if applicable)",
    }),
    defineField({
      name: "highlights",
      title: "Event Highlights / Results",
      type: "text",
      rows: 4,
      description: "Fill in after the event — winner, scores, notable moments",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "status",
      media: "coverImage",
      date: "eventDate",
    },
    prepare({ title, subtitle, media, date }) {
      const d = date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
      return { title, subtitle: `${subtitle} · ${d}`, media };
    },
  },
  orderings: [
    {
      title: "Event Date (soonest first)",
      name: "eventDateAsc",
      by: [{ field: "eventDate", direction: "asc" }],
    },
  ],
});
