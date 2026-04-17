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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await params;

  const docId = await sanity.fetch(
    `*[_type == "wishlistItem" && clerkUserId == $uid && productId == $pid][0]._id`,
    { uid: userId, pid: productId }
  );

  if (!docId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await sanity.delete(docId);
  return NextResponse.json({ deleted: true });
}
