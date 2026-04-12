"use client";

import { motion } from "framer-motion";
import CountdownTimer from "@/components/ui/CountdownTimer";
import EventCard from "@/components/ui/EventCard";
import { EVENTS, NEXT_EVENT, UPCOMING, PAST } from "@/lib/eventsData";
import Link from "next/link";

// ─── Role card (team section) ─────────────────────────────────────────────────
function RoleCard({
  role,
  name,
  description,
  index,
}: {
  role: string;
  name: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col gap-4 p-6"
      style={{
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        background: "rgba(17,17,17,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
      }}
    >
      <div className="flex flex-col gap-1">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "3px",
            color: "#C0392B",
            textTransform: "uppercase",
          }}
        >
          {role}
        </span>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "18px",
            color: "#ffffff",
          }}
        >
          {name}
        </p>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "#666666",
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ─── Past event showcase card ─────────────────────────────────────────────────
function PastCard({ event }: { event: (typeof PAST)[number] }) {
  return (
    <div
      className="relative flex flex-col justify-end overflow-hidden shrink-0"
      style={{
        width: "300px",
        height: "200px",
        borderRadius: "12px",
        background:
          "linear-gradient(145deg, rgba(26,26,26,1), rgba(10,10,10,1))",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Grid bg */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`past-${event.id}`}
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 36 0 L 0 0 0 36"
              fill="none"
              stroke={event.accentColor}
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#past-${event.id})`} />
      </svg>

      {/* Bottom gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-1 p-4">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "2px",
            color: event.accentColor,
            opacity: 0.8,
          }}
        >
          {event.dateDisplay}
        </span>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          {event.name}
        </h4>
        {event.winner && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "1px",
              color: "#F39C12",
              marginTop: "2px",
            }}
          >
            🏆 {event.winner.split("—")[0].trim()}
          </p>
        )}
        <Link
          href={`/events/${event.id}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "1px",
            color: "#555",
            textDecoration: "none",
            marginTop: "4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#888")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#555")
          }
        >
          View Highlights →
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>
      {/* ── HERO ── */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: "360px", paddingTop: "80px" }}
      >
        {/* Diagonal accent lines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${10 + i * 18}%`,
                width: "1px",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.12) 40%, rgba(192,57,43,0.04) 100%)",
                transform: "skewX(-20deg)",
              }}
            />
          ))}
        </div>

        {/* Red glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px circle at 20% 100%, rgba(192,57,43,0.12) 0%, transparent 60%)",
          }}
        />

        <div
          className="relative z-10 mx-auto w-full px-6 pb-12"
          style={{ maxWidth: "1200px" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#C0392B",
              marginBottom: "12px",
            }}
          >
            // ALPHA RIG · EVENTS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 9vw, 80px)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            ESPORTS EVENTS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "20px",
              color: "#888888",
              marginTop: "12px",
            }}
          >
            Full-scale. Professional. Unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap gap-3 mt-5"
          >
            {["PROFESSIONAL COMMENTARY", "LIVE MEDIA COVERAGE"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#555",
                  border: "1px solid #222",
                  padding: "5px 12px",
                  borderRadius: "4px",
                  background: "rgba(17,17,17,0.6)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="w-full py-16" style={{ background: "#0A0A0A" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "900px" }}>
          <CountdownTimer event={NEXT_EVENT} />
        </div>
      </section>

      {/* ── UPCOMING EVENTS GRID ── */}
      <section
        className="w-full py-20"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid #111",
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
                marginBottom: "12px",
              }}
            >
              // ON THE HORIZON
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5vw, 56px)",
                color: "#ffffff",
                letterSpacing: "0.02em",
                lineHeight: 0.95,
              }}
            >
              UPCOMING EVENTS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {UPCOMING.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PAST EVENTS SHOWCASE ── */}
      <section
        className="w-full py-20"
        style={{
          background: "#080808",
          borderTop: "1px solid #111",
        }}
      >
        <div className="mx-auto px-6 mb-10" style={{ maxWidth: "1200px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
                marginBottom: "12px",
              }}
            >
              // BATTLE HISTORY
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5vw, 56px)",
                color: "#ffffff",
                letterSpacing: "0.02em",
                lineHeight: 0.95,
              }}
            >
              WAR CHRONICLES
            </h2>
          </motion.div>
        </div>

        {/* Horizontally scrollable row */}
        <div
          className="mx-auto pl-6"
          style={{ maxWidth: "1200px", overflowX: "auto", paddingBottom: "16px" }}
        >
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {PAST.map((event) => (
              <PastCard key={event.id} event={event} />
            ))}
            {/* "All events" end card */}
            <Link
              href="/events/archive"
              className="flex flex-col items-center justify-center shrink-0"
              style={{
                width: "180px",
                height: "200px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(17,17,17,0.5)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(192,57,43,0.3)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.06)")
              }
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#444",
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                VIEW ALL
                <br />
                EVENTS →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section
        className="w-full py-20"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid #111",
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
                marginBottom: "12px",
              }}
            >
              // THE CREW
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 48px)",
                color: "#ffffff",
                letterSpacing: "0.02em",
                lineHeight: 0.95,
              }}
            >
              OUR BATTLE TEAM
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "#666",
              maxWidth: "560px",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            Every Alpha Rig event is run by a dedicated production team — from
            venue setup and bracket management to live commentary and
            post-event media. This is the backbone behind every clean broadcast.
          </motion.p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <RoleCard
              index={0}
              role="EVENT DIRECTOR"
              name="Open Position"
              description="Responsible for end-to-end event logistics — venue coordination, bracket management, team communications, and day-of operations. 3+ years event management experience preferred."
            />
            <RoleCard
              index={1}
              role="LEAD COMMENTATOR"
              name="Open Position"
              description="Voice of the event. Handles play-by-play and color commentary across all Alpha Rig broadcasts. Deep knowledge of the featured game title required. Bilingual (Hindi/English) preferred."
            />
            <RoleCard
              index={2}
              role="MEDIA & PRODUCTION"
              name="Open Position"
              description="Manages OBS/stream setup, graphics overlay, on-site photography, and post-event highlight reels. Handles social media rollout during and after the event."
            />
          </div>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/contact?subject=events-team"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "0.06em",
                color: "#C0392B",
                padding: "13px 32px",
                borderRadius: "8px",
                border: "1px solid rgba(192,57,43,0.35)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#C0392B";
                el.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "#C0392B";
              }}
            >
              JOIN THE TEAM →
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
