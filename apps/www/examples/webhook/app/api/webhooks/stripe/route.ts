import { NextResponse } from "next/server";
import { verifyTimestampedHmacSignature } from "@serverpatterns/core";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();

  const verification = verifyTimestampedHmacSignature({
    rawBody,
    signatureHeader: request.headers.get("Stripe-Signature"),
    secret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    payloadSeparator: ".", // Stripe signe `${timestamp}.${corps}`
  });

  if (!verification.valid) {
    return NextResponse.json({ error: verification.reason }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as { type: string };
  if (event.type === "checkout.session.completed") {
    // Active l'abonnement…
  }

  return NextResponse.json({ received: true });
}
