'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Milestone, Star, Terminal, Zap } from 'lucide-react';
import Callout from '@/components/Callout';

export default function CliChangelogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Changelog du CLI &amp; Packages
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Suivez toutes les publications, mises à jour et correctifs de notre outil en ligne de commande et des librairies associées.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Version 0.1.0 */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Milestone size={18} />
          </div>
          <h2 className="font-display text-2xl font-bold text-white" id="v0-1-0">v0.1.0 — Version initiale</h2>
        </div>

        <p className="text-xs text-[#8E8E8A] font-mono leading-relaxed">
          Publié le 15 juillet 2026 par <span className="text-[#FF6A00]">HANCODE STUDIO</span>.
        </p>

        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Cette version marque la sortie du MVP pour les trois briques phares du framework ServerPatterns.
        </p>

        <div className="space-y-4">
          <h3 className="font-display font-semibold text-white text-base" id="packages-core-next">Packages @serverpatterns/core &amp; next</h3>
          <ul className="text-xs text-[#8E8E8A] space-y-2 pl-4 list-disc leading-relaxed">
            <li>Déploiement du type monadique unifié <code className="font-mono text-white text-[11px]">Result&lt;T, E&gt;</code> pour supprimer les try/catch.</li>
            <li>Lancement du client de requêtes unifié <code className="font-mono text-white text-[11px]">createApiClient()</code>.</li>
            <li>Lancement du wrapper de Route Handlers Next.js <code className="font-mono text-white text-[11px]">createGetHandler()</code> / <code className="font-mono text-white text-[11px]">createPostHandler()</code> avec validation Zod automatique.</li>
            <li>Lancement du wrapper de Server Actions Next.js <code className="font-mono text-white text-[11px]">withServerAction()</code>.</li>
          </ul>

          <h3 className="font-display font-semibold text-white text-base" id="package-cli">Outil CLI @serverpatterns/cli</h3>
          <ul className="text-xs text-[#8E8E8A] space-y-2 pl-4 list-disc leading-relaxed">
            <li>Commande <code className="font-mono text-white text-[11px]">init</code> : diagnostic interactif complet du projet Next.js et initialisation du client d&apos;API.</li>
            <li>Commande <code className="font-mono text-white text-[11px]">add api &lt;nom&gt;</code> : génération instantanée d&apos;un Route Handler Next.js typé et sécurisé par Zod.</li>
            <li>Commande <code className="font-mono text-white text-[11px]">add action &lt;nom&gt;</code> : génération d&apos;une Server Action Next.js sécurisée par Zod.</li>
          </ul>
        </div>
      </div>

      <Callout title="Roadmap des agents IA" type="info">
        Un serveur MCP dédié (Model Context Protocol) est envisagé pour une version future afin d&apos;exposer l&apos;intégralité des commandes CLI sous forme d&apos;outils directement exploitables par des agents IA de code (Claude Code, Cursor, etc.). Notez que cette brique est planifiée et n&apos;est pas encore disponible en version stable.
      </Callout>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/cli/configuration"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Configuration CLI
            </span>
          </div>
        </Link>

        <Link
          href="/docs/changelog"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Changelog Général
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
