'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import Callout from '@/components/Callout';

export default function CliConfigurationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Configuration du CLI
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Découvrez la philosophie de configuration de ServerPatterns.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Philosophy of zero-config */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <Settings size={18} className="text-[#FF6A00]" />
          <span>Zéro configuration</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          ServerPatterns ne nécessite aucune configuration pour l&apos;instant — toutes les options se choisissent de façon interactive au moment de l&apos;exécution du CLI.
        </p>
      </div>

      <Callout title="Simplicité avant tout" type="info">
        Pour garantir une expérience de développement fluide (DX), nous évitons l&apos;over-engineering des fichiers de configuration statiques. Vos choix d&apos;architecture sont détectés ou demandés dynamiquement lors de l&apos;exécution des commandes.
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
