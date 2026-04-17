import { NextRequest, NextResponse } from "next/server";
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

  const profile = await sanity.fetch(
    `*[_type == "userProfile" && clerkUserId == $uid][0]{
      handle, bio, totalPoints, createdAt
    }`,
    { uid: userId }
  );

  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { handle, bio } = body;

  // Find existing profile doc
  const existing = await sanity.fetch<{ _id: string } | null>(
    `*[_type == "userProfile" && clerkUserId == $uid][0]{ _id }`,
    { uid: userId }
  );

  if (existing?._id) {
    // Update
    const updated = await sanity.patch(existing._id).set({ handle, bio }).commit();
    return NextResponse.json({ profile: updated });
  } else {
    // Create if somehow doesn't exist yet
    const created = await sanity.create({
      _type: "userProfile",
      clerkUserId: userId,
      handle,
      bio,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ profile: created }, { status: 201 });
  }
}
