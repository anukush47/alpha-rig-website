import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@sanity/client";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tournament Wall | Alpha Rig" };

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface EventReg {
  _id: string;
  teamName?: string;
  captainName?: string;
  gameId?: string;
  registeredAt: string;
  status: "pending" | "confirmed" | "rejected" | "waitlisted";
  event?: {
    _id: string;
    name: string;
    game: string;
    eventDate: string;
    venue: string;
    slug?: { current: string };
    prizePool?: number;
  };
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "PENDING",    color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  confirmed:  { label: "CONFIRMED",  color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
  rejected:   { label: "REJECTED",   color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
  waitlisted: { label: "WAITLISTED", color: "#888",    bg: "rgba(136,136,136,0.06)" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function isUpcoming(eventDate?: string): boolean {
  if (!eventDate) return false;
  return new Date(eventDate) > new Date();
}

export default async function TournamentWallPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  let registrations: EventReg[] = [];
  if (email) {
    registrations = await sanity.fetch<EventReg[]>(
      `*[_type == "eventRegistration" && email == $email] | order(registeredAt desc) {
        _id, teamName, captainName, gameId, registeredAt, status,
        event->{ _id, name, game, eventDate, venue, slug, prizePool }
      }`,
      { email }
    );
  }

  const upcoming = registrations.filter((r) => isUpcoming(r.event?.eventDate));
  const past     = registrations.filter((r) => !isUpcoming(r.event?.eventDate));

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.22em",
            color: "#c0392b",
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            // TOURNAMENT WALL
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 50px)",
            letterSpacing: "0.04em",
            color: "#fff",
            lineHeight: 0.95,
            margin: "0 0 8px",
          }}>
            MY EVENTS
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333", letterSpacing: "0.06em", margin: 0 }}>
            {registrations.length} {registrations.length === 1 ? "REGISTRATION" : "REGISTRATIONS"}
          </p>
        </div>

        <Link
          href="/events"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.06em",
            color: "#fff",
            background: "#c0392b",
            padding: "10px 20px",
            borderRadius: 7,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          BROWSE EVENTS
        </Link>
      </div>

      {registrations.length === 0 ? (
        <div style={{
          padding: "72px 32px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 12,
          background: "rgba(10,10,10,0.6)",
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 36, color: "#1a1a1a", marginBottom: 20, lineHeight: 1 }}>
            ◎
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            color: "#fff",
            letterSpacing: "0.06em",
            margin: "0 0 10px",
          }}>
            NO EVENTS YET
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#444",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}>
            Register for a tournament to earn Alpha Points and build your competitive record here.
          </p>
          <Link
            href="/events"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.06em",
              color: "#fff",
              background: "#c0392b",
              padding: "12px 28px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            FIND A TOURNAMENT
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "#4ade80",
                textTransform: "uppercase",
                marginBottom: 16,
              }}>
                // UPCOMING ({upcoming.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {upcoming.map((reg) => (
                  <RegCard key={reg._id} reg={reg} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "#333",
                textTransform: "uppercase",
                marginBottom: 16,
              }}>
                // PAST EVENTS ({past.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {past.map((reg) => (
                  <RegCard key={reg._id} reg={reg} past />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function RegCard({ reg, past = false }: { reg: EventReg; past?: boolean }) {
  const status = STATUS_META[reg.status] ?? STATUS_META.pending;

  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 10,
      padding: "22px 26px",
      opacity: past ? 0.75 : 1,
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Event name */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            {reg.event?.slug ? (
              <Link
                href={`/events/${reg.event.slug.current}`}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  color: "#fff",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  lineHeight: 1,
                }}
              >
                {reg.event?.name ?? "Event"}
              </Link>
            ) : (
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                color: "#fff",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}>
                {reg.event?.name ?? "Event"}
              </span>
            )}

            {/* Status badge */}
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.14em",
              color: status.color,
              background: status.bg,
              border: `1px solid ${status.color}30`,
              padding: "3px 9px",
              borderRadius: 3,
            }}>
              {status.label}
            </span>
          </div>

          {/* Game + venue */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
            {reg.event?.game && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#c0392b", letterSpacing: "0.1em" }}>
                {reg.event.game}
              </span>
            )}
            {reg.event?.venue && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#2a2a2a", letterSpacing: "0.08em" }}>
                {reg.event.venue}
              </span>
            )}
          </div>

          {/* Team details */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {reg.teamName && (
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.14em", color: "#222", margin: "0 0 2px", textTransform: "uppercase" }}>
                  Team
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "#888", margin: 0 }}>
                  {reg.teamName}
                </p>
              </div>
            )}
            {reg.gameId && (
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.14em", color: "#222", margin: "0 0 2px", textTransform: "uppercase" }}>
                  In-Game ID
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "#888", margin: 0 }}>
                  {reg.gameId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          {reg.event?.eventDate && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#2a2a2a", letterSpacing: "0.08em" }}>
              {fmtDate(reg.event.eventDate)}
            </span>
          )}
          {reg.event?.prizePool && reg.event.prizePool > 0 && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.14em", color: "#222", margin: "0 0 2px", textTransform: "uppercase" }}>
                Prize Pool
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f59e0b", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>
                {fmtPrice(reg.event.prizePool)}
              </p>
            </div>
          )}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#1a1a1a", letterSpacing: "0.06em" }}>
            REG. {fmtDate(reg.registeredAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
