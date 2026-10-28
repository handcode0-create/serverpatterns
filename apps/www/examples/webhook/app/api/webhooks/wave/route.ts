import { NextResponse } from "next/server";
import { verifyTimestampedHmacSignature } from "@serverpatterns/core";

// La vérification utilise node:crypto : garde le runtime Node.js (le défaut de Next.js).
export const runtime = "nodejs";

export async function POST(request: Request) {
  // Corps BRUT : un JSON parsé puis re-sérialisé ne correspond plus à la signature.
  const rawBody = await request.text();

  const verification = verifyTimestampedHmacSignature({
    rawBody,
    signatureHeader: request.headers.get("Wave-Signature"),
    secret: process.env.WAVE_WEBHOOK_SECRET ?? "",
  });

  if (!verification.valid) {
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as { type: string; data: unknown };
  if (event.type === "checkout.session.completed") {
    // Marque la commande comme payée…
  }

  return NextResponse.json({ received: true });
}
