'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Terminal, Info, CheckCircle2 } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';

export default function CliAddActionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          serverpatterns add action
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Génère une Server Action Next.js hautement sécurisée, protégée par validation Zod à l&apos;exécution et typée de bout en bout.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Syntax and Options */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-white">Syntaxe de la commande</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Spécifiez simplement le nom de votre Server Action cible :
        </p>
        <PackageManagerTabs
          pnpm="pnpm dlx serverpatterns add action <nom>"
          npm="npx serverpatterns add action <nom>"
          yarn="yarn dlx serverpatterns add action <nom>"
          bun="bunx serverpatterns add action <nom>"
        />
      </div>

      {/* Terminal Example */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Exemple d&apos;exécution complète</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici le retour attendu dans votre terminal lorsque vous créez une action <code className="font-mono text-xs text-white">register</code> :
        </p>

        <div className="bg-black/60 border border-white/5 rounded-xl p-6 font-mono text-xs text-[#8E8E8A] space-y-2">
          <div className="text-white/60">
            <span className="text-[#FF6A00]">$</span> npx serverpatterns add action register
          </div>
          <div className="text-[#8E8E8A]">
            Analyse du fichier serverpatterns.json... <br />
            Dossier cible détecté : <span className="text-white">src/app/actions</span>
          </div>
          <div className="text-green-400">
            ✔ Création du fichier : <span className="text-white">src/app/actions/register.ts</span> <br />
            ✔ Ajout de la directive &quot;use server&quot; en en-tête <br />
            ✔ Intégration du schéma de validation Zod par défaut <br />
            🎉 Server Action prête à être importée côté client !
          </div>
        </div>
      </div>

      {/* Generated Code details */}
      <div className="space-y-6 pt-4">
        <h2 className="font-display text-lg font-semibold text-white">Code généré &amp; Annotations</h2>
        <p className="text-xs text-[#8E8E8A]">
          Voici le fichier exact créé sous <code className="font-mono text-xs text-white">src/app/actions/register.ts</code>. Nous avons séparé ce qui est prêt à l&apos;emploi de ce que vous devez éditer vous-même :
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <CheckCircle2 size={14} className="text-[#FF6A00]" />
              <span>Ce qui est déjà configuré et prêt</span>
            </div>
            <ul className="text-xs text-[#8E8E8A] space-y-1 pl-5 list-disc leading-relaxed">
              <li>La directive obligatoire <code className="font-mono text-xs text-white">&apos;use server&apos;</code> de Next.js.</li>
              <li>Le wrapper sécurisé <code className="font-mono text-xs text-white">withServerAction()</code> de <code className="font-mono text-xs text-white">@serverpatterns/next</code>.</li>
              <li>La validation et l&apos;interception automatique des erreurs Zod (retourne un objet Result).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <Terminal size={14} className="text-[#FF6A00]" />
              <span>Ce que vous devez éditer (les TODO)</span>
            </div>
            <ul className="text-xs text-[#8E8E8A] space-y-1 pl-5 list-disc leading-relaxed">
              <li>Le schéma de validation <code className="font-mono text-xs text-white">schema</code> pour valider vos entrées de formulaires ou JSON payloads.</li>
              <li>La logique interne de l&apos;action <code className="font-mono text-xs text-white">action</code> (connexion base de données, hashes de sécurité, etc.).</li>
            </ul>
          </div>

          <CodeBlock
            code={`'use server';

import { withServerAction } from '@serverpatterns/next';
import { z } from 'zod';

// 1. MODIFIE CE SCHÉMA : Déclare l'exact payload attendu par l'action
const RegisterSchema = z.object({
  email: z.string().email("E-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

export const register = withServerAction({
  schema: RegisterSchema,
  action: async ({ body }) => {
    // 2. LOGIQUE DU SERVEUR : Écris ton action serveur sécurisée ici
    // Exemple : const user = await db.user.create({ ...body });
    
    return {
      success: true,
      userId: "usr_" + Math.random().toString(36).substring(7)
    };
  }
});`}
            title="src/app/actions/register.ts"
          />
        </div>
      </div>

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Link
          href="/docs/cli/add-api"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              serverpatterns add api
            </span>
          </div>
        </Link>

        <Link
          href="/docs/cli/configuration"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Configuration
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
