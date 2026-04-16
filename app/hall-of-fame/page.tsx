import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCompletedEventsWithResults } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hall of Fame | Alpha Rig",
  description:
    "Every champion. Every prize. Every legend. The complete record of Alpha Rig esports tournament winners — from our first event to today.",
  openGraph: {
    title: "Alpha Rig Hall of Fame",
    description: "The champions of every Alpha Rig esports tournament.",
    url: "https://alpharig.in/hall-of-fame",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Alpha Rig Hall of Fame" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).toUpperCase();
}

export default async function HallOfFamePage() {
  const events = await getCompletedEventsWithResults();

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>

      {/* ── Hero ── */}
      <section
        style={{
          padding: "140px 24px 80px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div aria-hidden style={{ position: "absolute", top: "60px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(232,197,71,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#E8C547", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 20px" }}>
          Hall of Fame
        </p>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(60px, 10vw, 110px)", lineHeight: 0.9, letterSpacing: "0.02em", color: "#ffffff", margin: "0 0 24px" }}>
          EVERY
          <br />
          <span style={{ color: "#E8C547" }}>CHAMPION</span>
        </h1>
        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "18px", color: "#555", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto" }}>
          The permanent record of every team and player who topped the bracket at an Alpha Rig event.
        </p>
      </section>

      {/* ── Empty state ── */}
      {events.length === 0 && (
        <section style={{ textAlign: "center", padding: "80px 24px 120px" }}>
          <p style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", color: "#222", letterSpacing: "0.08em" }}>
            NO RESULTS YET
          </p>
          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#333", marginTop: "12px" }}>
            Complete events with results will appear here.
          </p>
          <Link href="/events" style={{ display: "inline-block", marginTop: "24px", fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.12em", textDecoration: "none" }}>
            View Upcoming Events →
          </Link>
        </section>
      )}

      {/* ── Event entries ── */}
      {events.length > 0 && (
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 100px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#1a1a1a" }}>
            {events.map((event) => {
              const winner = event.results?.find((r) => r.place === 1);
              const runnerUp = event.results?.find((r) => r.place === 2);
              const third = event.results?.find((r) => r.place === 3);
              const coverSrc = event.coverImage?.asset
                ? urlFor(event.coverImage).width(120).height(80).fit("crop").auto("format").url()
                : null;

              return (
                <div
                  key={event._id}
                  style={{
                    background: "#0A0A0A",
                    padding: "28px 32px",
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: "28px",
                    alignItems: "center",
                  }}
                >
                  {/* Cover thumbnail */}
                  <div style={{ position: "relative", width: "80px", height: "56px", borderRadius: "4px", overflow: "hidden", background: "#111", flexShrink: 0 }}>
                    {coverSrc ? (
                      <Image src={coverSrc} alt={event.name} fill sizes="80px" style={{ objectFit: "cover", opacity: 0.7 }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--font-bebas)", fontSize: "10px", color: "#333", letterSpacing: "0.1em" }}>
                          {event.game.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event info + podium */}
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <Link
                        href={`/events/${event.slug.current}`}
                        style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#e0e0e0", letterSpacing: "0.04em", textDecoration: "none" }}
                      >
                        {event.name}
                      </Link>
                      <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#444", letterSpacing: "0.1em" }}>
                        {event.game} · {fmtDate(event.eventDate)}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                      {winner && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "18px" }}>🥇</span>
                          <div>
                            <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", fontWeight: 700, color: "#E8C547", margin: 0 }}>{winner.teamName}</p>
                            {winner.prize && <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#666", margin: 0 }}>{winner.prize}</p>}
                          </div>
                        </div>
                      )}
                      {runnerUp && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "16px" }}>🥈</span>
                          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#888", margin: 0 }}>{runnerUp.teamName}</p>
                        </div>
                      )}
                      {third && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px" }}>🥉</span>
                          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "13px", color: "#666", margin: 0 }}>{third.teamName}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View link */}
                  <Link
                    href={`/events/${event.slug.current}`}
                    style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#333", letterSpacing: "0.12em", textDecoration: "none", flexShrink: 0, textTransform: "uppercase" }}
                  >
                    View →
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/events" style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.12em", textDecoration: "none", border: "1px solid rgba(192,57,43,0.3)", padding: "12px 28px" }}>
              SEE UPCOMING EVENTS →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
