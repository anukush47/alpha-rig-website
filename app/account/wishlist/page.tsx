import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@sanity/client";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import WishlistRemoveButton from "./WishlistRemoveButton";

export const metadata: Metadata = { title: "Wishlist | Alpha Rig" };

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface WishlistItem {
  _id: string;
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function WishlistPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const items: WishlistItem[] = await sanity.fetch(
    `*[_type == "wishlistItem" && clerkUserId == $uid] | order(addedAt desc) {
      _id, productId, productName, productSlug, price, imageUrl, addedAt
    }`,
    { uid: userId }
  );

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "#c0392b",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          // WISHLIST
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 50px)",
          letterSpacing: "0.04em",
          color: "#fff",
          lineHeight: 0.95,
          margin: "0 0 8px",
        }}>
          SAVED ITEMS
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333", letterSpacing: "0.06em", margin: 0 }}>
          {items.length} {items.length === 1 ? "PRODUCT" : "PRODUCTS"} SAVED
        </p>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div style={{
          padding: "72px 32px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 12,
          background: "rgba(10,10,10,0.6)",
        }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 36,
            color: "#1a1a1a",
            marginBottom: 20,
            lineHeight: 1,
          }}>
            ◇
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            color: "#fff",
            letterSpacing: "0.06em",
            margin: "0 0 10px",
          }}>
            WISHLIST IS EMPTY
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#444",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}>
            Browse the store and tap the heart icon on any product to save it here.
          </p>
          <Link
            href="/store"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.06em",
              color: "#fff",
              background: "#c0392b",
              padding: "12px 28px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            VISIT STORE
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.04)",
        }}>
          {items.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#0a0a0a",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image */}
              <Link href={`/store/${item.productSlug}`} style={{ display: "block", textDecoration: "none" }}>
                <div style={{
                  position: "relative",
                  height: 180,
                  background: "linear-gradient(160deg, #141414 0%, #0d0d0d 100%)",
                  overflow: "hidden",
                }}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "2px", color: "#1a1a1a" }}>
                        NO IMAGE
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div style={{ padding: "18px 18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  href={`/store/${item.productSlug}`}
                  style={{ textDecoration: "none" }}
                >
                  <h3 style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#fff",
                    lineHeight: 1.3,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {item.productName}
                  </h3>
                </Link>

                <span style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#fff",
                  lineHeight: 1,
                }}>
                  {fmtPrice(item.price)}
                </span>

                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: "#2a2a2a",
                }}>
                  SAVED {fmtDate(item.addedAt)}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <Link
                    href={`/store/${item.productSlug}`}
                    style={{
                      flex: 1,
                      display: "block",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.05em",
                      color: "#fff",
                      background: "#c0392b",
                      padding: "9px 0",
                      borderRadius: 7,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    VIEW PRODUCT
                  </Link>
                  <WishlistRemoveButton productId={item.productId} wishlistId={item._id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
