'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle2, Terminal, FileCode, PlusCircle, ArrowRight, Layers } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import Callout from '@/components/Callout';

export default function DocsInstallation() {
  const [startMode, setStartMode] = useState<'new' | 'existing' | 'manual'>('new');

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Installation &amp; Configuration
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Installez le package noyau ServerPatterns et le moteur de type Next.js manuellement ou en quelques secondes via notre CLI génératif.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Prerequisites */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="prerequis">
          <CheckCircle2 size={18} className="text-[#FF6A00]" />
          <span>Prérequis de système</span>
        </h2>
        <p className="text-xs text-[#8E8E8A]">
          ServerPatterns est optimisé pour les environnements de production modernes basés sur Next.js App Router.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <span className="text-[#FF6A00] font-bold block mb-1">Node.js Runtime</span>
            <span className="text-white">v18.0.0 ou supérieur</span> est requis pour les mécanismes asynchrones et typages d&apos;API natifs.
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <span className="text-[#FF6A00] font-bold block mb-1">Next.js Framework</span>
            <span className="text-white">Next.js v14.0.0 ou supérieur</span> avec <strong className="text-[#FF6A00]">App Router</strong> activé. Non compatible avec Pages Router.
          </div>
        </div>
      </div>

      {/* Start Point Selection */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="point-de-depart">
          <Layers size={18} className="text-[#FF6A00]" />
          <span>Choisis ton point de départ</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Sélectionnez l&apos;option qui correspond le mieux à l&apos;état actuel de votre application Next.js App Router :
        </p>

        {/* 3 Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Option 1: New Project */}
          <button
            onClick={() => setStartMode('new')}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
              startMode === 'new'
                ? 'bg-[#FF6A00]/5 border-[#FF6A00] shadow-[0_0_20px_rgba(255,106,0,0.1)]'
                : 'bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
            }`}
          >
            {startMode === 'new' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF6A00]/10 rounded-full blur-xl pointer-events-none" />
            )}
            <div>
              <PlusCircle size={20} className={`mb-3 ${startMode === 'new' ? 'text-[#FF6A00]' : 'text-[#8E8E8A]'}`} />
              <h3 className="font-display font-bold text-sm text-white mb-1.5">Nouveau projet</h3>
              <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
                Initialise une application Next.js fraîche configurée avec ServerPatterns.
              </p>
            </div>
            <div className={`mt-4 font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 ${startMode === 'new' ? 'text-[#FF6A00]' : 'text-[#8E8E8A]'}`}>
              <span>Sélectionné</span>
              <ArrowRight size={10} />
            </div>
          </button>

          {/* Option 2: Existing Project */}
          <button
            onClick={() => setStartMode('existing')}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
              startMode === 'existing'
                ? 'bg-[#FF6A00]/5 border-[#FF6A00] shadow-[0_0_20px_rgba(255,106,0,0.1)]'
                : 'bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
            }`}
          >
            {startMode === 'existing' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF6A00]/10 rounded-full blur-xl pointer-events-none" />
            )}
            <div>
              <Terminal size={20} className={`mb-3 ${startMode === 'existing' ? 'text-[#FF6A00]' : 'text-[#8E8E8A]'}`} />
              <h3 className="font-display font-bold text-sm text-white mb-1.5">Projet existant</h3>
              <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
                Ajoute ServerPatterns et son client d&apos;API dans ton codebase Next.js actif.
              </p>
            </div>
            <div className={`mt-4 font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 ${startMode === 'existing' ? 'text-[#FF6A00]' : 'text-[#8E8E8A]'}`}>
              <span>Sélectionné</span>
              <ArrowRight size={10} />
            </div>
          </button>

          {/* Option 3: Manual Installation */}
          <button
            onClick={() => setStartMode('manual')}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
              startMode === 'manual'
                ? 'bg-[#FF6A00]/5 border-[#FF6A00] shadow-[0_0_20px_rgba(255,106,0,0.1)]'
                : 'bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
            }`}
          >
            {startMode === 'manual' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF6A00]/10 rounded-full blur-xl pointer-events-none" />
            )}
            <div>
              <FileCode size={20} className={`mb-3 ${startMode === 'manual' ? 'text-[#FF6A00]' : 'text-[#8E8E8A]'}`} />
              <h3 className="font-display font-bold text-sm text-white mb-1.5">Installation manuelle</h3>
              <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
                Contrôle total sans passer par le CLI interactif de génération.
              </p>
            </div>
            <div className={`mt-4 font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 ${startMode === 'manual' ? 'text-[#FF6A00]' : 'text-[#8E8E8A]'}`}>
              <span>Sélectionné</span>
              <ArrowRight size={10} />
            </div>
          </button>

        </div>
      </div>

      {/* Dynamic Content Sections depending on state */}
      <div className="pt-6">
        
        {/* CASE 1: NEW PROJECT */}
        {startMode === 'new' && (
          <div className="space-y-6 motion-preset-fade duration-300">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-white">1. Initialisez un nouveau projet Next.js</h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Créez une application Next.js vide avec TypeScript, Tailwind CSS et App Router :
              </p>
              <PackageManagerTabs
                pnpm="pnpm create next-app@latest mon-app-patterns"
                npm="npx create-next-app@latest mon-app-patterns"
                yarn="yarn create next-app mon-app-patterns"
                bun="bun create next-app mon-app-patterns"
              />
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-display font-bold text-lg text-white">2. Initialisez ServerPatterns</h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Déplacez-vous dans le dossier créé et lancez notre assistant d&apos;initialisation :
              </p>
              <PackageManagerTabs
                pnpm="pnpm dlx serverpatterns init"
                npm="npx serverpatterns init"
                yarn="yarn dlx serverpatterns init"
                bun="bunx serverpatterns init"
              />
            </div>

            <Callout title="Initialisation Express" type="recommendation">
              L&apos;initialisation automatique installe toutes les dépendances requises (<code className="font-mono text-xs text-white">@serverpatterns/core</code>, <code className="font-mono text-xs text-white">@serverpatterns/next</code>, <code className="font-mono text-xs text-white">zod</code>) et provisionne un client d&apos;API prêt à l&apos;emploi.
            </Callout>
          </div>
        )}

        {/* CASE 2: EXISTING PROJECT */}
        {startMode === 'existing' && (
          <div className="space-y-6 motion-preset-fade duration-300">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-white">1. Exécutez l&apos;initialisation</h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Dans la racine de votre projet Next.js existant, lancez l&apos;assistant de configuration interactif :
              </p>
              <PackageManagerTabs
                pnpm="pnpm dlx serverpatterns init"
                npm="npx serverpatterns init"
                yarn="yarn dlx serverpatterns init"
                bun="bunx serverpatterns init"
              />
            </div>

            <Callout title="Cohérence d'architecture" type="info">
              L&apos;assistant détectera si votre projet est structuré avec un dossier <code className="font-mono text-xs text-white">src/</code> ou non et adaptera les chemins de génération d&apos;API client et d&apos;actions en conséquence.
            </Callout>
          </div>
        )}

        {/* CASE 3: MANUAL INSTALLATION */}
        {startMode === 'manual' && (
          <div className="space-y-6 motion-preset-fade duration-300">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-white">1. Installer les dépendances</h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Ajoutez manuellement les dépendances nécessaires au projet :
              </p>
              <PackageManagerTabs
                pnpm="pnpm add @serverpatterns/core @serverpatterns/next zod"
                npm="npm install @serverpatterns/core @serverpatterns/next zod"
                yarn="yarn add @serverpatterns/core @serverpatterns/next zod"
                bun="bun add @serverpatterns/core @serverpatterns/next zod"
              />
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="font-display font-bold text-sm text-white" id="result-helper">2. Structure du type de Result</h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Le noyau du framework s&apos;appuie sur une structure de type unifiée et monadique pour représenter les succès et les échecs :
              </p>
              <CodeBlock 
                code={`// Signature issue de @serverpatterns/core
