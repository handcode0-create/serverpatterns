'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Milestone, Star, Shield, Cpu } from 'lucide-react';
import Callout from '@/components/Callout';

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Changelog
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Suivez l&apos;évolution de ServerPatterns. Toutes les nouveautés, correctifs de sécurité et optimisations de performance de notre framework.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* v0.1.0 Initial Release */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Milestone size={18} />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">v0.1.0 — Version Initiale (MVP)</h2>
        </div>

        <p className="text-xs text-[#8E8E8A] font-mono leading-relaxed">
          Publié le 15 juillet 2026 par <span className="text-[#FF6A00]">HANCODE STUDIO</span>.
        </p>

        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Cette première version jette les bases d&apos;un framework de primitives légères conçues pour assainir et unifier les échanges réseau et d&apos;actions dans Next.js App Router.
        </p>

        <div className="space-y-4">
          <h3 className="font-display font-semibold text-white text-base" id="nouveautes">Nouveautés majeures</h3>
          
          <ul className="space-y-4 text-xs text-[#8E8E8A] list-none pl-0">
            <li className="flex gap-3 items-start p-4 bg-white/[0.01] border border-white/5 rounded-xl">
              <span className="p-1 rounded bg-[#FF6A00]/10 text-[#FF6A00] mt-0.5 shrink-0">
                <Shield size={14} />
              </span>
              <div>
                <strong className="text-white font-semibold block mb-1">Result&lt;T, E&gt; Core</strong>
                Le type monadique central et les helpers <code className="font-mono text-white text-[11px]">ok()</code> et <code className="font-mono text-white text-[11px]">err()</code> qui permettent de bannir l&apos;usage désordonné des exceptions `throw`.
              </div>
            </li>

            <li className="flex gap-3 items-start p-4 bg-white/[0.01] border border-white/5 rounded-xl">
              <span className="p-1 rounded bg-[#FF6A00]/10 text-[#FF6A00] mt-0.5 shrink-0">
                <Cpu size={14} />
              </span>
              <div>
                <strong className="text-white font-semibold block mb-1">createApiClient</strong>
                Un client HTTP unifié de moins de 1kb pour simplifier vos requêtes asynchrones en conservant les types statiques extraits côté serveur.
              </div>
            </li>

            <li className="flex gap-3 items-start p-4 bg-white/[0.01] border border-white/5 rounded-xl">
              <span className="p-1 rounded bg-[#FF6A00]/10 text-[#FF6A00] mt-0.5 shrink-0">
                <Star size={14} />
              </span>
              <div>
                <strong className="text-white font-semibold block mb-1">CLI Génératif Initiaux</strong>
                Ajout des commandes <code className="font-mono text-white text-[11px]">init</code>, <code className="font-mono text-white text-[11px]">add api</code> et <code className="font-mono text-white text-[11px]">add action</code> pour générer du code impeccable et pré-configuré sans aucun effort.
              </div>
            </li>
          </ul>
        </div>
      </div>

      <Callout title="Stabilité" type="info">
        La branche <code className="font-mono text-xs text-white">v0.1.x</code> est considérée comme stable pour la production et fait l&apos;objet d&apos;une couverture de tests unitaires à 100% sur le package noyau.
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/cli"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Référence CLI
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
              Result&lt;T, E&gt;
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
