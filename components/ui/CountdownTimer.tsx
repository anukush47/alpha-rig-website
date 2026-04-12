"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AlphaEvent } from "@/lib/eventsData";

interface TimeLeft {
  days: number;
  hrs: number;
  min: number;
  sec: number;
}

function getTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hrs: Math.floor((totalSec % 86400) / 3600),
    min: Math.floor((totalSec % 3600) / 60),
    sec: totalSec % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div
        className="w-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: "#111111",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 8px",
          minWidth: "72px",
        }}
      >
        {/* Subtle inner top highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 right-0"
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 56px)",
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          {pad(value)}
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "2.5px",
          color: "#555555",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ event }: { event: AlphaEvent }) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(event.date));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(getTimeLeft(event.date)), 1000);
    return () => clearInterval(id);
  }, [event.date]);

  const isExpired = mounted &&
    time.days === 0 && time.hrs === 0 && time.min === 0 && time.sec === 0;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(26,26,26,0.8)",
        border: "1px solid #C0392B",
        borderRadius: "16px",
      }}
    >
      {/* Top accent stripe */}
      <div
        aria-hidden
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #C0392B 0%, #E74C3C 50%, transparent 100%)",
        }}
      />

      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(500px circle at 50% -20%, rgba(192,57,43,0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
              }}
            >
              // NEXT EVENT
            </span>
            <h2
              className="leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "#ffffff",
                letterSpacing: "0.02em",
              }}
            >
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#888888",
                }}
              >
                {event.game}
              </span>
              <span style={{ color: "#333" }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#C0392B",
                }}
              >
                PRIZE POOL: {event.prizePool}
              </span>
              <span style={{ color: "#333" }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#555",
                }}
              >
                {event.dateDisplay}
              </span>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="animate-pulse"
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#C0392B",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#C0392B",
              }}
            >
              {event.status === "registration-open" ? "REG OPEN" : "COMING SOON"}
            </span>
          </div>
        </div>

        {/* Countdown units */}
        {isExpired ? (
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              color: "#C0392B",
              textAlign: "center",
            }}
          >
            LIVE NOW
          </p>
        ) : (
          <div className="flex items-start gap-3 sm:gap-4">
            <Unit value={mounted ? time.days : 0} label="DAYS" />
            <Separator />
            <Unit value={mounted ? time.hrs : 0} label="HRS" />
            <Separator />
            <Unit value={mounted ? time.min : 0} label="MIN" />
            <Separator />
            <Unit value={mounted ? time.sec : 0} label="SEC" />
          </div>
        )}

        {/* Register CTA */}
        <Link
          href={event.registrationUrl ?? "/contact"}
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            background: "#C0392B",
            borderRadius: "10px",
            padding: "16px",
            textDecoration: "none",
            animation: "pulse-red 2.4s ease-in-out infinite",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              color: "#ffffff",
              letterSpacing: "0.06em",
              position: "relative",
              zIndex: 1,
            }}
          >
            REGISTER NOW →
          </span>
        </Link>

        <style>{`
          @keyframes pulse-red {
            0%, 100% { box-shadow: 0 0 0 0 rgba(192,57,43,0.4); }
            50%       { box-shadow: 0 0 0 12px rgba(192,57,43,0); }
          }
        `}</style>
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div
      className="flex flex-col items-center justify-center self-stretch pb-6"
      style={{ color: "#333333" }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "36px",
          lineHeight: 1,
        }}
      >
        :
      </span>
    </div>
  );
}
