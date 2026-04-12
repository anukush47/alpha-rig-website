import type { Metadata } from "next";
import { getAllEvents } from "@/lib/queries";
import EventsContent from "./EventsContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Esports Events | Alpha Rig",
  description: "Full-scale professional esports events by Alpha Rig. Live commentary, media coverage, and serious prize pools.",
};

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>
      {/* ── HERO ── (static, no motion — framer-motion is client-only) */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: "360px", paddingTop: "80px" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${10 + i * 18}%`,
                width: "1px",
                background: "linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.12) 40%, rgba(192,57,43,0.04) 100%)",
                transform: "skewX(-20deg)",
              }}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(700px circle at 20% 100%, rgba(192,57,43,0.12) 0%, transparent 60%)" }}
        />

        <div className="relative z-10 mx-auto w-full px-6 pb-12" style={{ maxWidth: "1200px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>
            // ALPHA RIG · EVENTS
          </p>
          <h1 className="leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 9vw, 80px)", color: "#ffffff", letterSpacing: "0.02em" }}>
            ESPORTS EVENTS
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "20px", color: "#888888", marginTop: "12px" }}>
            Full-scale. Professional. Unforgettable.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {["PROFESSIONAL COMMENTARY", "LIVE MEDIA COVERAGE"].map((tag) => (
              <span
                key={tag}
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#555", border: "1px solid #222", padding: "5px 12px", borderRadius: "4px", background: "rgba(17,17,17,0.6)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* All dynamic/animated content lives in client components */}
      <EventsContent events={events} />
    </main>
  );
}
