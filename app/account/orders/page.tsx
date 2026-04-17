import { auth } from "@clerk/nextjs/server";
import { createClient } from "@sanity/client";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders | Alpha Rig" };

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:     false,
  token:      process.env.SANITY_API_TOKEN,
});

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  pending:    { color: "#888",    bg: "rgba(255,255,255,0.04)", label: "PENDING" },
  paid:       { color: "#27ae60", bg: "rgba(39,174,96,0.08)",   label: "PAID" },
  processing: { color: "#f39c12", bg: "rgba(243,156,18,0.08)",  label: "PROCESSING" },
  shipped:    { color: "#3498db", bg: "rgba(52,152,219,0.08)",  label: "SHIPPED" },
  delivered:  { color: "#27ae60", bg: "rgba(39,174,96,0.08)",   label: "DELIVERED" },
  cancelled:  { color: "#c0392b", bg: "rgba(192,57,43,0.08)",   label: "CANCELLED" },
  refunded:   { color: "#888",    bg: "rgba(255,255,255,0.04)", label: "REFUNDED" },
};

type OrderItem = { name: string; qty: number; price: number; imageUrl?: string };
type Order = {
  _id: string;
  razorpayOrderId: string;
  status: string;
  orderType: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
};

export default async function OrdersPage() {
  const { userId } = await auth();

  const orders: Order[] = await sanity.fetch(
    `*[_type == "userOrder" && clerkUserId == $uid] | order(createdAt desc) {
      _id, razorpayOrderId, status, orderType, items, totalAmount, createdAt
    }`,
    { uid: userId }
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          letterSpacing: "0.22em", color: "#c0392b",
          textTransform: "uppercase", marginBottom: 10,
        }}>
          // ORDERS
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "0.04em", color: "#fff",
          lineHeight: 0.95, margin: 0,
        }}>
          ORDER HISTORY
        </h1>
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div style={{
          padding: "56px 32px",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 28,
            color: "#1a1a1a", marginBottom: 16,
          }}>
            ◈
          </p>
          <p style={{
            fontFamily: "var(--font-display)", fontSize: 24,
            color: "#333", letterSpacing: "0.04em", marginBottom: 10,
          }}>
            NO ORDERS YET
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 14,
            color: "#333", marginBottom: 28,
          }}>
            Your purchase history will appear here once you place an order.
          </p>
          <Link href="/store" style={{
            fontFamily: "var(--font-body)", fontWeight: 700,
            fontSize: 13, letterSpacing: "0.06em",
            color: "#fff", background: "#c0392b",
            padding: "12px 28px", borderRadius: 8,
            textDecoration: "none",
          }}>
            VISIT STORE
          </Link>
        </div>
      )}

      {/* Order list */}
      {orders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {orders.map((order) => {
            const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
            const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            });
            const itemCount = order.items?.reduce((s, i) => s + (i.qty ?? 1), 0) ?? 0;

            return (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "20px 24px",
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 8,
                  textDecoration: "none",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
              >
                {/* Left: order info */}
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    letterSpacing: "0.12em", color: "#333",
                    textTransform: "uppercase", marginBottom: 4,
                  }}>
                    {order.razorpayOrderId}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontWeight: 600,
                    fontSize: 14, color: "#ccc", margin: "0 0 3px",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {order.items?.[0]?.name ?? "Order"}
                    {itemCount > 1 ? ` +${itemCount - 1} more` : ""}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    color: "#333", letterSpacing: "0.08em",
                  }}>
                    {date}
                  </p>
                </div>

                {/* Right: amount + status */}
                <div style={{
                  display: "flex", alignItems: "center",
                  gap: 16, flexShrink: 0,
                }}>
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: 20,
                    color: "#fff", letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}>
                    ₹{order.totalAmount?.toLocaleString("en-IN") ?? "—"}
                  </p>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    letterSpacing: "0.12em", color: st.color,
                    background: st.bg, padding: "4px 10px",
                    borderRadius: 4, textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>
                    {st.label}
                  </span>
                  <span style={{ color: "#333", fontSize: 14 }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
