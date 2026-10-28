'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Terminal, Info, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';

export default function CliAddActionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          serverpatterns add action
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Génère une Server Action Next.js hautement sécurisée, validée par Zod et protégée par un contrôle d&apos;accès basé sur les rôles (RBAC) en une seule commande.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Syntax and Options */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white">Syntaxe de la commande</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Passez le nom de l&apos;action souhaitée en argument ou lancez simplement la commande pour utiliser l&apos;assistant interactif :
        </p>
        <PackageManagerTabs
          pnpm="pnpm dlx serverpatterns add action <nom-action>"
          npm="npx serverpatterns add action <nom-action>"
          yarn="yarn dlx serverpatterns add action <nom-action>"
          bun="bunx serverpatterns add action <nom-action>"
        />
      </div>

      {/* Interactive Prompts Step-by-Step */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Assistant interactif de génération</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le CLI intègre un générateur de schéma Zod dynamique pour structurer rapidement vos payloads d&apos;entrée :
        </p>

        <div className="bg-black/60 border border-white/5 rounded-xl p-6 font-mono text-xs space-y-4 text-[#8E8E8A]">
          <div className="text-white">
            <span className="text-[#FF6A00] font-bold">◆</span> <span className="font-bold">ServerPatterns — Add Action</span>
          </div>
          
          <div className="pl-4 border-l border-white/10 space-y-3">
            <div>
              <span className="text-green-400">?</span> <span className="text-white">Nom de l&apos;Action :</span>
              <div className="text-[#FF6A00] pl-4 mt-1">❯ update-inventory</div>
            </div>

            <div className="space-y-2 border-l-2 border-[#FF6A00]/20 pl-3">
              <div className="text-white/60">◇ Construction du schéma Zod (laisser vide pour terminer) :</div>
              <div>
                <span className="text-green-400">?</span> <span className="text-white">Nom du champ :</span> <span className="text-white font-bold">sku</span>
              </div>
              <div>
                <span className="text-green-400">?</span> <span className="text-white">Type de sku :</span> <span className="text-[#FF6A00]">string</span>
              </div>
              <div>
                <span className="text-green-400">?</span> <span className="text-white">Le champ sku est-il optionnel ?</span> <span className="text-white font-bold">Non</span>
              </div>
            </div>

            <div className="space-y-2 border-l-2 border-[#FF6A00]/20 pl-3 pt-1">
              <div>
                <span className="text-green-400">?</span> <span className="text-white">Nom du champ :</span> <span className="text-white font-bold">quantity</span>
              </div>
              <div>
                <span className="text-green-400">?</span> <span className="text-white">Type de quantity :</span> <span className="text-[#FF6A00]">number</span>
              </div>
              <div>
                <span className="text-green-400">?</span> <span className="text-white">Le champ quantity est-il optionnel ?</span> <span className="text-white font-bold">Non</span>
              </div>
            </div>

            <div className="space-y-1 border-l-2 border-[#FF6A00]/20 pl-3 pt-1">
              <div>
                <span className="text-green-400">?</span> <span className="text-white">Nom du champ :</span> <span className="text-white/40">&lt;laissé vide&gt;</span>
              </div>
              <div className="text-green-400 font-bold">✔ Schéma Zod configuré avec 2 champs !</div>
            </div>

            <div>
              <span className="text-green-400">?</span> <span className="text-white">Cette action doit-elle être restreinte à certains rôles (RBAC) ?</span>
              <div className="text-white pl-4 mt-1">❯ Oui</div>
            </div>

            <div>
              <span className="text-green-400">?</span> <span className="text-white">Saisir les rôles autorisés (séparés par une virgule) :</span>
              <div className="text-white pl-4 mt-1">❯ admin, stock_manager</div>
            </div>
          </div>

          <div className="text-green-400">
            <span>✔</span> Fichier généré avec succès !
          </div>
        </div>
      </div>

      {/* Generated File Structure */}
      <div className="space-y-6 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Fichier unique généré</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le CLI crée une Server Action unifiée sous <code className="font-mono text-xs text-white">lib/actions/update-inventory.ts</code> :
        </p>

        <CodeBlock
          code={`"use server";

import { z } from "zod";
import { withAuth, ok, err } from "@serverpatterns/next";
import { ServerPatternsError } from "@serverpatterns/core";
import { getSession } from "@/lib/auth/session"; // TODO: À implémenter

// Schéma d'entrée généré automatiquement par la boucle interactive
const inputSchema = z.object({
  sku: z.string(),
  quantity: z.number(),
});

export const updateInventory = withAuth({
  getSession,
  requiredRoles: ["admin", "stock_manager"],
  inputSchema,
  action: async (input, session) => {
    try {
      // TODO: Écrivez votre logique métier ici
      // input.sku et input.quantity sont typés et garantis valides !
      // session.userId et session.roles sont sécurisés et disponibles !
      
      return ok({
        success: true,
        sku: input.sku,
        updatedQuantity: input.quantity,
      });
    } catch (cause) {
      return err(
        new ServerPatternsError(
          "SERVER_ERROR", 
          "Échec de la mise à jour de l'inventaire", 
          { cause }
        )
      );
    }
  },
});`}
          title="lib/actions/update-inventory.ts"
        />

        <Callout type="info" title="Note d'ingénierie : L'adaptateur de session">
          L&apos;adaptateur de session <code className="font-mono text-xs text-white">getSession</code> n&apos;est pas fourni clé en main par ServerPatterns car il dépend de votre fournisseur d&apos;auth (NextAuth, Clerk, Kinde, JWT sur mesure). C&apos;est à vous d&apos;exposer une fonction respectant cette signature :
        </Callout>

        <CodeBlock
          code={`// lib/auth/session.ts
import { cookies } from "next/headers";

export async function getSession() {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return null;
  
  // Exemple de décodage d'un token JWT
  try {
    const payload = decodeJwt(token);
    return {
      userId: payload.sub,
      roles: payload.roles || [], // Tableau de rôles ex: ["admin", "stock_manager"]
    };
  } catch {
    return null;
  }
}`}
          title="lib/auth/session.ts"
        />
      </div>

      {/* AI Agent Advice */}
      <div className="bg-[#FF6A00]/5 border border-[#FF6A00]/10 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-white font-display font-semibold text-xs uppercase tracking-wider">
          <Cpu size={16} className="text-[#FF6A00]" />
          <span>Conseil IA d&apos;ingénierie</span>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          <strong>CONSEIL AGENT IA :</strong> Le wrapper <code className="font-mono text-xs text-white">withAuth</code> injecte automatiquement la session validée en second paramètre du handler. Ne refaites pas d&apos;appel à <code className="font-mono text-xs text-white">getSession()</code> ou de vérification manuelle de rôles à l&apos;intérieur du corps de l&apos;action. L&apos;exécution n&apos;atteint le code métier que si l&apos;utilisateur est authentifié et possède les rôles requis, réduisant considérablement la surface d&apos;erreur.
        </p>
      </div>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/cli/add-api"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              serverpatterns add api
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/result"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Result&lt;T, E&gt; : Monade
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
