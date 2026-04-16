import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllEvents, getEventBySlug } from "@/lib/queries";
import { urlFor, ogImage } from "@/lib/sanity";
import CountdownTimer from "@/components/ui/CountdownTimer";
import EventRegistrationForm from "@/components/ui/EventRegistrationForm";

export const revalidate = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function fmtPrize(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
    }
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

const TIER_ORDER: Record<string, number> = { title: 0, gold: 1, silver: 2, community: 3 };
const TIER_LABEL: Record<string, string> = {
  title: "Title Sponsor", gold: "Gold", silver: "Silver", community: "Community",
};
const TIER_COLOR: Record<string, string> = {
  title: "#E8C547", gold: "#C0392B", silver: "#888", community: "#555",
};

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const events = await getAllEvents();
    return events.map((e) => ({ slug: e.slug.current }));
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found | Alpha Rig" };

  const imageUrl = event.coverImage?.asset ? ogImage(event.coverImage) : undefined;

  return {
    title: event.name,
    description: event.description,
    openGraph: {
      title: `${event.name} | Alpha Rig Events`,
      description: event.description,
      url: `https://alpharig.in/events/${event.slug.current}`,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: { card: "summary_large_image", title: event.name },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0A0A0A", gap: "16px" }}>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "4rem", color: "#C0392B", letterSpacing: "0.06em" }}>Event Not Found</h1>
        <Link href="/events" style={{ fontFamily: "var(--font-space-mono)", fontSize: "11px", color: "#666", letterSpacing: "0.1em" }}>
          ← Back to Events
        </Link>
      </main>
    );
  }

  const coverUrl = event.coverImage?.asset
    ? urlFor(event.coverImage).width(1400).height(600).fit("crop").auto("format").url()
    : null;

  const isActive   = ["upcoming", "registration-open", "live"].includes(event.status);
  const isLive     = event.status === "live";
  const isCompleted = event.status === "completed";
  const hasResults = (event.results?.length ?? 0) > 0;
  const hasLeaderboard = (event.leaderboard?.length ?? 0) > 0;
  const hasRecap   = event.recapVideoUrl || (event.recapGallery?.length ?? 0) > 0;
  const hasSponsors = (event.eventSponsors?.length ?? 0) > 0;

  const sortedSponsors = [...(event.eventSponsors ?? [])].sort(
    (a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9)
  );

  const podium = [...(event.results ?? [])].sort((a, b) => a.place - b.place);
  const leaderboard = [...(event.leaderboard ?? [])].sort((a, b) => a.rank - b.rank);

  const embedUrl = event.recapVideoUrl ? youtubeEmbedUrl(event.recapVideoUrl) : null;

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", width: "100%", height: "480px", overflow: "hidden" }}>
        {coverUrl ? (
          <Image src={coverUrl} alt={event.name} fill priority sizes="100vw" style={{ objectFit: "cover", opacity: 0.45 }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #111 0%, #0a0a0a 100%)" }} />
        )}
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.9) 70%, #0A0A0A 100%)" }} />
        {/* Grid lines */}
        <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {[0,1,2,3,4].map((i) => (
            <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${15 + i * 18}%`, width: "1px", background: "linear-gradient(180deg, transparent, rgba(192,57,43,0.08), transparent)", transform: "skewX(-15deg)" }} />
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 32px 40px", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Link href="/events" style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#444", textDecoration: "none", letterSpacing: "0.1em" }}>Events</Link>
            <span style={{ color: "#2a2a2a", fontFamily: "var(--font-space-mono)", fontSize: "10px" }}>/</span>
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.1em", textTransform: "uppercase" }}>{event.game}</span>
          </div>

          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{
              display: "inline-block", width: "7px", height: "7px", borderRadius: "50%",
              background: isLive ? "#00ff88" : isCompleted ? "#555" : "#C0392B",
              animation: isLive || isActive ? "pulse-dot 1.4s ease-in-out infinite" : undefined,
            }} />
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: isLive ? "#00ff88" : isCompleted ? "#555" : "#C0392B" }}>
              {isLive ? "Live Now" : isCompleted ? "Completed" : event.status === "registration-open" ? "Registration Open" : "Upcoming"}
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 8vw, 80px)", color: "#fff", letterSpacing: "0.03em", lineHeight: 1, margin: "0 0 16px" }}>
            {event.name}
          </h1>

          {/* Meta pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {[
              { label: event.game },
              { label: fmtDate(event.eventDate) },
              { label: event.venue },
              ...(event.prizePool > 0 ? [{ label: `Prize Pool: ${fmtPrize(event.prizePool)}`, red: true }] : []),
            ].map((m) => (
              <span
                key={m.label}
                style={{
                  fontFamily: "var(--font-space-mono)", fontSize: "10px", letterSpacing: "0.1em",
                  color: m.red ? "#C0392B" : "#888",
                  background: m.red ? "rgba(192,57,43,0.1)" : "rgba(17,17,17,0.8)",
                  border: `1px solid ${m.red ? "rgba(192,57,43,0.25)" : "#222"}`,
                  padding: "5px 12px", borderRadius: "4px",
                }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Event Sponsors Strip — Feature 13 ── */}
      {hasSponsors && (
        <div style={{ borderBottom: "1px solid #1a1a1a", background: "#0d0d0d", padding: "20px 32px", overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px", maxWidth: "1200px", margin: "0 auto", flexWrap: "nowrap", minWidth: "max-content" }}>
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "8px", color: "#333", letterSpacing: "0.2em", textTransform: "uppercase", flexShrink: 0 }}>Event Partners</span>
            {sortedSponsors.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {s.logo?.asset ? (
                  <div style={{ position: "relative", width: "64px", height: "28px" }}>
                    <Image src={urlFor(s.logo).height(56).auto("format").url()} alt={s.name} fill sizes="64px" style={{ objectFit: "contain", filter: "grayscale(60%) brightness(1.5)" }} />
                  </div>
                ) : (
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", color: TIER_COLOR[s.tier] ?? "#555", letterSpacing: "0.06em" }}>{s.name}</span>
                )}
                <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "7px", color: TIER_COLOR[s.tier] ?? "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {TIER_LABEL[s.tier] ?? s.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content grid ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }} className="event-detail-grid">

        {/* Left: Description + results/recap */}
        <div>
          {/* Description */}
          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "18px", color: "#888", lineHeight: 1.75, margin: "0 0 40px" }}>
            {event.description}
          </p>

          {/* ── Live banner ── */}
          {isLive && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 24px", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)", marginBottom: "40px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#00ff88", animation: "pulse-dot 1s ease-in-out infinite", flexShrink: 0 }} />
              <p style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#00ff88", letterSpacing: "0.1em", margin: 0 }}>
                THIS EVENT IS LIVE RIGHT NOW
              </p>
            </div>
          )}

          {/* ── Podium Results — Feature 18 ── */}
          {hasResults && (
            <section style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 20px" }}>
                Results
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {podium.map((r) => {
                  const medal = r.place === 1 ? "🥇" : r.place === 2 ? "🥈" : r.place === 3 ? "🥉" : null;
                  const accent = r.place === 1 ? "#E8C547" : r.place === 2 ? "#aaa" : r.place === 3 ? "#cd7f32" : "#555";
                  return (
                    <div
                      key={r.place}
                      style={{
                        flex: r.place <= 3 ? "1 1 180px" : "0 1 140px",
                        padding: "24px",
                        border: `1px solid ${r.place <= 3 ? accent + "44" : "#1e1e1e"}`,
                        borderTop: `3px solid ${accent}`,
                        background: "#0d0d0d",
                        textAlign: "center",
                      }}
                    >
                      <p style={{ fontSize: r.place <= 3 ? "36px" : "20px", margin: "0 0 8px", lineHeight: 1 }}>
                        {medal ?? `#${r.place}`}
                      </p>
                      <p style={{ fontFamily: "var(--font-bebas)", fontSize: r.place <= 3 ? "20px" : "16px", color: "#e0e0e0", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                        {r.teamName}
                      </p>
                      {r.prize && (
                        <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: accent, margin: "0 0 4px", letterSpacing: "0.05em" }}>
                          {r.prize}
                        </p>
                      )}
                      {r.note && (
                        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "12px", color: "#555", margin: 0 }}>
                          {r.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Leaderboard — Feature 18 ── */}
          {hasLeaderboard && (
            <section style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Full Leaderboard
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                      {["Rank", "Player", "Team", "Kills", "Score"].map((h) => (
                        <th key={h} style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 16px", textAlign: "left", fontWeight: 400 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row, i) => (
                      <tr key={row.rank} style={{ borderBottom: "1px solid #111", background: i % 2 === 0 ? "#0d0d0d" : "transparent" }}>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-bebas)", fontSize: "20px", color: row.rank <= 3 ? "#C0392B" : "#333", letterSpacing: "0.04em" }}>
                          #{row.rank}
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-rajdhani)", fontSize: "15px", fontWeight: 600, color: "#e0e0e0" }}>
                          {row.player}
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#666" }}>
                          {row.team ?? "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-space-mono)", fontSize: "13px", color: "#888" }}>
                          {row.kills ?? "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-space-mono)", fontSize: "13px", color: "#C0392B" }}>
                          {row.score ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Recap Section — Feature 19 ── */}
          {hasRecap && (
            <section style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 20px" }}>
                Event Recap
              </p>

              {/* YouTube embed */}
              {embedUrl && (
                <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden", borderRadius: "8px", border: "1px solid #1e1e1e", marginBottom: "24px" }}>
                  <iframe
                    src={embedUrl}
                    title={`${event.name} recap`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              )}

              {/* Photo gallery — masonry-style grid */}
              {(event.recapGallery?.length ?? 0) > 0 && (
                <div style={{ columns: "2 200px", gap: "8px" }}>
                  {event.recapGallery!.map((img, i) => {
                    if (!img.asset) return null;
                    const src = urlFor(img).width(600).auto("format").url();
                    return (
                      <div key={i} style={{ breakInside: "avoid", marginBottom: "8px", position: "relative", borderRadius: "6px", overflow: "hidden", border: "1px solid #1a1a1a" }}>
                        <Image
                          src={src}
                          alt={img.alt ?? `Event photo ${i + 1}`}
                          width={600}
                          height={400}
                          sizes="(max-width: 600px) 100vw, 300px"
                          style={{ width: "100%", height: "auto", display: "block" }}
                        />
                        {img.caption && (
                          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#444", padding: "6px 10px", margin: 0, letterSpacing: "0.05em" }}>
                            {img.caption}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Highlights text */}
          {event.highlights && (
            <div style={{ padding: "24px", border: "1px solid #1e1e1e", borderLeft: "3px solid #C0392B", background: "#0d0d0d", marginBottom: "32px" }}>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
                Highlights
              </p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#888", lineHeight: 1.7, margin: 0 }}>
                {event.highlights}
              </p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Countdown — Feature 17 */}
          {isActive && !isLive && (
            <CountdownTimer event={event} />
          )}

          {/* Registration form — Feature 16 */}
          {event.registrationOpen && !isCompleted && (
            <EventRegistrationForm
              eventId={event._id}
              eventName={event.name}
              game={event.game}
              maxTeams={event.maxTeams}
            />
          )}

          {/* External registration link fallback */}
          {!event.registrationOpen && event.registrationLink && isActive && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "#C0392B",
                color: "#fff",
                padding: "16px",
                fontFamily: "var(--font-bebas)",
                fontSize: "20px",
                letterSpacing: "0.1em",
                textDecoration: "none",
                textAlign: "center",
                borderRadius: "4px",
              }}
            >
              REGISTER NOW →
            </a>
          )}

          {/* Event info card */}
          <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              Event Details
            </p>
            {[
              { label: "Game",  value: event.game },
              { label: "Date",  value: fmtDate(event.eventDate) },
              { label: "Venue", value: event.venue },
              ...(event.prizePool > 0 ? [{ label: "Prize Pool", value: fmtPrize(event.prizePool) }] : []),
              ...(event.maxTeams ? [{ label: "Max Teams", value: String(event.maxTeams) }] : []),
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "8px", borderBottom: "1px solid #111", paddingBottom: "12px" }}>
                <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#444", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#aaa", textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Back link */}
          <Link href="/events" style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#444", letterSpacing: "0.1em", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            ← All Events
          </Link>
        </aside>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @media (max-width: 900px) {
          .event-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
