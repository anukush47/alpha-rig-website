"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string }) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function GlassInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}
      >
        {label}
        {required && <span style={{ color: "#C0392B" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "15px",
          color: "#fff",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "11px 14px",
          outline: "none",
          transition: "border-color 0.2s",
          width: "100%",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(192,57,43,0.5)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => { setMounted(true); }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const total = getTotalPrice();
  const field = (key: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  async function handlePay() {
    if (!form.name || !form.email || !form.phone || !form.address1 || !form.city || !form.state || !form.pincode) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: data.amount * 100,
        currency: data.currency,
        name: "Alpha Rig",
        description: "PC Hardware Purchase",
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#C0392B" },
        handler: (response) => {
          clearCart();
          router.push(
            `/order-confirmation?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`
          );
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main style={{ minHeight: "100dvh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-bebas)", fontSize: "2.5rem", color: "#333", letterSpacing: "0.04em", marginBottom: "16px" }}>
            YOUR CART IS EMPTY
          </p>
          <a href="/store" style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#C0392B", textDecoration: "none" }}>
            ← Back to Store
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", background: "#0A0A0A", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(40px, 6vw, 56px)",
            color: "#fff",
            letterSpacing: "0.04em",
            marginBottom: "40px",
          }}
        >
          CHECKOUT
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "start",
          }}
          className="checkout-grid"
        >
          {/* ── LEFT: Order summary ── */}
          <div
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "rgba(18,18,18,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "28px",
              position: "sticky",
              top: "100px",
            }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>
              ORDER SUMMARY
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {items.map((item, i) => (
                <div key={item.id}>
                  {i > 0 && <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "12px 0" }} />}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.05)" }}>
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={52} height={52} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 600, fontSize: "14px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#555" }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 700, fontSize: "15px", color: "#fff", flexShrink: 0 }}>
                      {fmtPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "20px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
              <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#666" }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 700, fontSize: "16px", color: "#fff" }}>{fmtPrice(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#666" }}>Shipping</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#555" }}>Calculated at payment</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 700, fontSize: "16px", color: "#fff" }}>Total</span>
              <span style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", color: "#C0392B", lineHeight: 1 }}>{fmtPrice(total)}</span>
            </div>
          </div>

          {/* ── RIGHT: Customer form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.3)" }}>
              DELIVERY DETAILS
            </p>

            <GlassInput label="Full Name" value={form.name} onChange={field("name")} placeholder="Your full name" required />
            <div className="checkout-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <GlassInput label="Email" type="email" value={form.email} onChange={field("email")} placeholder="you@example.com" required />
              <GlassInput label="Phone" type="tel" value={form.phone} onChange={field("phone")} placeholder="+91 XXXXX XXXXX" required />
            </div>
            <GlassInput label="Address Line 1" value={form.address1} onChange={field("address1")} placeholder="House / Flat / Street" required />
            <GlassInput label="Address Line 2" value={form.address2} onChange={field("address2")} placeholder="Landmark, Colony (optional)" />
            <div className="checkout-row-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <GlassInput label="City" value={form.city} onChange={field("city")} placeholder="Chhindwara" required />
              <GlassInput label="State" value={form.state} onChange={field("state")} placeholder="Madhya Pradesh" required />
              <GlassInput label="Pincode" value={form.pincode} onChange={field("pincode")} placeholder="490001" required />
            </div>

            {error && (
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#E74C3C", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: "8px", padding: "10px 14px" }}>
                {error}
              </p>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "26px",
                letterSpacing: "0.06em",
                color: "#fff",
                background: loading ? "#555" : "#C0392B",
                border: "none",
                borderRadius: "12px",
                padding: "18px",
                cursor: loading ? "not-allowed" : "pointer",
                width: "100%",
                transition: "background 0.2s",
                marginTop: "8px",
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = "#E74C3C";
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = "#C0392B";
              }}
            >
              {loading ? "PROCESSING..." : `PAY NOW — ${fmtPrice(total)}`}
            </button>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              {["SECURE PAYMENT", "RAZORPAY PROTECTED", "256-BIT ENCRYPTION"].map((t) => (
                <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1.5px", color: "#333" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-row-2 { grid-template-columns: 1fr !important; }
          .checkout-row-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
