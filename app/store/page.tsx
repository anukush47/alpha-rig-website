import type { Metadata } from "next";
import { getAllProducts } from "@/lib/queries";
import StoreClient from "./StoreClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Store | Alpha Rig",
  description: "GPUs, CPUs, cooling, peripherals, and Alpha Rig Originals — hand-picked hardware for serious builders.",
  openGraph: {
    title: "The Store | Alpha Rig",
    description: "Shop curated PC hardware and Alpha Rig Original products.",
    type: "website",
  },
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

      {/* ── Products ── */}
      <StoreClient products={products} />
    </main>
  );
}
