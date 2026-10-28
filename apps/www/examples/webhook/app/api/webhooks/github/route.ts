import { NextResponse } from "next/server";
import { verifyHmacSignature } from "@serverpatterns/core";

export const runtime = "nodejs";

// GitHub envoie "sha256=<signature hex>" dans X-Hub-Signature-256, sans horodatage.
export async function POST(request: Request) {
  const rawBody = await request.text();

  const verification = verifyHmacSignature({
    rawBody,
    signatureHeader: request.headers.get("X-Hub-Signature-256"),
    secret: process.env.GITHUB_WEBHOOK_SECRET ?? "",
    extractSignature: (header) => header.replace(/^sha256=/, ""),
  });

  if (!verification.valid) {
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  return NextResponse.json({ received: true });
}
