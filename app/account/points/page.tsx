import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@sanity/client";
import type { Metadata } from "next";
import { getForgeLevel, pointsToNext } from "@/lib/forge";
import RigIdentityCard from "@/components/ui/RigIdentityCard";

export const metadata: Metadata = { title: "Alpha Points | Alpha Rig" };

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface PointsEntry {
  _id: string;
  event: string;
  points: number;
  description?: string;
  referenceId?: string;
  createdAt: string;
}

const EVENT_LABELS: Record<string, string> = {
  purchase:            "Purchase",
  event_registration:  "Event Registration",
  blog_read:           "Blog Read",
  referral:            "Referral Bonus",
  counseling:          "PC Counseling Session",
  newsletter:          "Newsletter Signup",
  first_purchase:      "First Purchase Bonus",
  profile_complete:    "Profile Completed",
};

const EVENT_ICONS: Record<string, string> = {
  purchase:            "◈",
  event_registration:  "◎",
  blog_read:           "◉",
  referral:            "✦",
  counseling:          "▣",
  newsletter:          "◇",
  first_purchase:      "⬡",
  profile_complete:    "◉",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const EARN_TABLE = [
  { action: "Purchase",                   pts: "1 pt / ₹10 spent" },
  { action: "Event Registration",         pts: "50 pts" },
  { action: "PC Counseling Session",      pts: "100 pts" },
  { action: "Newsletter Signup",          pts: "20 pts" },
  { action: "Blog Article Read",          pts: "2 pts (first read)" },
  { action: "Referral (new user signs up)", pts: "200 pts" },
  { action: "First Purchase Bonus",       pts: "+100 pts" },
  { action: "Profile Completed",          pts: "25 pts" },
];

export default async function PointsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  const [ledger, profile] = await Promise.all([
    sanity.fetch<PointsEntry[]>(
      `*[_type == "alphaPoints" && clerkUserId == $uid] | order(createdAt desc) [0..49] {
        _id, event, points, description, referenceId, createdAt
      }`,
      { uid: userId }
    ),
    sanity.fetch<{ totalPoints?: number; handle?: string }>(
      `*[_type == "userProfile" && clerkUserId == $uid][0]{ totalPoints, handle }`,
      { uid: userId }
    ),
  ]);

  const totalPoints = profile?.totalPoints ?? 0;
  const level = getForgeLevel(totalPoints);
  const toNext = pointsToNext(totalPoints);
  const progressPct = Math.round(level.progress * 100);

  const displayName = profile?.handle ?? user?.firstName ?? "ALPHA";
  const avatarUrl = user?.imageUrl;

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
          // ALPHA POINTS
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 50px)",
          letterSpacing: "0.04em",
          color: "#fff",
          lineHeight: 0.95,
          margin: 0,
        }}>
          FORGE LEVEL
        </h1>
      </div>

      {/* ── Level card ── */}
      <div style={{
        padding: "32px 36px",
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 12,
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* BG glow */}
        <div aria-hidden style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${level.color}14 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24, position: "relative" }}>
          <div>
            {/* Level badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                letterSpacing: "0.2em",
                color: level.color,
                background: `${level.color}14`,
                border: `1px solid ${level.color}30`,
                padding: "5px 14px",
                borderRadius: 4,
                lineHeight: 1.3,
              }}>
                {level.label}
              </span>
            </div>

            {/* Points total */}
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 8vw, 80px)",
              color: "#fff",
              letterSpacing: "0.04em",
              lineHeight: 0.9,
              marginBottom: 8,
            }}>
              {totalPoints.toLocaleString("en-IN")}
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "#444",
                letterSpacing: "0.1em",
                marginLeft: 10,
                verticalAlign: "middle",
              }}>
                PTS
              </span>
            </div>

            {/* To next tier */}
            {toNext !== null ? (
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "#444",
                margin: "0 0 20px",
              }}>
                {toNext.toLocaleString("en-IN")} points to{" "}
                <span style={{ color: level.color }}>
                  {["RECRUIT","SOLDIER","VETERAN","LEGEND","ALPHA"][
                    ["RECRUIT","SOLDIER","VETERAN","LEGEND","ALPHA"].indexOf(level.label) + 1
                  ]}
                </span>
              </p>
            ) : (
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#c0392b", margin: "0 0 20px" }}>
                Maximum rank achieved ✦
              </p>
            )}

            {/* Progress bar */}
            <div style={{ width: "min(360px, 100%)" }}>
              <div style={{
                height: 4,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 4,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: level.color,
                  borderRadius: 4,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#2a2a2a", letterSpacing: "0.1em" }}>
                  {level.prevThreshold.toLocaleString("en-IN")} PTS
                </span>
                {level.nextThreshold && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#2a2a2a", letterSpacing: "0.1em" }}>
                    {level.nextThreshold.toLocaleString("en-IN")} PTS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tier list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(["RECRUIT","SOLDIER","VETERAN","LEGEND","ALPHA"] as const).map((tier, i) => {
              const colors = ["#888","#3b82f6","#9b59b6","#f59e0b","#c0392b"];
              const thresholds = ["0","500","1,500","5,000","10,000+"];
              const active = tier === level.label;
              return (
                <div key={tier} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: active ? colors[i] : "#1a1a1a",
                    border: `1px solid ${active ? colors[i] : "#222"}`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: active ? colors[i] : "#2a2a2a",
                    lineHeight: 1,
                  }}>
                    {tier}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#1e1e1e", letterSpacing: "0.05em" }}>
                    {thresholds[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Rig Identity Card ── */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "#444",
          textTransform: "uppercase",
          marginBottom: 18,
        }}>
          // RIG IDENTITY CARD
        </p>
        <RigIdentityCard
          displayName={displayName}
          level={level.label}
          levelColor={level.color}
          totalPoints={totalPoints}
          avatarUrl={avatarUrl}
          ledgerCount={ledger.length}
        />
      </div>

      {/* ── How to earn ── */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "#444",
          textTransform: "uppercase",
          marginBottom: 18,
        }}>
          // HOW TO EARN
        </p>
        <div style={{
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          {EARN_TABLE.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: i < EARN_TABLE.length - 1 ? "1px solid rgba(255,255,255,0.03)" : undefined,
                background: i % 2 === 0 ? "#0a0a0a" : "#080808",
              }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", fontWeight: 500 }}>
                {row.action}
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "#c0392b",
              }}>
                {row.pts}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Points ledger ── */}
      <div>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "#444",
          textTransform: "uppercase",
          marginBottom: 18,
        }}>
          // RECENT ACTIVITY
        </p>

        {ledger.length === 0 ? (
          <div style={{
            padding: "48px 24px",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: 10,
            background: "#0a0a0a",
          }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#333", margin: 0 }}>
              No points activity yet. Start earning by making a purchase or registering for an event.
            </p>
          </div>
        ) : (
          <div style={{
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            {ledger.map((entry, i) => (
              <div
                key={entry._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 20px",
                  borderBottom: i < ledger.length - 1 ? "1px solid rgba(255,255,255,0.03)" : undefined,
                  background: i % 2 === 0 ? "#0a0a0a" : "#080808",
                }}
              >
                {/* Icon */}
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "#c0392b",
                  lineHeight: 1,
                  flexShrink: 0,
                  width: 20,
                  textAlign: "center",
                }}>
                  {EVENT_ICONS[entry.event] ?? "✦"}
                </span>

                {/* Label + desc */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#ccc",
                    margin: "0 0 2px",
                  }}>
                    {EVENT_LABELS[entry.event] ?? entry.event}
                  </p>
                  {entry.description && (
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "#333",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {entry.description}
                    </p>
                  )}
                </div>

                {/* Date */}
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "#2a2a2a",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}>
                  {fmtDate(entry.createdAt)}
                </span>

                {/* Points */}
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  color: entry.points >= 0 ? "#4ade80" : "#ef4444",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: 52,
                  textAlign: "right",
                }}>
                  {entry.points >= 0 ? "+" : ""}{entry.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
