"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const paymentId = searchParams.get("paymentId") ?? "";
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(18,18,18,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "52px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(to right, transparent, #27AE60 40%, #27AE60 60%, transparent)",
          }}
        />

        {/* Check icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(39,174,96,0.12)",
            border: "1px solid rgba(39,174,96,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(40px, 8vw, 56px)",
            color: "#ffffff",
            letterSpacing: "0.04em",
            lineHeight: 1,
            marginBottom: "12px",
          }}
        >
          ORDER CONFIRMED
        </h1>

        <p
          style={{
            fontFamily: "var(--font-rajdhani)",
            fontSize: "17px",
            color: "#888",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          Thank you for your order. We&apos;re getting your gear ready.
          You&apos;ll receive a confirmation on your email shortly.
        </p>

        {/* Order details */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "32px",
            textAlign: "left",
          }}
        >
          {orderId && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "1.5px", color: "#444" }}>ORDER ID</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#888", wordBreak: "break-all" }}>{orderId}</span>
            </div>
          )}
          {paymentId && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "1.5px", color: "#444" }}>PAYMENT ID</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#888", wordBreak: "break-all" }}>{paymentId}</span>
            </div>
          )}
        </div>

        <Link
          href="/store"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-bebas)",
            fontSize: "20px",
            letterSpacing: "0.06em",
            color: "#fff",
            background: "#C0392B",
            borderRadius: "10px",
            padding: "14px 40px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#E74C3C")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#C0392B")}
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
