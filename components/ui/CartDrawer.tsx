"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function QuantityBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)",
        color: "#fff",
        fontSize: "16px",
        lineHeight: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.25)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")
      }
    >
      {children}
    </button>
  );
}

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getTotalPrice } =
    useCartStore();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const total = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              background: "rgba(0,0,0,0.6)",
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(420px, 100vw)",
              zIndex: 61,
              background: "#111111",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "28px",
                    color: "#fff",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  YOUR CART
                </span>
                {items.length > 0 && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "#555",
                      letterSpacing: "1px",
                    }}
                  >
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent",
                  color: "#888",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#888";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "40px 24px",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <p style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#333", letterSpacing: "0.04em" }}>
                  YOUR CART IS EMPTY
                </p>
                <button
                  onClick={closeCart}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "#C0392B",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  Continue Shopping →
                </button>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "0" }}>
                {items.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "12px 0" }} />}
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      {/* Image */}
                      <div
                        style={{
                          width: "68px",
                          height: "68px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#1a1a1a",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={68}
                            height={68}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M3 15l5-5 4 4 3-3 6 6" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#fff",
                            marginBottom: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "16px", color: "#C0392B", marginBottom: "10px" }}>
                          {fmtPrice(item.price)}
                        </p>

                        {/* Quantity + remove */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <QuantityBtn onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</QuantityBtn>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#fff", minWidth: "20px", textAlign: "center" }}>
                              {item.quantity}
                            </span>
                            <QuantityBtn onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</QuantityBtn>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "9px",
                              letterSpacing: "1.5px",
                              color: "#444",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C0392B")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#444")}
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: "20px 24px 28px",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Subtotal */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#666" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "20px", color: "#fff" }}>
                    {fmtPrice(total)}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1px", color: "#444", marginTop: "-8px" }}>
                  SHIPPING & TAXES CALCULATED AT CHECKOUT
                </p>

                {/* Checkout button */}
                <button
                  onClick={() => { closeCart(); router.push("/checkout"); }}
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "22px",
                    letterSpacing: "0.06em",
                    color: "#fff",
                    background: "#C0392B",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px",
                    cursor: "pointer",
                    width: "100%",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#E74C3C")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#C0392B")}
                >
                  PROCEED TO CHECKOUT
                </button>

                {/* Continue */}
                <button
                  onClick={closeCart}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "#555",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
