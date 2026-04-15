import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: 29900, // ₹299 in paise
      currency: "INR",
      receipt: `counseling_${Date.now()}`,
      notes: {
        type: "counseling",
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: 299,
      currency: "INR",
    });
  } catch (err) {
    console.error("[Counseling Order]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
