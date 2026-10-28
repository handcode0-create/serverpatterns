'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveServerActionPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          withServerAction()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Sécurisez vos Server Actions Next.js contre les injections et simplifiez la gestion du cycle de vie des erreurs côté client avec Zod.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securisation">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Zap size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Sécurisez vos Server Actions</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Les Server Actions de Next.js facilitent grandement le déclenchement de logique serveur directement depuis le code client. Toutefois, sous le capot, elles restent de simples endpoints HTTP POST déguisés, exposés à l&apos;exécution. Il est donc impératif d&apos;effectuer des contrôles stricts de structure et d&apos;autorisation.
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le wrapper <code className="font-mono text-[#FF6A00]">withServerAction</code> intercepte les paramètres de votre action, effectue une validation de schéma stricte via Zod (<code className="font-mono text-xs text-white">inputSchema</code>), et normalise le retour sous forme de <code className="font-mono text-xs text-white">Result&lt;T, ServerPatternsError&gt;</code> pour le client.
        </p>
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple d&apos;action de base de données</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Déclarez une action sécurisée sous le dossier recommandé <code className="font-mono text-xs text-white">lib/actions/</code> :
        </p>
        <CodeBlock 
          code={`"use server";

import { withServerAction } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import { z } from "zod";

const updateUsernameSchema = z.object({
  userId: z.string(),
  newUsername: z.string().min(3).max(20),
});

export const updateUsername = withServerAction({
  inputSchema: updateUsernameSchema,
  action: async (input) => {
    // input est automatiquement validé et typé !
    try {
      const success = await db.users.updateName(input.userId, input.newUsername);
      if (!success) {
        return err(
          new ServerPatternsError("NOT_FOUND", "Impossible de mettre à jour le profil")
        );
      }
      return ok({ updated: true, newUsername: input.newUsername });
    } catch (cause) {
      return err(
        new ServerPatternsError("SERVER_ERROR", "Une erreur interne est survenue", { cause })
      );
    }
  },
});`}
          title="lib/actions/user.ts"
        />
      </section>

      <Callout title="Chemin de fichier standardisé" type="recommendation">
        Pour une lisibilité accrue par les agents IA et une séparation nette des responsabilités, placez systématiquement vos Server Actions dans <code className="font-mono text-xs text-white">lib/actions/</code> plutôt que dans le dossier d&apos;UI <code className="font-mono text-xs text-white">app/</code>.
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/get-post-handler"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              create[Method]Handler
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/webhook"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Signature Webhook HMAC
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
