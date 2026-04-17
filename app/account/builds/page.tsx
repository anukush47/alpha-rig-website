import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@sanity/client";
import Link from "next/link";
import type { Metadata } from "next";
import BuildActions from "./BuildActions";

export const metadata: Metadata = { title: "Build Vault | Alpha Rig" };

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface BuildComponent {
  part: string;
  name: string;
  brand?: string;
  price?: number;
}

interface SavedBuild {
  _id: string;
  name: string;
  components: BuildComponent[];
  totalBudget: number;
  notes?: string;
  useCase?: string;
  quoteRequested: boolean;
  createdAt: string;
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

const USE_CASE_LABELS: Record<string, string> = {
  gaming: "Gaming",
  workstation: "Workstation",
  streaming: "Streaming",
  general: "General Use",
};

export default async function BuildsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const builds: SavedBuild[] = await sanity.fetch(
    `*[_type == "savedBuild" && clerkUserId == $uid] | order(createdAt desc) {
      _id, name, components, totalBudget, notes, useCase, quoteRequested, createdAt
    }`,
    { uid: userId }
  );

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.22em",
            color: "#c0392b",
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            // BUILD VAULT
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 50px)",
            letterSpacing: "0.04em",
            color: "#fff",
            lineHeight: 0.95,
            margin: "0 0 8px",
          }}>
            SAVED BUILDS
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333", letterSpacing: "0.06em", margin: 0 }}>
            {builds.length} {builds.length === 1 ? "CONFIGURATION" : "CONFIGURATIONS"} SAVED
          </p>
        </div>

        <Link
          href="/build-with-us"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.06em",
            color: "#fff",
            background: "#c0392b",
            padding: "10px 20px",
            borderRadius: 7,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          + NEW BUILD
        </Link>
      </div>

      {builds.length === 0 ? (
        <div style={{
          padding: "72px 32px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 12,
          background: "rgba(10,10,10,0.6)",
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 36, color: "#1a1a1a", marginBottom: 20, lineHeight: 1 }}>
            ▣
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            color: "#fff",
            letterSpacing: "0.06em",
            margin: "0 0 10px",
          }}>
            NO BUILDS SAVED
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#444",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}>
            Use the PC builder to configure your ideal rig, then save it here for later or request a quote.
          </p>
          <Link
            href="/build-with-us"
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
            BUILD YOUR RIG
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {builds.map((build) => (
            <div
              key={build._id}
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {/* Build header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                flexWrap: "wrap",
                gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    color: "#c0392b",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}>▣</span>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      color: "#fff",
                      letterSpacing: "0.04em",
                      margin: "0 0 4px",
                      lineHeight: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {build.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      {build.useCase && (
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 8,
                          letterSpacing: "0.14em",
                          color: "#c0392b",
                          background: "rgba(192,57,43,0.08)",
                          border: "1px solid rgba(192,57,43,0.15)",
                          padding: "2px 8px",
                          borderRadius: 3,
                        }}>
                          {USE_CASE_LABELS[build.useCase] ?? build.useCase}
                        </span>
                      )}
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#2a2a2a", letterSpacing: "0.1em" }}>
                        {fmtDate(build.createdAt)}
                      </span>
                      {build.quoteRequested && (
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 8,
                          letterSpacing: "0.14em",
                          color: "#f59e0b",
                          background: "rgba(245,158,11,0.07)",
                          border: "1px solid rgba(245,158,11,0.15)",
                          padding: "2px 8px",
                          borderRadius: 3,
                        }}>
                          QUOTE REQUESTED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  {build.totalBudget > 0 && (
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      color: "#fff",
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                    }}>
                      {fmtPrice(build.totalBudget)}
                    </span>
                  )}
                  <BuildActions buildId={build._id} quoteRequested={build.quoteRequested} buildName={build.name} />
                </div>
              </div>

              {/* Components list */}
              {build.components && build.components.length > 0 && (
                <div style={{ padding: "16px 24px" }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 8,
                  }}>
                    {build.components.map((comp, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "10px 12px",
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: 6,
                          border: "1px solid rgba(255,255,255,0.03)",
                        }}
                      >
                        <p style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 8,
                          letterSpacing: "0.14em",
                          color: "#333",
                          textTransform: "uppercase",
                          margin: "0 0 4px",
                        }}>
                          {comp.part}
                        </p>
                        <p style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          fontSize: 12,
                          color: "#ccc",
                          margin: 0,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {comp.brand ? `${comp.brand} ` : ""}{comp.name}
                        </p>
                        {comp.price && (
                          <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            color: "#444",
                            margin: "3px 0 0",
                            letterSpacing: "0.04em",
                          }}>
                            {fmtPrice(comp.price)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {build.notes && (
                    <div style={{
                      marginTop: 14,
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.015)",
                      borderRadius: 6,
                      borderLeft: "2px solid rgba(192,57,43,0.3)",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "#444",
                        margin: 0,
                        lineHeight: 1.6,
                        fontStyle: "italic",
                      }}>
                        {build.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
