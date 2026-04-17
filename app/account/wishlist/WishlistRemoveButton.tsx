"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistRemoveButton({
  productId,
  wishlistId,
}: {
  productId: string;
  wishlistId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function remove() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  // suppress unused warning — wishlistId kept for future direct-delete if needed
  void wishlistId;

  return (
    <button
      onClick={remove}
      disabled={loading}
      aria-label="Remove from wishlist"
      style={{
        width: 38,
        height: 38,
        borderRadius: 7,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: loading ? "wait" : "pointer",
        flexShrink: 0,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.3)";
        (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
      }}
    >
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke={loading ? "#333" : "#555"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
    </button>
  );
}
