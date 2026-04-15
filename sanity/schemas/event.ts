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

    // ── Registration ──────────────────────────────────────────────────────────
    defineField({
      name: "registrationOpen",
      title: "Registration Open",
      type: "boolean",
      initialValue: false,
      description: "Shows the registration form on the event page when enabled",
    }),
    defineField({
      name: "maxTeams",
      title: "Max Teams / Players",
      type: "number",
      description: "Cap for registrations — shown on the form",
      validation: (R) => R.positive().integer(),
    }),

    // ── Results ───────────────────────────────────────────────────────────────
    defineField({
      name: "results",
      title: "Podium Results",
      type: "array",
      description: "Top placements — shown as a podium after the event",
      of: [{
        type: "object",
        fields: [
          { name: "place",    title: "Place (1, 2, 3…)", type: "number",  validation: (R) => R.required().positive().integer() },
          { name: "teamName", title: "Team / Player Name", type: "string", validation: (R) => R.required() },
          { name: "prize",    title: "Prize (e.g. ₹50,000)", type: "string" },
          { name: "note",     title: "Note (optional)", type: "string",   description: "e.g. 'Best Ace', 'MVP'" },
        ],
        preview: {
          select: { place: "place", teamName: "teamName", prize: "prize" },
          prepare({ place, teamName, prize }) {
            const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : place === 3 ? "🥉" : `#${place}`;
            return { title: `${medal} ${teamName}`, subtitle: prize ?? "" };
          },
        },
      }],
    }),
    defineField({
      name: "leaderboard",
      title: "Full Leaderboard",
      type: "array",
      description: "Individual player stats — shown in a ranked table",
      of: [{
        type: "object",
        fields: [
          { name: "rank",   title: "Rank",        type: "number", validation: (R) => R.required().positive().integer() },
          { name: "player", title: "Player Name", type: "string", validation: (R) => R.required() },
          { name: "team",   title: "Team",        type: "string" },
          { name: "kills",  title: "Kills / Score A", type: "number" },
          { name: "score",  title: "Final Score / Points", type: "number" },
        ],
        preview: {
          select: { rank: "rank", player: "player", score: "score" },
          prepare({ rank, player, score }) {
            return { title: `#${rank} ${player}`, subtitle: score != null ? `Score: ${score}` : "" };
          },
        },
      }],
    }),

    // ── Recap ─────────────────────────────────────────────────────────────────
    defineField({
      name: "recapVideoUrl",
      title: "Recap Video URL",
      type: "url",
      description: "YouTube or other video URL — embedded in the event recap section",
    }),
    defineField({
      name: "recapGallery",
      title: "Recap Photo Gallery",
      type: "array",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [
          { name: "alt",     type: "string", title: "Alt text"  },
          { name: "caption", type: "string", title: "Caption"   },
        ],
      }],
    }),

    // ── Event Sponsors ────────────────────────────────────────────────────────
    defineField({
      name: "eventSponsors",
      title: "Event Sponsors",
      type: "array",
      description: "Sponsors specific to this event — shown below the event hero",
      of: [{
        type: "object",
        fields: [
          { name: "name", title: "Brand Name", type: "string", validation: (R) => R.required() },
          { name: "logo", title: "Logo",       type: "image", options: { hotspot: true } },
          { name: "url",  title: "Website",    type: "url"   },
          {
            name: "tier",
            title: "Tier",
            type: "string",
            options: {
              list: [
                { title: "Title",     value: "title"     },
                { title: "Gold",      value: "gold"      },
                { title: "Silver",    value: "silver"    },
                { title: "Community", value: "community" },
              ],
            },
            initialValue: "community",
          },
        ],
        preview: {
          select: { name: "name", tier: "tier", media: "logo" },
          prepare({ name, tier, media }) {
            return { title: name, subtitle: tier, media };
          },
        },
      }],
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
