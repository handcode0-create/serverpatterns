'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Terminal, Info, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';

export default function CliAddApiPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          serverpatterns add api
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Génère un client d&apos;API typé complet ainsi que ses Route Handlers Next.js associés avec validation Zod et support d&apos;authentification de bout en bout.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Syntax and Options */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white">Syntaxe de la commande</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Passez le nom de la ressource en argument ou lancez la commande directement pour démarrer l&apos;assistant interactif :
        </p>
        <PackageManagerTabs
          pnpm="pnpm dlx serverpatterns add api <nom-ressource>"
          npm="npx serverpatterns add api <nom-ressource>"
          yarn="yarn dlx serverpatterns add api <nom-ressource>"
          bun="bunx serverpatterns add api <nom-ressource>"
        />
      </div>

      {/* Interactive Prompts Step-by-Step */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Assistant interactif de génération</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le CLI vous guide étape par étape via des invites interactives claires :
        </p>

        <div className="bg-black/60 border border-white/5 rounded-xl p-6 font-mono text-xs space-y-4 text-[#8E8E8A]">
          <div className="text-white">
            <span className="text-[#FF6A00] font-bold">◆</span> <span className="font-bold">ServerPatterns — Add API</span>
          </div>
          
          <div className="pl-4 border-l border-white/10 space-y-3">
            <div>
              <span className="text-green-400">?</span> <span className="text-white">Nom de la ressource API :</span>
              <div className="text-[#FF6A00] pl-4 mt-1">❯ user</div>
            </div>

            <div>
              <span className="text-green-400">?</span> <span className="text-white">Sélection multiple des méthodes à générer (Espace pour cocher) :</span>
              <div className="text-white/40 pl-4 mt-1">
                <span>◼ Récupérer une ressource (GET /user/:id)</span> <br />
                <span>◼ Lister, paginée (GET /user)</span> <br />
                <span className="text-white/20">◻ Créer (POST /user)</span> <br />
                <span>◼ Mettre à jour partiellement (PATCH /user/:id)</span> <br />
                <span className="text-white/20">◻ Supprimer (DELETE /user/:id)</span>
              </div>
            </div>

            <div>
              <span className="text-green-400">?</span> <span className="text-white">Ce client a-t-il besoin d&apos;un token Bearer (JWT) dans ses headers ?</span>
              <div className="text-white pl-4 mt-1">❯ Oui</div>
            </div>

            <div>
              <span className="text-green-400">?</span> <span className="text-white">Source du token Bearer :</span>
              <div className="text-white/40 pl-4 mt-1">
                <span>❯ Cookie de session (le CLI demande le nom, ex: &quot;token&quot;)</span> <br />
                <span className="text-[#8E8E8A]/50">  Variable d&apos;environnement statique</span>
              </div>
            </div>
          </div>

          <div className="text-green-400">
            <span>✔</span> Fichiers générés avec succès !
          </div>
        </div>

        <Callout type="warning" title="Note d'ingénierie cruciale pour les agents IA">
          Si <code className="font-mono text-xs text-white">Récupérer (GET /resource/:id)</code> <strong>ET</strong> <code className="font-mono text-xs text-white">Lister, paginée (GET /resource)</code> sont cochés en même temps, seul <code className="font-mono text-xs text-white">Lister</code> génère l&apos;export GET dans <code className="font-mono text-xs text-white">route.ts</code>. Le GET unitaire n&apos;est pas supporté en export parallèle si les deux se trouvent dans la même route dynamique.
        </Callout>
      </div>

      {/* Generated Files Structure */}
      <div className="space-y-6 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Fichiers générés</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le CLI crée deux fichiers stratégiques qui s&apos;articulent l&apos;un avec l&apos;autre :
        </p>

        {/* File 1: API Client */}
        <div className="space-y-3">
          <h3 className="font-mono text-sm text-white font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
            1. Client API : lib/api/user.ts
          </h3>
          <p className="text-xs text-[#8E8E8A] leading-relaxed">
            Contient l&apos;initialisation du client typé de référence, gère l&apos;auth automatique par cookie et exporte les fonctions d&apos;appel réseau typées :
          </p>
          <CodeBlock
            code={`import { createApiClient, type PaginationParams, type PaginatedResult } from "@serverpatterns/core";
import { cookies } from "next/headers";

export const userClient = createApiClient({
  baseUrl: process.env.API_BASE_URL ?? "https://api.example.com",
  defaultHeaders: async () => {
    // Lecture automatique sécurisée du cookie configuré lors du prompt
    const token = (await cookies()).get("token")?.value;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = \`Bearer \${token}\`;
    return headers;
  },
});

export interface User {
  id: string;
  name: string;
  email: string;
}

// Généré suite au choix "Récupérer"
export async function getUser(id: string) {
  return userClient.get<User>(\`/user/\${id}\`);
}

// Généré suite au choix "Lister, paginée"
export async function listUsers(params: PaginationParams) {
  return userClient.get<PaginatedResult<User>>("/user", {
    query: { page: params.page, pageSize: params.pageSize },
  });
}

// Généré suite au choix "Mettre à jour partiellement"
export async function updateUser(id: string, input: Partial<User>) {
  return userClient.patch<User>(\`/user/\${id}\`, input);
}`}
            title="lib/api/user.ts"
          />
        </div>

        {/* File 2: Route Handler */}
        <div className="space-y-3 pt-4">
          <h3 className="font-mono text-sm text-white font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
            2. Route Handler Next.js : app/api/user/route.ts
          </h3>
          <p className="text-xs text-[#8E8E8A] leading-relaxed">
            Fait office de proxy sécurisé, validant les entrées à la volée grâce à des schémas Zod et exécutant les wrappers ServerPatterns :
          </p>
          <CodeBlock
            code={`import { z } from "zod";
import { createGetHandler, createPatchHandler } from "@serverpatterns/next";
import { ok, err, ServerPatternsError, parsePaginationParams, paginateInMemory } from "@serverpatterns/core";
import { userClient, type User } from "@/lib/api/user";

const paginationQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

// GET Handler enveloppant l'appel à listUsers avec pagination
export const GET = createGetHandler({
  querySchema: paginationQuerySchema,
  handler: async (query) => {
    const params = parsePaginationParams(query);
    // TODO: Connectez ici votre ORM, base de données ou client externe
    const allItems: User[] = [];
    return ok(paginateInMemory(allItems, params));
  },
});

const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

// PATCH Handler enveloppant l'appel à updateUser
export const PATCH = createPatchHandler({
  bodySchema: updateSchema,
  handler: async (body) => {
    // TODO: Implémentez la logique de mise à jour réelle
    return ok(body as unknown as User);
  },
});`}
            title="app/api/user/route.ts"
          />
        </div>
      </div>

      {/* AI Agent Advice */}
      <div className="bg-[#FF6A00]/5 border border-[#FF6A00]/10 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-white font-display font-semibold text-xs uppercase tracking-wider">
          <Cpu size={16} className="text-[#FF6A00]" />
          <span>Conseil IA d&apos;ingénierie</span>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          <strong>CONSEIL AGENT IA :</strong> Pour modifier cette API, n&apos;éditez pas directement <code className="font-mono text-xs text-white">route.ts</code>. Modifiez d&apos;abord les types partagés dans <code className="font-mono text-xs text-white">lib/api/user.ts</code>, puis utilisez <code className="font-mono text-xs text-white">createPatchHandler</code> ou <code className="font-mono text-xs text-white">createPostHandler</code> dans <code className="font-mono text-xs text-white">route.ts</code> pour valider. Cela maintient la synchronisation automatique des types entre votre front et votre back.
        </p>
      </div>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/cli/init"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Commande : init
            </span>
          </div>
        </Link>

        <Link
          href="/docs/cli/add-action"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Commande : add action
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
