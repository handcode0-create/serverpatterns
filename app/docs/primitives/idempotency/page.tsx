'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveIdempotencyPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          withIdempotency()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Garantissez qu&apos;une opération sensible (comme un paiement, une création de compte ou un envoi d&apos;email) ne s&apos;exécute qu&apos;une seule fois, même en cas d&apos;appels réseau répétés ou de double-clic de l&apos;utilisateur.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite-idempotency">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <ShieldCheck size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Idempotence de Niveau API</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          L&apos;idempotence est cruciale pour la fiabilité des systèmes de production. Le wrapper <code className="font-mono text-[#FF6A00]">withIdempotency</code> intercepte la requête, vérifie la présence d&apos;une clé d&apos;idempotence (généralement passée dans l&apos;en-tête HTTP <code className="font-mono text-white text-[10px]">Idempotency-Key</code> ou dans les arguments de votre Server Action), gère un mécanisme de verrou temporaire (status <code className="font-mono text-white text-[10px]">pending</code>), exécute l&apos;action réelle, et sauvegarde de manière atomique la réponse pour la renvoyer instantanément lors des appels futurs identiques.
        </p>
      </section>

      {/* Configuration Options */}
      <section className="space-y-4" id="configuration">
        <h2 className="font-display text-lg font-bold text-white">Options de Configuration</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le wrapper accepte un objet de configuration pour adapter le stockage ou la résolution de clés :
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
                <td className="py-2 pr-4 text-white font-semibold">store</td>
                <td className="py-2 pr-4 text-[#FF6A00]">IdempotencyStore</td>
                <td className="py-2">Le pilote de stockage à utiliser. Par défaut, utilise un cache In-Memory. En production, vous pouvez injecter un adaptateur Redis ou Postgres.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">ttlSeconds</td>
                <td className="py-2 pr-4 text-[#FF6A00]">number</td>
                <td className="py-2">Durée de vie maximale en secondes d&apos;une clé d&apos;idempotence avant son expiration (Défaut : <code className="text-white">86400</code>, soit 24 heures).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">getKey</td>
                <td className="py-2 pr-4 text-[#FF6A00]">(fn)</td>
                <td className="py-2">Fonction optionnelle pour extraire de manière sur mesure la clé depuis les paramètres d&apos;entrée.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">pendingMessage</td>
                <td className="py-2 pr-4 text-[#FF6A00]">string</td>
                <td className="py-2">Le message d&apos;erreur renvoyé si une requête strictement identique est déjà en cours d&apos;exécution simultanée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple : Sécuriser un Paiement Stripe (Server Action)</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici comment encapsuler une action sensible de traitement de paiement avec gestion d&apos;idempotence :
        </p>
        <CodeBlock 
          code={`'use server';

import { withIdempotency } from '@/lib/serverpatterns/idempotency';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

interface CheckoutInput {
  idempotencyKey: string;
  cartId: string;
  amount: number;
}

// Action encapsulée garantissant l'exécution unique globale
export const processCheckout = withIdempotency(
  async (input: CheckoutInput) => {
    // 1. Charger le panier
    const cart = await db.cart.getById(input.cartId);
    if (!cart || cart.isProcessed) {
      throw new Error("Le panier est déjà traité ou invalide.");
    }

    // 2. Facturer via Stripe
    const charge = await stripe.charges.create({
      amount: input.amount,
      currency: 'eur',
      source: 'tok_visa',
      description: \`Commande pour le panier \${input.cartId}\`
    });

    // 3. Valider la commande en BDD
    await db.cart.update(input.cartId, { isProcessed: true, chargeId: charge.id });

    return {
      success: true,
      chargeId: charge.id,
      amount: input.amount
    };
  }
);`}
          title="src/app/actions/payments.ts"
        />
      </section>

      <Callout title="Résolution des conflits de concurrence" type="warning">
        Si deux requêtes identiques avec la même clé arrivent exactement en même temps, la seconde sera immédiatement rejetée avec une erreur <strong>&quot;Une requête identique est en cours de traitement.&quot;</strong> afin d&apos;éviter toute condition de concurrence ou double débit bancaire chez l&apos;utilisateur.
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/pagination"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              withPagination()
            </span>
          </div>
        </Link>

        <Link
          href="/docs/cli/init"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              serverpatterns init
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
