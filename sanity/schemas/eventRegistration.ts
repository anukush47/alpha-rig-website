import { defineField, defineType } from "sanity";

export const eventRegistration = defineType({
  name: "eventRegistration",
  title: "Event Registration",
  type: "document",

  fields: [
    defineField({
      name: "event",
      title: "Event",
      type: "reference",
      to: [{ type: "event" }],
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "teamName",
      title: "Team / Player Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "captainName",
      title: "Captain / Contact Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "gameId",
      title: "In-Game ID / Username",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "teamSize",
      title: "Team Size",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "registeredAt",
      title: "Registered At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending",   value: "pending"   },
          { title: "Confirmed", value: "confirmed" },
          { title: "Rejected",  value: "rejected"  },
          { title: "Waitlisted", value: "waitlisted" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      rows: 2,
    }),
  ],

  preview: {
    select: {
      teamName:  "teamName",
      eventName: "event.name",
      status:    "status",
    },
    prepare({ teamName, eventName, status }) {
      const badge = status === "confirmed" ? "✅" : status === "rejected" ? "❌" : status === "waitlisted" ? "⏳" : "🔵";
      return {
        title:    `${badge} ${teamName ?? "—"}`,
        subtitle: eventName ?? "Unknown event",
      };
    },
  },

  orderings: [
    {
      title: "Newest first",
      name: "registeredAtDesc",
      by: [{ field: "registeredAt", direction: "desc" }],
    },
  ],
});
