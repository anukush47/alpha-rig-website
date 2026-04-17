"use client";

import { useState, useEffect, useCallback } from "react";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  imageUrl?: string | null;
  /** If provided, button starts in filled state */
  initialInWishlist?: boolean;
  /** size variant */
  size?: "sm" | "md";
}

export default function WishlistButton({
  productId,
  productName,
  productSlug,
  price,
  imageUrl,
  initialInWishlist = false,
  size = "md",
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false); // whether we've verified server state

  // On mount, check server state once (avoids flash)
  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/wishlist");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const found = Array.isArray(data.items)
          ? data.items.some((i: { productId: string }) => i.productId === productId)
          : false;
        setInWishlist(found);
      } catch {
        // not signed in or error — leave as-is
      } finally {
        if (!cancelled) setChecked(true);
      }
    }
    check();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const toggle = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const wasIn = inWishlist;
    // Optimistic
    setInWishlist(!wasIn);

    try {
      if (wasIn) {
        const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        if (!res.ok) setInWishlist(true); // rollback
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, productName, productSlug, price, imageUrl }),
        });
        if (!res.ok) setInWishlist(false); // rollback
      }
    } catch {
      setInWishlist(wasIn); // rollback on network error
    } finally {
      setLoading(false);
    }
  }, [loading, inWishlist, productId, productName, productSlug, price, imageUrl]);

  const dim = size === "sm" ? 28 : 34;
  const iconSize = size === "sm" ? 13 : 16;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      disabled={loading}
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        border: inWishlist
          ? "1px solid rgba(192,57,43,0.4)"
          : "1px solid rgba(255,255,255,0.1)",
        background: inWishlist
          ? "rgba(192,57,43,0.12)"
          : "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
        opacity: !checked && !initialInWishlist ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!inWishlist) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.4)";
          (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!inWishlist) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
          (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.5)";
        }
      }}
    >
      {/* Heart SVG */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={inWishlist ? "#c0392b" : "none"}
        stroke={inWishlist ? "#c0392b" : "rgba(255,255,255,0.5)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: "all 0.2s ease",
          transform: loading ? "scale(0.85)" : "scale(1)",
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
