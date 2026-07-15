'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Info, Settings } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function CliConfigurationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Configuration du CLI
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Comprendre et personnaliser la structure de génération du CLI avec le fichier de configuration locale.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Configuration file */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <Settings size={18} className="text-[#FF6A00]" />
          <span>Le fichier serverpatterns.json</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Pour la V1, le CLI de ServerPatterns s&apos;appuie exclusivement sur un fichier de configuration statique léger à la racine de votre projet appelé <code className="font-mono text-xs text-white">serverpatterns.json</code>.
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Il est créé automatiquement par la commande <code className="font-mono text-xs text-[#FF6A00]">serverpatterns init</code> mais peut être édité manuellement à tout moment pour modifier les répertoires cibles de génération.
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
      </div>

      {/* Property details */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Description des propriétés</h2>
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <span className="font-mono text-[#FF6A00] font-bold block mb-1">srcDir (boolean)</span>
            <p className="text-[#8E8E8A] leading-relaxed">
              Indique si votre application Next.js utilise l&apos;arborescence du répertoire <code className="font-mono text-white text-[11px]">src/</code>. Si activé, toutes les générations automatiques cibleront ce dossier.
            </p>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <span className="font-mono text-[#FF6A00] font-bold block mb-1">apiDir (string)</span>
            <p className="text-[#8E8E8A] leading-relaxed">
              Le chemin relatif vers votre répertoire de Route Handlers. C&apos;est dans ce dossier que la commande <code className="font-mono text-white text-[11px]">serverpatterns add api</code> ira créer de nouveaux sous-répertoires d&apos;API.
            </p>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <span className="font-mono text-[#FF6A00] font-bold block mb-1">actionsDir (string)</span>
            <p className="text-[#8E8E8A] leading-relaxed">
              Le chemin relatif vers votre répertoire de Server Actions. La commande <code className="font-mono text-white text-[11px]">serverpatterns add action</code> y créera vos fichiers d&apos;actions typées.
            </p>
          </div>

          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <span className="font-mono text-[#FF6A00] font-bold block mb-1">clientPath (string)</span>
            <p className="text-[#8E8E8A] leading-relaxed">
              Le chemin relatif où votre client d&apos;API centralisé a été créé. Pour la version future, cela permettra d&apos;injecter ou mettre à jour automatiquement les types réseaux.
            </p>
          </div>
        </div>
      </div>

      <Callout title="Pas d&apos;over-engineering" type="info">
        Pour la version V1.0, aucune autre configuration complexe ou fichier TS/JS additionnel n&apos;est requis. L&apos;architecture de ServerPatterns est conçue pour rester simple, explicite et facile à maintenir par vos outils d&apos;intégration continue.
      </Callout>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/cli/add-action"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              serverpatterns add action
            </span>
          </div>
        </Link>

        <Link
          href="/docs/cli/changelog"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Changelog CLI
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
