import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:    false,
  token:     process.env.SANITY_API_TOKEN,
});

// GET /api/orders — returns all orders for the signed-in user
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await sanity.fetch(
    `*[_type == "userOrder" && clerkUserId == $uid] | order(createdAt desc) {
      _id,
      razorpayOrderId,
      razorpayPaymentId,
      status,
      orderType,
      items,
      totalAmount,
      shippingAddress,
      createdAt,
      notes
    }`,
    { uid: userId }
  );

  return NextResponse.json({ orders });
}

// POST /api/orders — create a new order record after successful Razorpay payment
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    razorpayOrderId,
    razorpayPaymentId,
    items,
    totalAmount,
    orderType = "product",
    shippingAddress,
    notes,
  } = body;

  if (!razorpayOrderId || !items?.length || !totalAmount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const doc = await sanity.create({
    _type:           "userOrder",
    clerkUserId:     userId,
    razorpayOrderId,
    razorpayPaymentId,
    status:          razorpayPaymentId ? "paid" : "pending",
    orderType,
    items,
    totalAmount,
    shippingAddress,
    notes,
    createdAt:       new Date().toISOString(),
  });

  return NextResponse.json({ order: doc }, { status: 201 });
}
