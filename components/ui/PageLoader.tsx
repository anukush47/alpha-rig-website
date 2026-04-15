"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done" | "hidden">("loading");

  useEffect(() => {
    // Animate progress bar to 85% quickly, then to 100% on window load
    let frame: ReturnType<typeof requestAnimationFrame>;
    let start: number | null = null;

    const animateTo = (target: number, duration: number, onDone?: () => void) => {
      if (frame) cancelAnimationFrame(frame);
      const from = progress;
      start = null;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(Math.round(from + (target - from) * eased));
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          onDone?.();
        }
      };
      frame = requestAnimationFrame(tick);
    };

    // Quick ramp to 82%
    animateTo(82, 900);

    const onLoad = () => {
      // Fill to 100% then fade out
      animateTo(100, 400, () => {
        setPhase("done");
        setTimeout(() => setVisible(false), 600);
      });
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
      // Fallback — never hang beyond 3.5 s
      const fallback = setTimeout(onLoad, 3500);
      return () => {
        clearTimeout(fallback);
        cancelAnimationFrame(frame);
        window.removeEventListener("load", onLoad);
      };
    }

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        opacity: phase === "done" ? 0 : 1,
        transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: phase === "done" ? "none" : "all",
        overflow: "hidden",
      }}
    >
      {/* ── Background grid ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(192,57,43,0.04) 60px, rgba(192,57,43,0.04) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(192,57,43,0.04) 60px, rgba(192,57,43,0.04) 61px)
          `,
          pointerEvents: "none",
        }}
      />

      {/* ── Radial red glow ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(192,57,43,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
        }}
      >
        {/* Brand tag */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#C0392B",
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          // ALPHA RIG PRIVATE LIMITED
        </p>

        {/* Wordmark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 16vw, 120px)",
              color: "#ffffff",
              lineHeight: 0.88,
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            ALPHA
          </h1>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 16vw, 120px)",
              color: "#C0392B",
              lineHeight: 0.88,
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            RIG
          </h1>
        </div>

        {/* Progress bar track */}
        <div
          style={{
            width: "clamp(200px, 40vw, 320px)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Bar */}
          <div
            style={{
              width: "100%",
              height: "2px",
              background: "rgba(255,255,255,0.07)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #8B1A10, #C0392B, #E74C3C)",
                borderRadius: "2px",
                transition: "width 0.1s linear",
                boxShadow: "0 0 8px rgba(192,57,43,0.7)",
              }}
            />
          </div>

          {/* Status row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "2.5px",
                color: "#444",
                textTransform: "uppercase",
              }}
            >
              {progress < 100 ? "INITIALIZING SYSTEMS..." : "SYSTEMS ONLINE"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "1px",
                color: "#C0392B",
              }}
            >
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom corner tag ── */}
      <p
        style={{
          position: "absolute",
          bottom: "28px",
          right: "28px",
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          letterSpacing: "2px",
          color: "#222",
          textTransform: "uppercase",
        }}
      >
        FORGE YOUR LEGEND
      </p>
    </div>
  );
}
