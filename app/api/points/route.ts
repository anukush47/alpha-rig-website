import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:     false,
  token:      process.env.SANITY_API_TOKEN,
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [ledger, profile] = await Promise.all([
    sanity.fetch(
      `*[_type == "alphaPoints" && clerkUserId == $uid] | order(createdAt desc) [0..49] {
        _id, event, points, description, referenceId, createdAt
      }`,
      { uid: userId }
    ),
    sanity.fetch(
      `*[_type == "userProfile" && clerkUserId == $uid][0]{ totalPoints }`,
      { uid: userId }
    ),
  ]);

  return NextResponse.json({
    totalPoints: profile?.totalPoints ?? 0,
    ledger,
  });
}
