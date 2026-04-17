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

  const items = await sanity.fetch(
    `*[_type == "wishlistItem" && clerkUserId == $uid] | order(addedAt desc) {
      _id, productId, productName, productSlug, price, imageUrl, addedAt
    }`,
    { uid: userId }
  );

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, productName, productSlug, price, imageUrl } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  // Idempotent — don't duplicate
  const existing = await sanity.fetch(
    `*[_type == "wishlistItem" && clerkUserId == $uid && productId == $pid][0]._id`,
    { uid: userId, pid: productId }
  );
  if (existing) return NextResponse.json({ id: existing, alreadyExists: true });

  const doc = await sanity.create({
    _type: "wishlistItem",
    clerkUserId: userId,
    productId, productName, productSlug, price, imageUrl,
    addedAt: new Date().toISOString(),
  });

  return NextResponse.json({ id: doc._id }, { status: 201 });
}
