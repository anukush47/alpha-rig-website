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

  const builds = await sanity.fetch(
    `*[_type == "savedBuild" && clerkUserId == $uid] | order(createdAt desc) {
      _id, name, components, totalBudget, notes, useCase, quoteRequested, createdAt
    }`,
    { uid: userId }
  );

  return NextResponse.json({ builds });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, components, totalBudget, notes, useCase } = await req.json();
  if (!name) return NextResponse.json({ error: "Build name required" }, { status: 400 });

  const doc = await sanity.create({
    _type: "savedBuild",
    clerkUserId: userId,
    name, components: components ?? [], totalBudget: totalBudget ?? 0,
    notes, useCase, quoteRequested: false,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ build: doc }, { status: 201 });
}
