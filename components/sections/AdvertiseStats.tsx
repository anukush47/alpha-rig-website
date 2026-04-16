"use client";

import CountUp from "@/components/ui/CountUp";

const STATS = [
  { countEnd: 10,  suffix: "K+",  label: "Monthly Readers",        isCount: true  },
  { value: "4.2 min",              label: "Avg. Time on Article",   isCount: false },
  { countEnd: 78,  suffix: "%",   label: "India-Based Audience",   isCount: true  },
  { countEnd: 65,  suffix: "%",   label: "Male 18–34 Demographic", isCount: true  },
  { value: "3.1×",                 label: "Avg. Pages per Session", isCount: false },
  { countEnd: 82,  suffix: "%",   label: "Organic Traffic Share",  isCount: true  },
];

export default function AdvertiseStats() {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "40px",
        textAlign: "center",
      }}
    >
      {STATS.map((s) => (
        <div key={s.label}>
          <p
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5vw, 52px)",
              color: "#fff",
              letterSpacing: "0.04em",
              margin: "0 0 6px",
              lineHeight: 1,
            }}
          >
            {s.isCount && "countEnd" in s ? (
              <CountUp end={s.countEnd!} suffix={s.suffix ?? ""} duration={1600} />
            ) : (
              s.value
            )}
          </p>
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "10px",
              color: "#555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
