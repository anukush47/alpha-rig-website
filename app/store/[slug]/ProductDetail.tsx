"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCursorGlow } from "@/lib/useCursorGlow";
import { useCartStore } from "@/lib/store";
import { urlFor } from "@/lib/sanity";
import { trackEvent } from "@/lib/analytics";
import type { ProductFull } from "@/lib/queries";

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function QtyButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        fontSize: "20px",
        lineHeight: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.2)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
      }}
    >
      {children}
    </button>
  );
}

function AddToCartBtn({ onClick, added, inStock }: { onClick: () => void; added: boolean; inStock: boolean }) {
  const { hostRef, glowRef, handlers } = useCursorGlow<HTMLButtonElement>();
  return (
    <button
      ref={hostRef}
      {...handlers}
      onClick={onClick}
      disabled={!inStock}
      className="relative overflow-hidden"
      style={{
        width: "100%",
        fontFamily: "var(--font-bebas)",
        fontSize: "28px",
        letterSpacing: "0.08em",
        color: "#fff",
        background: !inStock ? "#222" : added ? "#27AE60" : "#C0392B",
        border: "none",
        borderRadius: "12px",
        padding: "16px",
        cursor: inStock ? "pointer" : "not-allowed",
        transition: "background 0.2s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (inStock && !added) (e.currentTarget as HTMLElement).style.background = "#E74C3C";
        handlers.onMouseMove(e);
      }}
      onMouseLeave={(e) => {
        if (inStock && !added) (e.currentTarget as HTMLElement).style.background = "#C0392B";
        handlers.onMouseLeave();
      }}
    >
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          background: "radial-gradient(120px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.18), transparent 80%)",
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>
        {!inStock ? "OUT OF STOCK" : added ? "✓ ADDED TO CART" : "ADD TO CART"}
      </span>
    </button>
  );
}

export default function ProductDetail({ product }: { product: ProductFull }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);

  const images = product.images ?? [];
  const currentImage = images[selectedImg];
  const mainUrl = currentImage?.asset
    ? urlFor(currentImage).width(1000).height(800).fit("crop").auto("format").url()
    : null;

  const thumbUrls = images.map((img) =>
    img.asset ? urlFor(img).width(200).height(200).fit("crop").auto("format").url() : null
  );

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const firstImgUrl = images[0]?.asset
    ? urlFor(images[0]).width(400).height(400).fit("crop").auto("format").url()
    : null;

  function handleAddToCart() {
    if (!product.inStock) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: firstImgUrl,
        slug: product.slug.current,
      });
    }
    trackEvent("add_to_cart", "Ecommerce", product.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  }

  function handleBuyNow() {
    if (!product.inStock) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: firstImgUrl,
      slug: product.slug.current,
    });
    router.push("/checkout");
  }

  return (
    <section className="product-detail-section" style={{ padding: "120px 24px 64px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <p className="product-breadcrumb" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#444", marginBottom: "40px" }}>
        <Link href="/store" style={{ color: "#555", textDecoration: "none" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C0392B")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
        >
          STORE
        </Link>
        {" / "}
        <span style={{ color: "#888" }}>{product.name}</span>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "55% 1fr",
          gap: "48px",
          alignItems: "start",
        }}
        className="product-detail-grid"
      >
        {/* ── LEFT: Image gallery ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Main image */}
          <div
            className="product-main-image"
            style={{
              position: "relative",
              height: "480px",
              borderRadius: "16px",
              overflow: "hidden",
              background: "linear-gradient(145deg, #1a1a1a, #0d0d0d)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {mainUrl ? (
              <Image
                src={mainUrl}
                alt={currentImage?.alt ?? product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#2a2a2a" }}>NO IMAGE</span>
              </div>
            )}

            {/* Discount badge */}
            {discount && (
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#fff",
                  background: "#27AE60",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {thumbUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: `2px solid ${selectedImg === i ? "#C0392B" : "rgba(255,255,255,0.06)"}`,
                    background: "#1a1a1a",
                    cursor: "pointer",
                    padding: 0,
                    transition: "border-color 0.15s",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {url ? (
                    <Image src={url} alt={`${product.name} ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="80px" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Brand + category */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "2px", color: "#888" }}>
              {product.brand}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "1.5px",
                color: "#C0392B",
                background: "rgba(192,57,43,0.1)",
                border: "1px solid rgba(192,57,43,0.25)",
                padding: "3px 10px",
                borderRadius: "4px",
              }}
            >
              {product.category}
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px, 5vw, 56px)",
              color: "#fff",
              letterSpacing: "0.02em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", color: "#C0392B", lineHeight: 1 }}>
              {fmtPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "22px", color: "#555", textDecoration: "line-through" }}>
                {fmtPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: product.inStock ? "#1D9E75" : "#555",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "2px",
                color: product.inStock ? "#1D9E75" : "#888",
              }}
            >
              {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#888", lineHeight: 1.7, margin: 0 }}>
            {product.description}
          </p>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          {/* Quantity selector */}
          {product.inStock && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#555" }}>QTY</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <QtyButton onClick={() => setQty((q) => Math.max(1, q - 1))}>−</QtyButton>
                <span style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: "#fff", minWidth: "28px", textAlign: "center" }}>
                  {qty}
                </span>
                <QtyButton onClick={() => setQty((q) => q + 1)}>+</QtyButton>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <AddToCartBtn onClick={handleAddToCart} added={added} inStock={product.inStock} />

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              style={{
                width: "100%",
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                letterSpacing: "0.06em",
                color: product.inStock ? "#fff" : "#444",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "14px",
                cursor: product.inStock ? "pointer" : "not-allowed",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (product.inStock) {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#C0392B";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = product.inStock ? "#fff" : "#444";
              }}
            >
              BUY NOW
            </button>
          </div>

          {/* Trust note */}
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1.5px", color: "#333", lineHeight: 1.8 }}>
            FREE SHIPPING ABOVE ₹5,000 · 7-DAY RETURNS · WARRANTY INCLUDED
          </p>

          {/* Specs accordion */}
          {product.specs && product.specs.length > 0 && (
            <div
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.07)",
                overflow: "hidden",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <button
                onClick={() => setSpecsOpen((v) => !v)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: specsOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.4)" }}>
                  SPECIFICATIONS
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  style={{ transform: specsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {specsOpen && (
                <div style={{ padding: "0 18px" }}>
                  {product.specs.map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "1px", color: "#555", textTransform: "uppercase" }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#ccc", textAlign: "right", maxWidth: "55%" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-section { padding: 88px 16px 40px !important; }
          .product-breadcrumb { margin-bottom: 20px !important; }
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .product-main-image { height: 300px !important; }
        }
      `}</style>
    </section>
  );
}
