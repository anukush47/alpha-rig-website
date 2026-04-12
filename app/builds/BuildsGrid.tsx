"use client";

import { useState } from "react";
import BuildCard from "@/components/ui/BuildCard";
import type { BuildSummary } from "@/lib/queries";

const FILTERS = [
  { label: "All",         value: "all"         },
  { label: "Water Cooled", value: "water-cooled" },
  { label: "Air Cooled",  value: "air-cooled"  },
  { label: "RGB",         value: "rgb"         },
  { label: "Compact",     value: "compact"     },
  { label: "Workstation", value: "workstation" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export default function BuildsGrid({ builds }: { builds: BuildSummary[] }) {
  const [active, setActive] = useState<FilterValue>("all");

  const filtered =
    active === "all" ? builds : builds.filter((b) => b.category === active);

  return (
    <>
      {/* ── Filter bar ── */}
      <div
        className="sticky top-0 z-30 w-full"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(10,10,10,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="mx-auto px-6 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none"
          style={{ maxWidth: "1200px", WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] }}
        >
          {FILTERS.map(({ label, value }) => {
            const isActive = active === value;
            return (
              <button
                key={value}
                onClick={() => setActive(value)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  letterSpacing: "1.5px",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  background: isActive ? "#C0392B" : "#1A1A1A",
                  color: isActive ? "#ffffff" : "#888888",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "#C0392B";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "#888888";
                }}
              >
                {label.toUpperCase()}
              </button>
            );
          })}

          <span
            className="ml-auto shrink-0"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "1px",
              color: "#444",
            }}
          >
            {filtered.length} BUILDS
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="mx-auto w-full px-6 py-12" style={{ maxWidth: "1200px" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24">
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#333",
              }}
            >
              NO BUILDS IN THIS CATEGORY YET
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))" }}
          >
            {filtered.map((build, i) => (
              <BuildCard key={build._id} build={build} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
