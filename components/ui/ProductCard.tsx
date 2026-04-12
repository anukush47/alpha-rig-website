"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCursorGlow } from "@/lib/useCursorGlow";
import { useCartStore } from "@/lib/store";
import { urlFor } from "@/lib/sanity";
import type { ProductSummary } from "@/lib/queries";

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function ProductCard({
  product,
  index = 0,
}: {
  product: ProductSummary;
  index?: number;
}) {
  const { hostRef, glowRef, handlers } = useCursorGlow();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const slug = product.slug.current;
  const firstImage = product.images?.[0];
  const imgUrl = firstImage?.asset
    ? urlFor(firstImage).width(600).height(500).fit("crop").auto("format").url()
    : null;

  const isOriginal = product.category === "Alpha Rig Original";
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  function handleAddToCart() {
    if (!product.inStock) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: imgUrl,
      slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease: "easeOut" }}
      ref={hostRef as React.RefObject<HTMLElement>}
      {...handlers}
      onMouseEnter={(e) => {
        setHovered(true);
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.3)";
        handlers.onMouseMove(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        handlers.onMouseLeave();
      }}
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: "14px",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        background: "rgba(26,26,26,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.25s ease",
      }}
    >
      {/* Cursor glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: 0,
          background:
            "radial-gradient(220px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.08), transparent 70%)",
        }}
      />

      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden shrink-0"
        style={{ height: "200px", background: "linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)" }}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={firstImage?.alt ?? product.name}
            fill
            priority={index < 4}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg aria-hidden className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`pg-${product._id}`} width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#C0392B" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pg-${product._id})`} />
            </svg>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "#2a2a2a", position: "relative" }}>
              NO IMAGE
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#888",
                border: "1px solid #333",
                padding: "6px 14px",
                borderRadius: "4px",
                background: "rgba(10,10,10,0.8)",
              }}
            >
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Quick view overlay — on hover, in stock */}
        {product.inStock && hovered && (
          <Link
            href={`/store/${slug}`}
            className="absolute inset-0 flex items-end justify-center z-20 pb-3"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#fff",
                background: "rgba(192,57,43,0.85)",
                padding: "5px 14px",
                borderRadius: "4px",
                backdropFilter: "blur(8px)",
              }}
            >
              QUICK VIEW →
            </span>
          </Link>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          {isOriginal && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                letterSpacing: "1.5px",
                color: "#fff",
                background: "#C0392B",
                padding: "3px 8px",
                borderRadius: "3px",
              }}
            >
              ALPHA RIG ORIGINAL
            </span>
          )}
          {discount && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                letterSpacing: "1px",
                color: "#fff",
                background: "#27AE60",
                padding: "3px 8px",
                borderRadius: "3px",
              }}
            >
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col gap-3 p-4 flex-1">
        {/* Brand */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "1.5px",
            color: "#444",
            textTransform: "uppercase",
          }}
        >
          {product.brand}
        </span>

        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "15px",
            color: "#ffffff",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: 0,
          }}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "20px",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            {fmtPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "#555",
                textDecoration: "line-through",
              }}
            >
              {fmtPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          style={{
            width: "100%",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.06em",
            padding: "10px 0",
            borderRadius: "8px",
            border: "none",
            cursor: product.inStock ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            background: !product.inStock
              ? "#1a1a1a"
              : added
              ? "#27AE60"
              : "#C0392B",
            color: !product.inStock ? "#444" : "#ffffff",
          }}
          onMouseEnter={(e) => {
            if (product.inStock && !added)
              (e.currentTarget as HTMLElement).style.background = "#E74C3C";
          }}
          onMouseLeave={(e) => {
            if (product.inStock && !added)
              (e.currentTarget as HTMLElement).style.background = "#C0392B";
          }}
        >
          {!product.inStock ? "OUT OF STOCK" : added ? "✓ ADDED!" : "ADD TO CART"}
        </button>
      </div>
    </motion.article>
  );
}
