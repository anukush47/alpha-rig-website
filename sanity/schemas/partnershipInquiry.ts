import { defineField, defineType } from "sanity";

export const partnershipInquiry = defineType({
  name: "partnershipInquiry",
  title: "Partnership Inquiry",
  type: "document",

  fields: [
    defineField({
      name: "type",
      title: "Inquiry Type",
      type: "string",
      options: {
        list: [
          { title: "Advertise",  value: "advertise"  },
          { title: "Sponsorship", value: "sponsor"   },
        ],
        layout: "radio",
      },
      readOnly: true,
    }),
    defineField({
      name: "name",
      title: "Contact Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "company",
      title: "Company / Brand",
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
      name: "budget",
      title: "Estimated Budget",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New",        value: "new"        },
          { title: "Contacted",  value: "contacted"  },
          { title: "Closed",     value: "closed"     },
          { title: "Declined",   value: "declined"   },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      rows: 3,
      description: "Your notes on this inquiry — not shown to the client",
    }),
  ],

  preview: {
    select: {
      name:    "name",
      company: "company",
      type:    "type",
      status:  "status",
    },
    prepare({ name, company, type, status }) {
      const badge = status === "new" ? "🔴" : status === "contacted" ? "🟡" : "⚫";
      return {
        title:    `${badge} ${name ?? "—"}${company ? ` · ${company}` : ""}`,
        subtitle: `${type === "advertise" ? "Ad Inquiry" : "Sponsorship"} · ${status ?? "new"}`,
      };
    },
  },

  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
