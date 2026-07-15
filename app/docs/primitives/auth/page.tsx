'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Lock, Key } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveAuthPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          withAuth &amp; createAuthWrapper()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Sécurisez vos Server Actions et fonctions serveurs de bout en bout grâce à un middleware d&apos;authentification et d&apos;autorisation hautement typé et unifié.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite-auth">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Lock size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Sécurité serveur par défaut</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          La gestion de l&apos;authentification et des permissions (RBAC, ABAC) dans les Server Actions de Next.js peut vite s&apos;avérer répétitive ou sujette à des failles si elle est oubliée. <code className="font-mono text-[#FF6A00]">withAuth</code> vous permet d&apos;intercepter tous les appels serveur en amont, de vérifier la session, d&apos;appliquer des gardes sur les rôles, d&apos;exécuter des vérifications fines d&apos;accès aux ressources, et de retourner un objet <code className="font-mono text-white text-xs">Result</code> sécurisé.
        </p>
      </section>

      {/* Configuration Options */}
      <section className="space-y-4" id="configuration-globale">
        <h2 className="font-display text-lg font-bold text-white">1. Configuration Globale du Wrapper</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Utilisez <code className="font-mono text-white">createAuthWrapper(config)</code> pour instancier un wrapper `withAuth` configuré spécifiquement pour votre fournisseur d&apos;authentification (Auth.js, Clerk, Supabase, Kinde, etc.) :
        </p>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-4 overflow-x-auto">
          <table className="min-w-full font-mono text-[11px] text-[#8E8E8A]">
            <thead>
              <tr className="border-b border-white/10 text-white">
                <th className="py-2 text-left">Option de Configuration</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">getSessionUser</td>
                <td className="py-2 pr-4 text-[#FF6A00]">() =&gt; Promise&lt;TUser | null&gt;</td>
                <td className="py-2">Fonction retournant la session ou l&apos;utilisateur connecté depuis votre auth provider.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">defaultUnauthorizedMessage</td>
                <td className="py-2 pr-4 text-[#FF6A00]">string</td>
                <td className="py-2">Message d&apos;erreur d&apos;authentification par défaut (HTTP 401).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">defaultForbiddenMessage</td>
                <td className="py-2 pr-4 text-[#FF6A00]">string</td>
                <td className="py-2">Message d&apos;erreur d&apos;autorisation ou de rôle insuffisant par défaut (HTTP 403).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Example: Setup */}
      <section className="space-y-4 pt-4" id="initialisation">
        <h2 className="font-display text-lg font-bold text-white">Création du Wrapper d&apos;Authentification</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Créez un fichier utilitaire d&apos;auth pour exporter votre instance configurée de <code className="font-mono text-[#FF6A00]">withAuth</code> :
        </p>
        <CodeBlock 
          code={`// src/lib/auth.ts
import { createAuthWrapper } from '@/lib/serverpatterns/auth';
import { getServerSession } from 'next-auth'; // ou Clerk, Supabase, Kinde
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
}

export const withAuth = createAuthWrapper<AppUser>({
  // Résolution globale de la session
  getSessionUser: async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    return session.user as AppUser;
  },
  defaultUnauthorizedMessage: 'Veuillez vous connecter pour effectuer cette action.',
  defaultForbiddenMessage: 'Accès interdit. Vous ne disposez pas des permissions requises.'
});`}
          title="src/lib/auth.ts"
        />
      </section>

      {/* Code Example: Usage */}
      <section className="space-y-4 pt-4" id="usage-actions">
        <h2 className="font-display text-lg font-bold text-white">2. Sécurisation des Actions Serveur</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Une fois instancié, vous pouvez appliquer des gardes de rôles ou d&apos;autorisation contextuelle complexes en encapsulant vos Server Actions :
        </p>
        <CodeBlock 
          code={`// src/app/actions/articles.ts
'use server';

import { withAuth } from '@/lib/auth';
import { z } from 'zod';

// Optionnel: Vous pouvez chaîner avec withServerAction pour valider d'abord le schéma Zod
export const deleteArticle = withAuth(
  {
    // 1. Gardien de rôle (RBAC) - l'utilisateur doit être admin ou editor
    roles: ['admin', 'editor'],

    // 2. Autorisation fine (ABAC) - l'utilisateur ne peut supprimer que ses propres articles (sauf s'il est admin)
    authorize: async (user, input: { articleId: string }) => {
      if (user.role === 'admin') return true;
      const article = await db.articles.getById(input.articleId);
      return article?.authorId === user.id;
    }
  },
  async ({ input, user }) => {
    // Les types d'input et de user sont entièrement déduits !
    await db.articles.delete(input.articleId);
    
    return { success: true, deletedBy: user.name };
  }
);`}
          title="src/app/actions/articles.ts"
        />
      </section>

      <Callout title="Monade Result unifiée" type="info">
        Tout comme les autres primitives de ServerPatterns, les actions enveloppées dans <code className="font-mono text-xs text-white">withAuth</code> renvoient un objet <code className="font-mono text-xs text-white">Result&lt;T, E&gt;</code> typé. Si l&apos;utilisateur n&apos;est pas connecté ou que son rôle est insuffisant, l&apos;action renvoie immédiatement un échec typé sans lever d&apos;exceptions non gérées côté client, simplifiant considérablement votre logique d&apos;affichage UI.
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/webhook"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              createWebhookHandler()
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/pagination"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              withPagination()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
