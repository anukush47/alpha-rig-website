export type EventStatus = "registration-open" | "coming-soon" | "completed" | "live";

export interface AlphaEvent {
  id: string;
  name: string;
  game: string;
  date: string;         // ISO string
  dateDisplay: string;  // Human-readable
  venue: string;
  prizePool: string;
  status: EventStatus;
  description: string;
  registrationUrl?: string;
  highlights?: string;
  winner?: string;
  accentColor: string;  // game-specific strip color
}

export const EVENTS: AlphaEvent[] = [
  {
    id: "valorant-open-2026",
    name: "VALORANT OPEN 2026",
    game: "VALORANT",
    date: "2026-05-15T10:00:00",
    dateDisplay: "MAY 15, 2026",
    venue: "Alpha Rig Arena, Durg",
    prizePool: "₹1,00,000",
    status: "registration-open",
    description:
      "Open bracket. 5v5. Best of three semifinals, best of five grand finals. Full production with live commentary and media team.",
    registrationUrl: "/contact?event=valorant-open-2026",
    accentColor: "#C0392B",
  },
  {
    id: "bgmi-championship-2026",
    name: "BGMI CHAMPIONSHIP",
    game: "BGMI",
    date: "2026-06-22T12:00:00",
    dateDisplay: "JUN 22, 2026",
    venue: "TBA — Chhattisgarh Region",
    prizePool: "₹50,000",
    status: "coming-soon",
    description:
      "Six squads. Three zones. One winner. Registration opens 30 days before event. Qualifiers run the week prior.",
    accentColor: "#F39C12",
  },
  {
    id: "custom-pc-showcase-2025",
    name: "CUSTOM PC SHOWCASE",
    game: "EXHIBITION",
    date: "2025-12-10T11:00:00",
    dateDisplay: "DEC 10, 2025",
    venue: "Alpha Rig HQ, Durg",
    prizePool: "₹25,000",
    status: "completed",
    description:
      "Community showcase of custom built PCs — judged on aesthetics, thermals, and originality. 40+ entries.",
    winner: "TEAM OBSIDIAN — Category: Best Water-Cool",
    accentColor: "#8E44AD",
  },
  {
    id: "valorant-winter-clash-2025",
    name: "VALORANT WINTER CLASH",
    game: "VALORANT",
    date: "2025-11-02T10:00:00",
    dateDisplay: "NOV 02, 2025",
    venue: "Alpha Rig Arena, Durg",
    prizePool: "₹75,000",
    status: "completed",
    description:
      "16-team double-elimination bracket with full live stream. Casters flew in from Raipur. Over 800 viewers peak.",
    winner: "CIPHER ESPORTS — 16-0 Grand Finals",
    accentColor: "#C0392B",
  },
];

export const NEXT_EVENT = EVENTS.find((e) => e.status === "registration-open" || e.status === "coming-soon")!;
export const UPCOMING = EVENTS.filter((e) => e.status !== "completed");
export const PAST = EVENTS.filter((e) => e.status === "completed");
