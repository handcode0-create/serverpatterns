'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Terminal, Copy, Check, Info } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';

export default function CliInitPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          serverpatterns init
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Configure l&apos;environnement initial de ServerPatterns, installe les dépendances nécessaires et configure votre client d&apos;API.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Terminal Command */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white">Lancement de la commande</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Exécutez l&apos;assistant interactif d&apos;initialisation à la racine de votre projet Next.js :
        </p>
        <PackageManagerTabs
          pnpm="pnpm dlx serverpatterns init"
          npm="npx serverpatterns init"
          yarn="yarn dlx serverpatterns init"
          bun="bunx serverpatterns init"
        />
      </div>

      {/* Interactive Prompts */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Prompts interactifs de l&apos;assistant</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          L&apos;assistant de configuration interactif Clack analyse votre projet et vous pose une série de questions pour s&apos;adapter à votre architecture :
        </p>

        <div className="bg-black/60 border border-white/5 rounded-xl p-6 font-mono text-xs space-y-4 text-[#8E8E8A]">
          <div className="text-white">
            <span className="text-[#FF6A00] font-bold">◆</span> <span className="font-bold">ServerPatterns Setup</span>
          </div>
          
          <div className="pl-4 border-l border-white/10 space-y-3">
            <div>
              <span className="text-green-400">?</span> <span className="text-white">Quel gestionnaire de paquets utilisez-vous ?</span>
              <div className="text-white/40 pl-4 mt-1">
                <span>❯ pnpm</span> <br />
                <span className="text-[#8E8E8A]/50">  npm</span> <br />
                <span className="text-[#8E8E8A]/50">  yarn</span> <br />
                <span className="text-[#8E8E8A]/50">  bun</span>
              </div>
            </div>

            <div>
              <span className="text-green-400">?</span> <span className="text-white">Votre projet utilise-t-il le dossier &quot;src/&quot; ?</span>
              <div className="text-[#FF6A00] pl-4 mt-1">❯ oui / non (détecté automatiquement)</div>
            </div>

            <div>
              <span className="text-green-400">?</span> <span className="text-white">Souhaitez-vous installer les dépendances nécessaires maintenant ?</span>
              <div className="text-[#FF6A00] pl-4 mt-1">❯ Oui, installer @serverpatterns/core, @serverpatterns/next et zod</div>
            </div>
          </div>

          <div className="text-green-400">
            <span>✔</span> Configuration générée avec succès !
          </div>
        </div>
      </div>

      {/* Generated Files */}
      <div className="space-y-6 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Fichiers créés</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Une fois la configuration validée, le CLI génère les fichiers suivants dans votre projet :
        </p>

        <div className="space-y-4">
          <h3 className="font-mono text-xs text-white font-bold">src/lib/api.ts</h3>
          <p className="text-xs text-[#8E8E8A]">
            Le client réseau unifié pré-configuré, prêt à être consommé côté client dans vos composants React :
          </p>
          <CodeBlock
            code={`import { createApiClient } from '@serverpatterns/core';

export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: \`Bearer \${token}\` } : {};
  }
});`}
            title="src/lib/api.ts"
          />
        </div>
      </div>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/quickstart"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Quickstart (10m)
            </span>
          </div>
        </Link>

        <Link
          href="/docs/cli/add-api"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              serverpatterns add api
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
