'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Webhook, ShieldAlert } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveWebhookPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Signatures Webhook : verifyHmacSignature
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Validez les signatures cryptographiques de vos webhooks entrants (Stripe, Lemon Squeezy, GitHub...) de façon robuste, sécurisée et résistante aux attaques par rejeu.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite-signature">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Webhook size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Sécurisation cryptographique</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          La validation de signatures HMAC-SHA256 requiert d&apos;accéder au corps de texte brut (<code className="font-mono text-xs text-white">rawBody</code>) exact de la requête entrante afin d&apos;éviter les altérations lors de la sérialisation JSON.
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le framework ServerPatterns fournit deux primitives de bas niveau dans <code className="font-mono text-xs text-white">@serverpatterns/core</code> pour valider ces signatures sans boilerplate complexe.
        </p>
      </section>

      {/* Functions Signatures */}
      <section className="space-y-4 pt-4" id="signatures">
        <h2 className="font-display text-lg font-bold text-white">Signatures des Primitives</h2>
        <CodeBlock 
          code={`export interface VerificationResult {
  valid: boolean;
  reason?: string;
}

// Vérification HMAC-SHA256 générique, bas niveau.
export function verifyHmacSignature(options: {
  rawBody: string;
  signatureHeader: string | null;
  secret: string;
  extractSignature?: (header: string) => string;
  buildSignedMessage?: (rawBody: string, header: string) => string;
}): VerificationResult;

// Vérification format "t=<timestamp>,v1=<signature>" (Wave, Stripe...), avec protection anti-rejeu.
export function verifyTimestampedHmacSignature(options: {
  rawBody: string;
  signatureHeader: string | null;
  secret: string;
  toleranceSeconds?: number; // défaut: 300
  timestampKey?: string; // défaut: "t"
  signatureKey?: string; // défaut: "v1"
}): VerificationResult;`}
          title="@serverpatterns/core"
        />
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple de Webhook Stripe complet</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici comment sécuriser un Route Handler Next.js recevant des webhooks Stripe à l&apos;aide de la primitive de signature horodatée :
        </p>
        <CodeBlock 
          code={`import { NextRequest, NextResponse } from "next/server";
import { verifyTimestampedHmacSignature } from "@serverpatterns/core";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("stripe-signature");
  
  const verification = verifyTimestampedHmacSignature({
    rawBody,
    signatureHeader,
    secret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    toleranceSeconds: 300, // 5 minutes de tolérance d'horodatage
  });

  if (!verification.valid) {
    return NextResponse.json(
      { success: false, error: verification.reason ?? "Invalid signature" },
      { status: 400 }
    );
  }

  // Signature valide, traitement du payload
  const event = JSON.parse(rawBody);
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // ... Logique métier (activation d'abonnement, etc.)
  }

  return NextResponse.json({ success: true, received: true });
}`}
          title="src/app/api/webhooks/stripe/route.ts"
        />
      </section>

      <Callout title="Résilience sur Edge Runtime" type="info">
        Ces validateurs cryptographiques sont compatibles avec 100% des environnements modernes (dont le Edge Runtime de Next.js, Vercel Edge, Cloudflare Workers, etc.) car ils reposent sur l&apos;API cryptographique standard Web Crypto de l&apos;environnement d&apos;exécution.
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/server-action"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              withServerAction()
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/auth"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              withAuth()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
