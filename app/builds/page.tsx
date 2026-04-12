import type { Metadata } from "next";
import { getAllBuilds } from "@/lib/queries";
import BuildsGrid from "./BuildsGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Custom PC Builds | Alpha Rig",
  description:
    "Every machine is hand-assembled, bench-tested, and built to outlast the hype. Browse Alpha Rig's portfolio of custom PC builds.",
};

export default async function BuildsPage() {
  const builds = await getAllBuilds();

  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>
      {/* ── Hero ── */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: "300px", paddingTop: "80px" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 30% 120%, rgba(192,57,43,0.1) 0%, transparent 65%)",
          }}
        />
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#C0392B" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        <div className="relative z-10 mx-auto w-full px-6 pb-12" style={{ maxWidth: "1200px" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#C0392B",
              marginBottom: "12px",
            }}
          >
            // ALPHA RIG · PORTFOLIO
          </p>
          <h1
            className="leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 8vw, 80px)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            OUR BUILDS
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "#888888",
              marginTop: "12px",
            }}
          >
            Every machine is hand-assembled, bench-tested, and built to outlast the hype.
          </p>
        </div>
      </section>

      <BuildsGrid builds={builds} />
    </main>
  );
}