export type Result<T, E = ServerPatternsError> =
  | { success: true; data: T }
  | { success: false; error: E };`}
                title="@serverpatterns/core"
              />
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="font-display font-bold text-sm text-white" id="client-api">3. Initialiser le client d&apos;API</h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Configurez le client réseau centralisé de votre application :
              </p>
              <CodeBlock 
                code={`// src/lib/api.ts
import { createApiClient } from '@serverpatterns/core';

export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: \`Bearer \${token}\` } : {};
  }
});`}
                title="src/lib/api.ts"
              />
            </div>
          </div>
        )}

      </div>

      {/* Environment variables */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="variables-env">
          <span>Variables d&apos;environnement</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le client réseau s&apos;appuie typiquement sur une variable pour pointer sur votre backend de production ou de préproduction. Veillez à configurer la clé suivante dans vos fichiers <code className="font-mono text-[11px] text-[#FF6A00]">.env.local</code> et <code className="font-mono text-[11px] text-[#FF6A00]">.env.production</code> :
        </p>
        <CodeBlock 
          code={`# .env.local
NEXT_PUBLIC_API_URL=https://votre-domaine-api.com/api`}
          title=".env.example"
        />
      </div>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Introduction
            </span>
          </div>
        </Link>

        <Link
          href="/docs/quickstart"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Quickstart (10m)
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
