'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Cpu, FileText, Check, Copy, ArrowUpRight } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function DocsAiAgentsPage() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const customPrompt = `# Directives d'ingénierie ServerPatterns

Ce projet utilise le framework ServerPatterns pour normaliser la couche serveur.

## Règles générales :
1. N'utilise jamais de requêtes 'fetch' ou 'axios' brutes pour tes endpoints internes. Consomme toujours l'API Client unifiée importée de 'src/lib/api' (ex: api.get, api.post).
2. Ne lève jamais d'exceptions globales (throw new Error) dans ta logique de requêtes réseau. Utilise le type Result monadique de '@serverpatterns/core' pour encapsuler les succès et les échecs, puis traite-les explicitement avec 'isOk()' et 'isErr()'.
3. Chaque Route Handler d'API Next.js doit être enveloppé dans 'createGetHandler' ou 'createPostHandler' avec une validation Zod stricte sur les query params ou le JSON body.
4. Chaque Server Action doit être créée via le wrapper 'withServerAction' pour assurer la validation à l'exécution et une réponse Result propre.
5. Utilise le CLI de génération pour créer de nouveaux squelettes parfaits de code : 'npx serverpatterns add api <nom>' ou 'npx serverpatterns add action <nom>'.`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(customPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Intégration avec les Agents IA
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          ServerPatterns est optimisé nativement pour être compris, découvert et implémenté de façon optimale par vos outils d&apos;intelligence artificielle.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Why AI friendly? */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-white" id="optimise-pour-ia">
          Pourquoi ServerPatterns est &quot;AI-Friendly&quot; ?
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          La plupart des architectures réseau ou serveurs dans Next.js souffrent de trop de flexibilité, ce qui conduit les agents IA (comme Claude Code, Cursor ou GitHub Copilot) à générer du code divergent, verbeux ou mal typé à chaque requête. 
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Grâce à ses signatures de fonctions explicites et ses types monadiques, ServerPatterns supprime cette ambiguïté. L&apos;IA sait immédiatement quel wrapper appeler et comment traiter les erreurs sans improvisation.
        </p>
      </div>

      {/* llms.txt section */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white" id="fichiers-decouvrables">
          Fichiers de découverte llms.txt et llms-full.txt
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Nous exposons deux points d&apos;entrée normalisés à la racine de notre site pour permettre aux LLMs d&apos;analyser l&apos;intégralité de nos spécifications et composants d&apos;un seul coup d&apos;œil :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="/llms.txt" 
            target="_blank" 
            className="p-5 bg-white/[0.01] border border-white/5 hover:border-[#FF6A00]/20 rounded-xl flex items-start gap-4 transition group"
          >
            <FileText className="text-[#FF6A00] shrink-0" size={20} />
            <div>
              <span className="font-mono text-xs text-white font-bold block mb-1 flex items-center gap-1">
                /llms.txt <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 transition" />
              </span>
              <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
                Fichier texte synthétique listant toutes nos signatures de fonctions publiques, types et commandes CLI de base.
              </p>
            </div>
          </a>

          <a 
            href="/llms-full.txt" 
            target="_blank" 
            className="p-5 bg-white/[0.01] border border-white/5 hover:border-[#FF6A00]/20 rounded-xl flex items-start gap-4 transition group"
          >
            <FileText className="text-[#FF6A00] shrink-0" size={20} />
            <div>
              <span className="font-mono text-xs text-white font-bold block mb-1 flex items-center gap-1">
                /llms-full.txt <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 transition" />
              </span>
              <p className="text-[11px] text-[#8E8E8A] leading-relaxed">
                Version complète de toute notre documentation technique au format texte brut, idéale pour l&apos;apprentissage contextuel par un modèle d&apos;IA.
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Instructions copy block */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white" id="prompt-systeme">
          Prompt système pour vos projets (CLAUDE.md / .cursorrules)
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Copiez les instructions ci-dessous et insérez-les dans votre fichier de configuration d&apos;agent (ex: <code className="font-mono text-xs text-white">CLAUDE.md</code>, <code className="font-mono text-xs text-white">.cursorrules</code> ou votre prompt système de custom GPT) pour forcer votre assistant à suivre nos normes :
        </p>

        <div className="relative group">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-mono text-[10px] px-2.5 py-1.5 rounded transition"
          >
            {copiedPrompt ? (
              <>
                <Check size={11} className="text-green-400 stroke-[3]" />
                <span className="text-green-400">Copié !</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copier</span>
              </>
            )}
          </button>
          
          <pre className="p-5 bg-black/40 border border-white/5 rounded-xl font-mono text-[11px] text-[#8E8E8A] overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
            {customPrompt}
          </pre>
        </div>
      </div>

      {/* Technical Roadmap Note */}
      <div className="pt-4">
        <h2 className="font-display text-lg font-semibold text-white mb-4" id="roadmap-ia">Roadmap technique pour les outils d&apos;IA</h2>
        
        <Callout title="Note de Roadmap : Serveur MCP" type="info">
          Pour aller plus loin, une brique MCP (Model Context Protocol) est prévue à notre feuille de route technique. Ce protocole permettra à des assistants autonomes (comme Claude Desktop ou Claude Code) de lancer directement et de manière autonome les commandes de génération du CLI (ex: la création de nouveaux Route Handlers ou Actions) directement depuis leur espace de discussion en s&apos;interfaçant avec le framework.
        </Callout>
      </div>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/changelog"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Changelog Général
            </span>
          </div>
        </Link>

        <Link
          href="/docs"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Retour
            </span>
            <span className="block text-xs font-bold text-white">
              Introduction
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
