import { defineField, defineType } from "sanity";

export const userProfile = defineType({
  name:  "userProfile",
  title: "User Profiles",
  type:  "document",

  fields: [
    defineField({
      name:        "clerkUserId",
      title:       "Clerk User ID",
      type:        "string",
      description: "Primary key — set by the Clerk webhook on user.created. Do not edit.",
      readOnly:    true,
      validation:  (R) => R.required(),
    }),
    defineField({
      name:  "displayName",
      title: "Display Name",
      type:  "string",
    }),
    defineField({
      name:        "gamingHandle",
      title:       "Gaming Handle",
      type:        "string",
      description: "In-game tag / username shown on the Rig Identity Card",
    }),
    defineField({
      name:        "email",
      title:       "Email",
      type:        "string",
      readOnly:    true,
      description: "Synced from Clerk — read-only.",
    }),
    defineField({
      name:        "avatarUrl",
      title:       "Avatar URL",
      type:        "url",
      readOnly:    true,
      description: "Synced from Clerk OAuth provider photo.",
    }),
    defineField({
      name:         "bio",
      title:        "Bio",
      type:         "text",
      rows:         3,
      validation:   (R) => R.max(200),
    }),
    defineField({
      name:         "totalPoints",
      title:        "Alpha Points",
      type:         "number",
      description:  "Running point balance. Updated by earn-events.",
      initialValue: 0,
      validation:   (R) => R.min(0).integer(),
    }),
    defineField({
      name:        "createdAt",
      title:       "Joined",
      type:        "datetime",
      readOnly:    true,
      description: "Set by the Clerk webhook on user.created.",
    }),
  ],

  orderings: [
    { title: "Newest",       name: "newest",  by: [{ field: "createdAt",   direction: "desc" }] },
    { title: "Most Points",  name: "topPts",  by: [{ field: "totalPoints", direction: "desc" }] },
  ],

  preview: {
    select: {
      title:    "gamingHandle",
      subtitle: "email",
      pts:      "totalPoints",
    },
    prepare({ title, subtitle, pts }) {
      return {
        title:    title ?? subtitle ?? "Unknown",
        subtitle: `${pts ?? 0} pts`,
      };
    },
  },
});
