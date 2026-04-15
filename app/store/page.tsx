import type { Metadata } from "next";
import { getAllProducts } from "@/lib/queries";
import StoreClient from "./StoreClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "PC Hardware Store",
  description:
    "Shop GPUs, CPUs, cooling, peripherals, and Alpha Rig Originals — hand-picked hardware for serious PC builders in India.",
  keywords: ["buy PC components India", "GPU India", "CPU India", "gaming peripherals", "Alpha Rig store", "PC hardware online India"],
  openGraph: {
    title: "PC Hardware Store | Alpha Rig",
    description: "Hand-picked GPUs, CPUs, cooling, peripherals, and Alpha Rig Originals.",
    url: "https://alpharig.in/store",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "PC Hardware Store | Alpha Rig" },
};

export default async function StorePage() {
  const products = await getAllProducts();

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      {/* ── Hero ── */}
      <section
        style={{
          padding: "140px 24px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glows */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(192,57,43,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(192,57,43,0.2) 30%, rgba(192,57,43,0.2) 70%, transparent)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#C0392B",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Alpha Rig · Hardware Store
          </p>

          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(64px, 12vw, 96px)",
              lineHeight: 0.95,
              color: "#ffffff",
              letterSpacing: "0.04em",
              margin: "0 0 20px",
            }}
          >
            THE STORE
          </h1>

          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontWeight: 400,
              fontSize: "18px",
              color: "#666",
              maxWidth: "480px",
              lineHeight: 1.6,
            }}
          >
            Hand-picked GPUs, CPUs, cooling, peripherals — and Alpha Rig Originals. Built for people who build.
          </p>

          {/* Stats row */}
          {products.length > 0 && (
            <div className="flex items-center gap-8 mt-8 flex-wrap">
              {[
                { label: "Products", value: products.length },
                { label: "In Stock", value: products.filter((p) => p.inStock).length },
                { label: "Originals", value: products.filter((p) => p.category === "Alpha Rig Original").length },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "32px",
                      color: "#C0392B",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: "9px",
                      letterSpacing: "2px",
                      color: "#444",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Maintenance Notice ── */}
      <section style={{ padding: "0 24px 48px" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            borderRadius: "14px",
            border: "1px solid rgba(192,57,43,0.25)",
            background: "linear-gradient(135deg, rgba(192,57,43,0.07) 0%, rgba(10,10,10,0.6) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "clamp(20px, 4vw, 32px) clamp(20px, 5vw, 40px)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top specular line */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.18) 60%, transparent)",
            }}
          />

          {/* Tag + heading row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "9px",
                letterSpacing: "2.5px",
                color: "#C0392B",
                textTransform: "uppercase",
                background: "rgba(192,57,43,0.12)",
                border: "1px solid rgba(192,57,43,0.3)",
                borderRadius: "4px",
                padding: "4px 10px",
                whiteSpace: "nowrap",
              }}
            >
              ⚠ Under Maintenance
            </span>
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(18px, 3vw, 24px)",
                color: "#ffffff",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              THIS IS A TEST STORE — NO ORDERS WILL BE PROCESSED
            </p>
          </div>

          {/* Body */}
          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontWeight: 400,
              fontSize: "15px",
              color: "#777",
              lineHeight: 1.65,
              maxWidth: "680px",
              margin: 0,
            }}
          >
            We&apos;re currently setting up our store and payment systems. You can browse all products and
            add items to cart, but no orders will be placed or payments charged at this time.
            We&apos;re working hard to go live soon — sign up for our newsletter and we&apos;ll notify
            you the moment the store opens.
          </p>

          {/* Newsletter CTA */}
          <a
            href="/#newsletter"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "4px",
              fontFamily: "var(--font-rajdhani)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.08em",
              color: "#C0392B",
              textDecoration: "none",
              border: "1px solid rgba(192,57,43,0.35)",
              borderRadius: "8px",
              padding: "10px 20px",
              width: "fit-content",
              transition: "color 0.2s, border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.7)";
              (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#C0392B";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.35)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Notify me when the store goes live →
          </a>
        </div>
      </section>

      {/* ── Products ── */}
      <StoreClient products={products} />
    </main>
  );
}
