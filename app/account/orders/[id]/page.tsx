import { auth } from "@clerk/nextjs/server";
import { createClient } from "@sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Detail | Alpha Rig" };

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:     false,
  token:      process.env.SANITY_API_TOKEN,
});

const STATUS_STEPS = ["pending", "paid", "processing", "shipped", "delivered"];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  pending:    { color: "#888",    bg: "rgba(255,255,255,0.04)", label: "PENDING" },
  paid:       { color: "#27ae60", bg: "rgba(39,174,96,0.08)",   label: "PAID" },
  processing: { color: "#f39c12", bg: "rgba(243,156,18,0.08)",  label: "PROCESSING" },
  shipped:    { color: "#3498db", bg: "rgba(52,152,219,0.08)",  label: "SHIPPED" },
  delivered:  { color: "#27ae60", bg: "rgba(39,174,96,0.08)",   label: "DELIVERED" },
  cancelled:  { color: "#c0392b", bg: "rgba(192,57,43,0.08)",   label: "CANCELLED" },
  refunded:   { color: "#888",    bg: "rgba(255,255,255,0.04)", label: "REFUNDED" },
};

type OrderItem = { name: string; qty: number; price: number; slug?: string; imageUrl?: string };
type Address = { name?: string; line1?: string; line2?: string; city?: string; state?: string; pincode?: string; phone?: string };
type Order = {
  _id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: string;
  orderType: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: Address;
  createdAt: string;
  notes?: string;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const order: Order | null = await sanity.fetch(
    `*[_type == "userOrder" && _id == $id && clerkUserId == $uid][0]`,
    { id, uid: userId }
  );

  if (!order) notFound();

  const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
  const stepIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div>
      {/* Back */}
      <Link href="/account/orders" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-mono)", fontSize: 9,
        letterSpacing: "0.15em", color: "#444",
        textDecoration: "none", textTransform: "uppercase",
        marginBottom: 32,
      }}
      >
        ← ORDERS
      </Link>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: 16,
        flexWrap: "wrap", marginBottom: 36,
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            letterSpacing: "0.22em", color: "#c0392b",
            textTransform: "uppercase", marginBottom: 8,
          }}>
            // ORDER DETAIL
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            letterSpacing: "0.04em", color: "#fff",
            lineHeight: 0.95, margin: "0 0 8px",
          }}>
            {order.razorpayOrderId}
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 13,
            color: "#444", margin: 0,
          }}>
            {date}
          </p>
        </div>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          letterSpacing: "0.14em", color: st.color,
          background: st.bg, padding: "6px 14px",
          borderRadius: 6, textTransform: "uppercase",
          alignSelf: "flex-start",
        }}>
          {st.label}
        </span>
      </div>

      {/* Progress tracker — only for non-cancelled orders */}
      {!isCancelled && (
        <div style={{
          padding: "20px 24px",
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 8,
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const current = i === stepIndex;
              return (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STEPS.length - 1 ? 1 : "none" }}>
                  <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 6,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: done ? "#c0392b" : "#1a1a1a",
                      border: `2px solid ${current ? "#c0392b" : done ? "#c0392b" : "#2a2a2a"}`,
                      transition: "background 0.3s",
                      flexShrink: 0,
                    }} />
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: 8,
                      color: done ? "#c0392b" : "#333",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: 0, whiteSpace: "nowrap",
                    }}>
                      {step}
                    </p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{
                      flex: 1, height: 1, margin: "-14px 6px 0",
                      background: i < stepIndex ? "#c0392b" : "#1a1a1a",
                      transition: "background 0.3s",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>

        {/* Items */}
        <div style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 8, overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              letterSpacing: "0.18em", color: "#c0392b",
              textTransform: "uppercase", margin: 0,
            }}>
              // ITEMS
            </p>
          </div>

          {order.items?.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 16,
                padding: "16px 20px",
                borderBottom: i < order.items.length - 1
                  ? "1px solid rgba(255,255,255,0.03)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                {/* Image or placeholder */}
                <div style={{
                  width: 44, height: 44, borderRadius: 6,
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.06)",
                  flexShrink: 0, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 11, color: "#2a2a2a",
                    }}>◈</span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-body)", fontWeight: 600,
                    fontSize: 13, color: "#ccc",
                    margin: "0 0 2px",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {item.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    color: "#333", letterSpacing: "0.08em",
                  }}>
                    QTY: {item.qty ?? 1}
                  </p>
                </div>
              </div>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: 16,
                color: "#fff", letterSpacing: "0.04em",
                flexShrink: 0,
              }}>
                ₹{((item.price ?? 0) * (item.qty ?? 1)).toLocaleString("en-IN")}
              </p>
            </div>
          ))}

          {/* Total row */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "#0d0d0d",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              letterSpacing: "0.14em", color: "#555",
              textTransform: "uppercase", margin: 0,
            }}>
              TOTAL
            </p>
            <p style={{
              fontFamily: "var(--font-display)", fontSize: 24,
              color: "#fff", letterSpacing: "0.04em", margin: 0,
            }}>
              ₹{order.totalAmount?.toLocaleString("en-IN") ?? "—"}
            </p>
          </div>
        </div>

        {/* Shipping address + payment IDs side by side on md+ */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>

          {/* Shipping */}
          {order.shippingAddress && (
            <div style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 8, padding: "20px",
            }}>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                letterSpacing: "0.18em", color: "#c0392b",
                textTransform: "uppercase", marginBottom: 14,
              }}>
                // SHIPPING TO
              </p>
              {[
                order.shippingAddress.name,
                order.shippingAddress.line1,
                order.shippingAddress.line2,
                [order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(", "),
                order.shippingAddress.pincode,
                order.shippingAddress.phone,
              ].filter(Boolean).map((line, i) => (
                <p key={i} style={{
                  fontFamily: "var(--font-body)", fontSize: 13,
                  color: "#666", margin: "0 0 3px", lineHeight: 1.5,
                }}>
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Payment info */}
          <div style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 8, padding: "20px",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              letterSpacing: "0.18em", color: "#c0392b",
              textTransform: "uppercase", marginBottom: 14,
            }}>
              // PAYMENT
            </p>
            {[
              { label: "Order ID",   value: order.razorpayOrderId },
              { label: "Payment ID", value: order.razorpayPaymentId ?? "—" },
              { label: "Method",     value: "Razorpay" },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 8,
                  letterSpacing: "0.12em", color: "#333",
                  textTransform: "uppercase", marginBottom: 2,
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  color: "#555", margin: 0,
                  wordBreak: "break-all",
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div style={{
            padding: "16px 20px",
            border: "1px solid rgba(255,255,255,0.04)",
            borderLeft: "2px solid rgba(192,57,43,0.4)",
            borderRadius: 8,
            background: "rgba(192,57,43,0.02)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              letterSpacing: "0.15em", color: "#c0392b",
              textTransform: "uppercase", marginBottom: 8,
            }}>
              // NOTES
            </p>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 13,
              color: "#555", margin: 0, lineHeight: 1.6,
            }}>
              {order.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
