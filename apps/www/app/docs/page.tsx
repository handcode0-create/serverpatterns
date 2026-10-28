'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, ChevronRight } from 'lucide-react';
import Callout from '@/components/Callout';

export default function DocsIntroduction() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Introduction à ServerPatterns
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Le framework de standards serveur léger et pragmatique conçu exclusivement pour Next.js App Router par HANCODE STUDIO.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Philosophy Block */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-white" id="philosophie">
          La Philosophie
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Next.js App Router offre une flexibilité totale pour concevoir vos services : API Route Handlers, Server Actions, utilitaires locaux... Cette liberté est une bénédiction, mais elle se transforme rapidement en défi d&apos;harmonisation pour les équipes :
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#8E8E8A] font-mono">
          <li className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex gap-3 items-start">
            <span className="text-[#FF6A00] font-bold">↳</span>
            <div>
              <span className="text-white font-bold block mb-1">Boilerplate dispersé</span>
              Chaque développeur écrit son fetch, gère ses tokens et configure ses exceptions de façon déstructurée.
            </div>
          </li>
          <li className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex gap-3 items-start">
            <span className="text-[#FF6A00] font-bold">↳</span>
            <div>
              <span className="text-white font-bold block mb-1">Typage réseau fictif</span>
              TypeScript compile, mais les payloads dynamiques à l&apos;exécution ne sont jamais réellement audités par Zod.
            </div>
          </li>
        </ul>
        
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          <strong className="text-white font-medium">ServerPatterns apporte de la discipline sans surcouche lourde.</strong> Il n&apos;y a pas de dépendance magique ou de framework opaque d&apos;API Management. Vous conservez vos bases de données, vos middlewares et vos ORM préférés. ServerPatterns encapsule simplement vos entrées et sorties pour garantir un standard strict et unifié de bout en bout.
        </p>
      </div>

      {/* Callout */}
      <Callout title="Zéro Magie" type="recommendation">
        ServerPatterns ne remplace pas les routeurs de Next.js, il les sublime. Les fichiers générés par notre CLI sont du pur TypeScript de production, totalement transparent, auditable et modifiable selon les besoins de votre projet.
      </Callout>

      {/* Core values block */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-2xl font-semibold text-white" id="valeurs-fondamentales">
          Valeurs Fondamentales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white/[0.01] border border-[#FF6A00]/10 rounded-xl">
            <Sparkles className="text-[#FF6A00] mb-3" size={20} />
            <h3 className="font-display font-bold text-sm text-white mb-2">Léger &amp; Sûr</h3>
            <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
              Pas de runtime lourd ou de serveur additionnel. Moins de 3kb gzipped au total.
            </p>
          </div>
          <div className="p-5 bg-white/[0.01] border border-[#FF6A00]/10 rounded-xl">
            <ShieldCheck className="text-[#FF6A00] mb-3" size={20} />
            <h3 className="font-display font-bold text-sm text-white mb-2">Zod Natif</h3>
            <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
              La validation est obligatoire pour chaque handler et action généré, assurant un typage sûr à 100%.
            </p>
          </div>
          <div className="p-5 bg-white/[0.01] border border-[#FF6A00]/10 rounded-xl">
            <HeartHandshake className="text-[#FF6A00] mb-3" size={20} />
            <h3 className="font-display font-bold text-sm text-white mb-2">Opinionated</h3>
            <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
              Une direction claire sur l&apos;architecture de flux de données sans compromis de performance.
            </p>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-end pt-4">
        <Link
          href="/docs/installation"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Installation
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
