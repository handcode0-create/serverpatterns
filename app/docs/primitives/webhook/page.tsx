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
          createWebhookHandler()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Gérez, validez et traitez les webhooks entrants (Stripe, Lemon Squeezy, GitHub...) de façon robuste, sécurisée et compatible avec le Edge runtime de Next.js.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite-signature">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Webhook size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Sécurisation et Extraction du Raw Body</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          La validation de signature cryptographique (HMAC-SHA256) requiert d&apos;accéder au corps <strong>brut (raw text/buffer)</strong> exact de la requête reçue. <code className="font-mono text-[#FF6A00]">createWebhookHandler</code> se charge d&apos;extraire correctement ce buffer de façon asynchrone, de récupérer l&apos;en-tête de signature spécifié, d&apos;exécuter votre méthode de validation, et de parser le JSON si la vérification réussit.
        </p>
      </section>

      {/* Configuration Options */}
      <section className="space-y-4" id="configuration">
        <h2 className="font-display text-lg font-bold text-white">Options de Configuration</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le helper accepte un objet de configuration complet :
        </p>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-4 overflow-x-auto">
          <table className="min-w-full font-mono text-[11px] text-[#8E8E8A]">
            <thead>
              <tr className="border-b border-white/10 text-white">
                <th className="py-2 text-left">Option</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">signatureHeader</td>
                <td className="py-2 pr-4 text-[#FF6A00]">string</td>
                <td className="py-2">Nom de l&apos;en-tête (ex: <code className="text-white">stripe-signature</code>).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">secret</td>
                <td className="py-2 pr-4 text-[#FF6A00]">string | (fn)</td>
                <td className="py-2">Le secret, ou une fonction retournant le secret (synchrone/asynchrone).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">verify</td>
                <td className="py-2 pr-4 text-[#FF6A00]">(fn)</td>
                <td className="py-2">Logique de validation. Retourne un <code className="text-white">boolean</code> ou un <code className="text-white">Result</code>.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">handler</td>
                <td className="py-2 pr-4 text-[#FF6A00]">(fn)</td>
                <td className="py-2">Logique métier à exécuter après validation réussie.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">onError</td>
                <td className="py-2 pr-4 text-[#FF6A00]">(fn)</td>
                <td className="py-2">Optionnel : Intercepteur d&apos;erreurs personnalisé.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple de Webhook Stripe complet</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici comment configurer un Route Handler de Webhook Stripe résistant et entièrement typé à l&apos;aide du validateur natif Web Crypto :
        </p>
        <CodeBlock 
          code={`import { createWebhookHandler, verifyHmacSha256Signature } from '@/lib/serverpatterns/webhook';

// POST /api/webhooks/stripe
export const POST = createWebhookHandler({
  signatureHeader: 'stripe-signature',
  
  // Lecture dynamique du secret dans vos variables d'environnement
  secret: () => process.env.STRIPE_WEBHOOK_SECRET || '',

  // Fonction de vérification native (Web Crypto API) compatible Edge Runtime !
  verify: async (rawBody, signature, secret) => {
    // Dans Stripe, la signature est généralement au format "t=123,v1=signature_hash"
    // Cet exemple montre comment extraire et valider l'élément v1 si besoin,
    // ou vous pouvez utiliser verifyHmacSha256Signature directement
    const v1Signature = signature
      .split(',')
      .find((part) => part.startsWith('v1='))
      ?.substring(3);

    if (!v1Signature) return false;

    // Extrait le timestamp t pour prévenir les attaques par rejeu (replay attacks)
    const timestamp = signature
      .split(',')
      .find((part) => part.startsWith('t='))
      ?.substring(2);

    const payloadToVerify = \`\${timestamp}.\${rawBody}\`;

    return await verifyHmacSha256Signature(payloadToVerify, v1Signature, secret, 'hex');
  },

  // Votre logique métier une fois la signature validée
  handler: async ({ body, rawBody, req }) => {
    const eventType = body.type;

    switch (eventType) {
      case 'checkout.session.completed':
        const session = body.data.object;
        await db.subscriptions.activate(session.client_reference_id, session.id);
        break;
      // ... autres types d'événements
    }

    return {
      status: 200,
      body: { received: true }
    };
  },

  // Interception propre des échecs de validation ou erreurs internes
  onError: async (error) => {
    console.error('Erreur Webhook Stripe:', error.message);
    return {
      status: 400,
      body: { error: 'Échec du traitement du webhook' }
    };
  }
});`}
          title="src/app/api/webhooks/stripe/route.ts"
        />
      </section>

      <Callout title="Résilience sur Edge Runtime" type="info">
        La fonction <code className="font-mono text-xs text-white">verifyHmacSha256Signature</code> utilise l&apos;API standard <code className="font-mono text-xs text-white">crypto.subtle</code> (Web Crypto API) au lieu de dépendre du module Node <code className="font-mono text-xs text-white">crypto</code> natif. Cela la rend extrêmement rapide et compatible avec 100% des environnements modernes (Vercel Edge, Cloudflare Workers, etc.).
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
              withAuth() / createAuthWrapper()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
