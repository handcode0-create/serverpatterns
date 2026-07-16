'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Terminal, Info, CheckCircle2, Sparkles, Settings } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';

export default function CliSetupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Introduction &amp; Setup du CLI
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Découvrez comment installer et configurer le CLI officiel de ServerPatterns pour automatiser la création de vos endpoints Next.js et de vos Server Actions de manière standardisée et optimisée pour les agents IA.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Why the CLI? */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-[#FF6A00]" />
          Pourquoi utiliser le CLI ?
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le CLI ServerPatterns n&apos;est pas un simple générateur de code (scaffolding). Il a été conçu pour structurer vos applications selon des patterns de production robustes, avec une attention particulière portée à la <strong>lisibilité par les agents IA</strong> (comme Claude, Cursor, Copilot).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#121212] border border-white/5 p-4 rounded-xl">
            <h3 className="font-display font-semibold text-sm text-white mb-1">Standardisation absolue</h3>
            <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
              Fini les structures d&apos;API disparates d&apos;un développeur à l&apos;autre. Le CLI génère toujours des fichiers homogènes respectant les règles d&apos;or du framework.
            </p>
          </div>
          <div className="bg-[#121212] border border-white/5 p-4 rounded-xl">
            <h3 className="font-display font-semibold text-sm text-white mb-1">Prêt pour l&apos;IA (AI-Ready)</h3>
            <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
              Le code généré est commenté de manière descriptive (JSDoc, TODOs normalisés) pour que vos agents de codage IA puissent immédiatement comprendre et enrichir la logique métier sans casser la structure.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Install */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <Terminal size={18} className="text-[#FF6A00]" />
          Installation &amp; Initialisation
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Il n&apos;est pas nécessaire d&apos;installer le CLI globalement. Vous pouvez l&apos;exécuter directement à la racine de votre projet Next.js via votre gestionnaire de paquets favori :
        </p>
        <PackageManagerTabs
          pnpm="pnpm dlx serverpatterns init"
          npm="npx serverpatterns init"
          yarn="yarn dlx serverpatterns init"
          bun="bunx serverpatterns init"
        />
        <Callout type="info" title="Assistant Clack">
          Cette commande lance un assistant interactif qui configure le fichier de configuration <code className="font-mono text-xs text-white">serverpatterns.json</code> et installe automatiquement les dépendances requises (<code className="font-mono text-xs text-white">@serverpatterns/core</code>, <code className="font-mono text-xs text-white">@serverpatterns/next</code>, <code className="font-mono text-xs text-white">zod</code>).
        </Callout>
      </div>

      {/* Configuration File */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <Settings size={18} className="text-[#FF6A00]" />
          Fichier de Configuration
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le fichier <code className="font-mono text-xs text-white">serverpatterns.json</code> à la racine de votre projet permet de personnaliser la génération de code pour s&apos;adapter parfaitement à votre arborescence :
        </p>
        <CodeBlock
          code={`{
  "srcDir": true,
  "apiDir": "src/app/api",
  "actionsDir": "src/app/actions",
  "clientPath": "src/lib/api.ts"
}`}
          title="serverpatterns.json"
        />
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 text-xs">
            <div className="font-mono font-bold text-white min-w-[120px] pt-0.5">srcDir</div>
            <div className="text-[#8E8E8A] leading-relaxed">Indique si votre projet Next.js utilise le dossier <code className="font-mono text-xs text-white">src/</code> (détecté automatiquement lors de l&apos;initialisation).</div>
          </div>
          <div className="flex items-start gap-3 text-xs">
            <div className="font-mono font-bold text-white min-w-[120px] pt-0.5">apiDir</div>
            <div className="text-[#8E8E8A] leading-relaxed">Le dossier où seront générés vos Route Handlers (par défaut <code className="font-mono text-xs text-white">src/app/api</code> ou <code className="font-mono text-xs text-white">app/api</code>).</div>
          </div>
          <div className="flex items-start gap-3 text-xs">
            <div className="font-mono font-bold text-white min-w-[120px] pt-0.5">actionsDir</div>
            <div className="text-[#8E8E8A] leading-relaxed">Le dossier où seront générées vos Server Actions (par défaut <code className="font-mono text-xs text-white">src/app/actions</code> ou <code className="font-mono text-xs text-white">app/actions</code>).</div>
          </div>
          <div className="flex items-start gap-3 text-xs">
            <div className="font-mono font-bold text-white min-w-[120px] pt-0.5">clientPath</div>
            <div className="text-[#8E8E8A] leading-relaxed">Le chemin d&apos;accès du client API unifié généré (par défaut <code className="font-mono text-xs text-white">src/lib/api.ts</code> ou <code className="font-mono text-xs text-white">lib/api.ts</code>).</div>
          </div>
        </div>
      </div>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/primitives/idempotency"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              withIdempotency()
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
              Commande : init
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
