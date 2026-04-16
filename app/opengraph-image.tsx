import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Alpha Rig | Custom PCs · Esports Events · PC Culture India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Programmatic OG image for the site root.
 * Next.js automatically serves this as /opengraph-image and wires
 * it into the <meta property="og:image"> tag — no manual metadata needed.
 *
 * Design:
 *  - Deep void background (#0a0a0a)
 *  - Red dragon-fire accent bar on the left
 *  - Crosshair grid pattern hint
 *  - Logo/wordmark (Bebas Neue style — rendered via system font fallback)
 *  - Tagline + location info
 */
export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(192,57,43,0.07) 59px, rgba(192,57,43,0.07) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(192,57,43,0.07) 59px, rgba(192,57,43,0.07) 60px)",
            display: "flex",
          }}
        />

        {/* Left red accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: "linear-gradient(180deg, #c0392b 0%, #e74c3c 50%, #c0392b 100%)",
            display: "flex",
          }}
        />

        {/* Top-right crosshair decoration */}
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 60,
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.2,
          }}
        >
          {/* horizontal */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 1,
              background: "#c0392b",
              display: "flex",
            }}
          />
          {/* vertical */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 1,
              background: "#c0392b",
              display: "flex",
            }}
          />
          {/* center dot */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#c0392b",
              display: "flex",
            }}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px 0 80px",
            flex: 1,
            marginLeft: 8,
          }}
        >
          {/* ALPHA RIG wordmark */}
          <div
            style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#ffffff",
              lineHeight: 1,
              marginBottom: 8,
              display: "flex",
            }}
          >
            ALPHA RIG
          </div>

          {/* Red divider */}
          <div
            style={{
              width: 120,
              height: 3,
              background: "#c0392b",
              marginBottom: 28,
              display: "flex",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 26,
              color: "#888888",
              letterSpacing: "0.04em",
              marginBottom: 40,
              display: "flex",
            }}
          >
            Custom PCs · Esports Events · PC Culture India
          </div>

          {/* Stat pills */}
          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            {[
              { label: "Custom Builds", value: "500+" },
              { label: "Events Hosted", value: "50+" },
              { label: "Location", value: "Chhindwara, MP" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "12px 20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Arial Black', sans-serif",
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#c0392b",
                    lineHeight: 1,
                    display: "flex",
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 12,
                    color: "#555555",
                    marginTop: 4,
                    letterSpacing: "0.06em",
                    display: "flex",
                  }}
                >
                  {s.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 80px 16px 88px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontFamily: "'Arial', monospace",
              fontSize: 13,
              color: "#444444",
              letterSpacing: "0.1em",
              display: "flex",
            }}
          >
            alpharig.in
          </span>
          <div style={{ flex: 1, display: "flex" }} />
          {/* Red dot indicator */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#c0392b",
              marginRight: 8,
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: "'Arial', monospace",
              fontSize: 12,
              color: "#c0392b",
              letterSpacing: "0.12em",
              display: "flex",
            }}
          >
            GAMING · BUILDS · COMMUNITY
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
