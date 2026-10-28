'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, AlertTriangle, Shield, Layers, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function GuideFeedbackBoard() {
  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#FF6A00] mb-2 uppercase tracking-widest">
          <Sparkles size={14} className="animate-pulse" />
          <span>Guide de Référence</span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Guide Canonique : Feedback Board
        </h1>
        <p className="text-sm font-medium text-white/80 italic leading-relaxed border-l-2 border-[#FF6A00] pl-4">
          &ldquo;Un cas canonique pour montrer comment ServerPatterns gouverne et standardise vos Server Actions de bout en bout.&rdquo;
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* 1. Étude de cas */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="etude-de-cas">
          <Layers size={18} className="text-[#FF6A00]" />
          <span>1. Étude de cas : Feedback Board</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le <strong className="text-white">Feedback Board</strong> (un tableau d&apos;idées trié par votes) est le cas d&apos;école idéal pour illustrer le cycle complet d&apos;une mutation serveur moderne : <strong className="text-white">Validation réseau ➔ Mutation métier ➔ Revalidation du cache client</strong>. 
        </p>
      </div>

      {/* 2. Le problème */}
      <div className="space-y-4 pt-2">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="le-probleme">
          <AlertTriangle size={18} className="text-red-400" />
          <span>2. Le problème (Implémentation classique)</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Sans cadre d&apos;architecture, les Server Actions dérivent rapidement vers un état instable et non sécurisé. Une implémentation naïve fait face à trois failles critiques :
        </p>

        {/* 3 Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl hover:border-red-500/20 transition-colors">
            <span className="text-red-400 font-mono text-xs font-bold uppercase block mb-2 flex items-center gap-1.5">
              <span>⚠️</span> Vulnérabilité d&apos;entrée
            </span>
            <p className="text-[#8E8E8A] text-[11px] leading-relaxed">
              Absence de typage strict et de validation <strong className="text-white">Zod</strong> en amont à l&apos;exécution. Les payloads falsifiés ou vides corrompent directement vos fichiers JSON ou votre base de données.
            </p>
          </div>

          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl hover:border-red-500/20 transition-colors">
            <span className="text-red-400 font-mono text-xs font-bold uppercase block mb-2 flex items-center gap-1.5">
              <span>⚡</span> Race Conditions &amp; NaN
            </span>
            <p className="text-[#8E8E8A] text-[11px] leading-relaxed">
              La gestion asynchrone concurrente des compteurs de votes produit des valeurs <code className="text-white bg-white/5 px-1 rounded">undefined</code> ou des crashs de type silencieux en production lors des écritures.
            </p>
          </div>

          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl hover:border-red-500/20 transition-colors">
            <span className="text-red-400 font-mono text-xs font-bold uppercase block mb-2 flex items-center gap-1.5">
              <span>🍝</span> Code Spaghetti
            </span>
            <p className="text-[#8E8E8A] text-[11px] leading-relaxed">
              Mélange indissociable de plomberie d&apos;accès réseau, de gestion d&apos;erreurs redondante, d&apos;invalidation de cache et de logique de rendu dans un seul fichier non testable.
            </p>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-white/10 pt-2" />

      {/* 3. La solution */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="la-solution">
          <Shield size={18} className="text-[#FF6A00]" />
          <span>3. La solution : La Server Action avec ServerPatterns</span>
        </h2>
        
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          En utilisant <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded text-[11px]">@serverpatterns/next</code>, nous unifions et sécurisons le comportement de l&apos;action.
        </p>

        <div className="bg-[#121212]/30 border border-white/5 rounded-xl p-4 space-y-2">
          <span className="text-[10px] font-mono text-[#FF6A00] uppercase tracking-wider font-bold block">Pourquoi ce code est robuste par design ?</span>
          <ul className="list-disc pl-5 text-xs text-[#8E8E8A] space-y-1.5">
            <li><strong className="text-white">Validation automatique :</strong> Zod intercepte et rejette instantanément les requêtes mal formées avant d&apos;exécuter le moindre code métier.</li>
            <li><strong className="text-white">Résilience aux fichiers manquants :</strong> Le fallback <code className="text-white font-mono bg-white/5 px-1 rounded">.catch(() =&gt; &quot;[]&quot;)</code> évite tout crash si le stockage local n&apos;est pas encore créé.</li>
            <li><strong className="text-white">Protection numérique :</strong> La coercion forcée <code className="text-white font-mono bg-white/5 px-1 rounded">Number(item.votes ?? 0) + 1</code> immunise l&apos;action contre les valeurs non numériques.</li>
          </ul>
        </div>

        <CodeBlock 
          title="lib/actions/vote.ts"
          code={`'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { withServerAction } from '@serverpatterns/next';
import { ok, err, ServerPatternsError } from '@serverpatterns/core';

// 1. Schéma de validation strict
export const VoteInputSchema = z.object({
  id: z.string().min(1, "ID requis"),
});

export interface Suggestion {
  id: string;
  title: string;
  votes: number;
}

const FILE_PATH = path.join(process.cwd(), 'data/suggestions.json');

export const vote = withServerAction({
  inputSchema: VoteInputSchema,
  action: async (data) => {
    try {
      const { id } = data;

      // Lecture résiliente du fichier
      const fileContent = await fs.readFile(FILE_PATH, 'utf-8').catch(() => '[]');
      const suggestions: Suggestion[] = JSON.parse(fileContent);

      const item = suggestions.find(s => s.id === id);
      if (!item) {
        return err(new ServerPatternsError("NOT_FOUND", "Suggestion introuvable"));
      }

      // Incrémentation et normalisation robuste
      item.votes = Number(item.votes ?? 0) + 1;

      await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
      await fs.writeFile(FILE_PATH, JSON.stringify(suggestions, null, 2), 'utf-8');

      revalidatePath('/feedback');
      return ok(item);
    } catch (error: any) {
      return err(new ServerPatternsError("SERVER_ERROR", "Impossible de traiter le vote", { cause: error }));
    }
  },
});`}
        />
      </div>

      <div className="h-[1px] bg-white/10 pt-2" />

      {/* 4. Best Practice */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="best-practice">
          <CheckCircle2 size={18} className="text-[#FF6A00]" />
          <span>4. Best Practice : Le Refactor &ldquo;Repository&rdquo; (Séparation des Responsabilités)</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Mélanger la logique de persistance brute (fichiers, requêtes SQL) et l&apos;orchestration réseau est un anti-pattern. Nous extrayons la mécanique d&apos;écriture dans un module autonome <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded text-[11px]">lib/db.ts</code>, laissant l&apos;action pure et ultra-légère.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div>
            <span className="text-[11px] font-mono text-[#8E8E8A] block mb-2">1. Module d&apos;infrastructure (lib/db.ts)</span>
            <CodeBlock 
              title="lib/db.ts"
              code={`import { promises as fs } from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'data/suggestions.json');

export async function incrementVote(id: string) {
  const content = await fs.readFile(FILE_PATH, 'utf-8').catch(() => '[]');
  const list = JSON.parse(content);
  const item = list.find((s: any) => s.id === id);
  if (!item) return null;
  
  item.votes = Number(item.votes ?? 0) + 1;
  await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2));
  return item;
}`}
            />
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#8E8E8A] block mb-2">2. Server Action épurée (lib/actions/vote.ts)</span>
            <CodeBlock 
              title="lib/actions/vote.ts"
              code={`'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { withServerAction } from '@serverpatterns/next';
import { ok, err, ServerPatternsError } from '@serverpatterns/core';
import { incrementVote } from '@/lib/db';

export const vote = withServerAction({
  inputSchema: z.object({ id: z.string().min(1) }),
  action: async (data) => {
    const updated = await incrementVote(data.id);
    if (!updated) {
      return err(new ServerPatternsError("NOT_FOUND", "Non trouvé"));
    }
    revalidatePath('/feedback');
    return ok(updated);
  },
});`}
            />
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-white/10 pt-2" />

      {/* 5. Ce que la CLI génère */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2" id="cli-automation">
          <Terminal size={18} className="text-[#FF6A00]" />
          <span>5. Ce que la CLI génère (La force de l&apos;automatisation)</span>
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Pour garantir que chaque développeur applique instantanément cette rigueur d&apos;architecture, la CLI automatise l&apos;intégralité de la création de ce gabarit robuste.
        </p>

        <CodeBlock 
          title="Commande"
          code="npx serverpatterns add action vote"
        />

        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le CLI te demande ensuite chaque champ un par un (nom, type, optionnel ou non) jusqu&apos;à ce que tu laisses le nom vide pour terminer, avant de générer le fichier pré-configuré intégrant le décorateur <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded text-[11px]">withServerAction</code>, le schéma Zod typé, et la structure de retour de résultats sécurisée <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded text-[11px]">Result&lt;T, E&gt;</code>.
        </p>
      </div>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
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
          href="/docs/ai-agents"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Agents IA 🤖
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
