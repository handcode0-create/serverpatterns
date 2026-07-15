'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Terminal, Info, CheckCircle2 } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';

export default function CliAddApiPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          serverpatterns add api
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Génère un Route Handler Next.js structuré et sécurisé ainsi que les types de requêtes associés en un instant.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Syntax and Options */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white">Syntaxe de la commande</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Spécifiez simplement le nom de votre endpoint réseau cible :
        </p>
        <PackageManagerTabs
          pnpm="pnpm dlx serverpatterns add api <nom>"
          npm="npx serverpatterns add api <nom>"
          yarn="yarn dlx serverpatterns add api <nom>"
          bun="bunx serverpatterns add api <nom>"
        />
      </div>

      {/* Terminal Example */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Exemple d&apos;exécution complète</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici le retour attendu dans votre terminal lorsque vous créez une ressource <code className="font-mono text-xs text-white">users</code> :
        </p>

        <div className="bg-black/60 border border-white/5 rounded-xl p-6 font-mono text-xs text-[#8E8E8A] space-y-2">
          <div className="text-white/60">
            <span className="text-[#FF6A00]">$</span> npx serverpatterns add api users
          </div>
          <div className="text-[#8E8E8A]">
            Analyse du fichier serverpatterns.json... <br />
            Dossier cible détecté : <span className="text-white">src/app/api/users</span>
          </div>
          <div className="text-green-400">
            ✔ Création du fichier : <span className="text-white">src/app/api/users/route.ts</span> <br />
            ✔ Intégration du schéma de validation Zod par défaut <br />
            ✔ Ajout des types de requêtes associés <br />
            🎉 Route Handler prêt à être implémenté !
          </div>
        </div>
      </div>

      {/* Generated Code details */}
      <div className="space-y-6 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Code généré &amp; Annotations</h2>
        <p className="text-xs text-[#8E8E8A]">
          Voici le fichier exact créé sous <code className="font-mono text-xs text-white">src/app/api/users/route.ts</code>. Nous avons séparé ce qui est prêt à l&apos;emploi de ce que vous devez éditer vous-même :
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <CheckCircle2 size={14} className="text-[#FF6A00]" />
              <span>Ce qui est déjà configuré et prêt</span>
            </div>
            <ul className="text-xs text-[#8E8E8A] space-y-1 pl-5 list-disc leading-relaxed">
              <li>Le wrapper <code className="font-mono text-xs text-white">createPostHandler()</code> de <code className="font-mono text-xs text-white">@serverpatterns/next</code>.</li>
              <li>La validation Zod automatique sur le corps de requête JSON.</li>
              <li>La gestion uniforme du statut de retour HTTP.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <Terminal size={14} className="text-[#FF6A00]" />
              <span>Ce que vous devez éditer (les TODO)</span>
            </div>
            <ul className="text-xs text-[#8E8E8A] space-y-1 pl-5 list-disc leading-relaxed">
              <li>Le schéma Zod <code className="font-mono text-xs text-white">schema</code> pour correspondre exactement à vos données attendues.</li>
              <li>La logique interne du <code className="font-mono text-xs text-white">handler</code> (requêtes base de données, appels de services tiers, etc.).</li>
            </ul>
          </div>

          <CodeBlock
            code={`// src/app/api/users/route.ts
import { createPostHandler } from '@serverpatterns/next';
import { z } from 'zod';

// 1. MODIFIE CE SCHÉMA : Déclare l'exact payload attendu en entrée
const UserPayloadSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Format d'adresse e-mail invalide"),
});

export const POST = createPostHandler({
  schema: UserPayloadSchema,
  handler: async ({ body }) => {
    // 2. LOGIQUE DE SERVICE : Écris ton code d'écriture réseau ici
    // Exemple : const user = await db.user.create({ data: body });
    
    return {
      status: 201,
      body: {
        success: true,
        data: {
          id: Math.random().toString(36).substring(7),
          name: body.name,
          email: body.email,
        }
      }
    };
  }
});`}
            title="src/app/api/users/route.ts"
          />
        </div>
      </div>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/cli/init"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              serverpatterns init
            </span>
          </div>
        </Link>

        <Link
          href="/docs/cli/add-action"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              serverpatterns add action
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
