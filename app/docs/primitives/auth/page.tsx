'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveAuthPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          withAuth()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Sécurisez vos Server Actions de bout en bout grâce à un middleware d&apos;authentification et d&apos;autorisation simple, typé et unifié.
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
          La sécurisation des Server Actions dans Next.js requiert de valider la session de l&apos;utilisateur avant d&apos;exécuter toute logique métier. La primitive <code className="font-mono text-[#FF6A00]">withAuth</code> permet d&apos;encapsuler cette logique de façon systématique.
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Elle s&apos;appuie sur une fonction d&apos;obtention de session fournie par le développeur (comme un appel à votre outil d&apos;auth préféré : Auth.js, Clerk, Kinde, Supabase), valide l&apos;input via un schéma Zod (<code className="font-mono text-xs text-white">inputSchema</code>), et injecte la session validée directement dans votre fonction métier.
        </p>
      </section>

      {/* Configuration Options */}
      <section className="space-y-4" id="signature">
        <h2 className="font-display text-lg font-bold text-white">Signature TypeScript Core</h2>
        <CodeBlock 
          code={`export interface AuthSession {
  userId: string;
  roles: string[];
}

export type GetSessionFn = () => Promise<AuthSession | null>;

export interface WithAuthOptions<TInput, TResult> {
  getSession: GetSessionFn;
  requiredRoles?: string[]; // RBAC — omis = toute session valide suffit, pas de contrainte de rôle
  inputSchema: z.ZodType<TInput>;
  action: (input: TInput, session: AuthSession) => Promise<Result<TResult, ServerPatternsError>>;
}

export function withAuth<TInput, TResult>(
  options: WithAuthOptions<TInput, TResult>
): (input: TInput) => Promise<Result<TResult, ServerPatternsError>>;`}
          title="@serverpatterns/next"
        />
      </section>

      {/* Code Example: Setup */}
      <section className="space-y-4 pt-4" id="initialisation">
        <h2 className="font-display text-lg font-bold text-white">1. Définir le résolveur de Session</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          En convention d&apos;architecture, implémentez la méthode d&apos;extraction de session dans <code className="font-mono text-xs text-white">lib/auth/session.ts</code> en respectant la signature <code className="font-mono text-xs text-white">AuthSession</code> :
        </p>
        <CodeBlock 
          code={`import { getServerSession } from "next-auth"; // ou Clerk, Supabase...
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthSession } from "@serverpatterns/next";

export async function getSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  
  return {
    userId: session.user.id,
    roles: session.user.roles ?? ["user"], // Garantit un tableau de rôles
  };
}`}
          title="lib/auth/session.ts"
        />
      </section>

      {/* Code Example: Usage */}
      <section className="space-y-4 pt-4" id="usage-actions">
        <h2 className="font-display text-lg font-bold text-white">2. Sécurisation des Actions Serveur avec RBAC</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Sécurisez vos opérations serveurs dans <code className="font-mono text-xs text-white">lib/actions/</code> grâce à un contrôle d&apos;accès basé sur les rôles (<strong className="text-white">requiredRoles</strong>) :
        </p>
        <CodeBlock 
          code={`"use server";
 
import { withAuth } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";
 
const deleteArticleSchema = z.object({
  articleId: z.string(),
});
 
export const deleteArticle = withAuth({
  inputSchema: deleteArticleSchema,
  getSession,
  requiredRoles: ["admin"], // Seuls les utilisateurs avec le rôle "admin" peuvent exécuter cette action
  action: async (input, session) => {
    // input est typé et garanti valide
    // session est typé selon AuthSession (contient userId et roles)
    try {
      const article = await db.articles.findById(input.articleId);
      if (!article) {
        return err(new ServerPatternsError("NOT_FOUND", "Article introuvable"));
      }

      await db.articles.delete(input.articleId);
      return ok({ success: true });
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Une erreur interne est survenue", { cause }));
    }
  }
});`}
          title="lib/actions/articles.ts"
        />
      </section>

      <Callout title="Monade Result unifiée" type="info">
        Tout comme les autres primitives, les actions enveloppées dans <code className="font-mono text-xs text-white">withAuth</code> renvoient un objet <code className="font-mono text-xs text-white">Result&lt;T, E&gt;</code> typé. Si l&apos;utilisateur n&apos;est pas connecté, l&apos;action renvoie immédiatement un échec d&apos;authentification standardisé sans lever d&apos;exceptions non gérées côté client, simplifiant considérablement votre logique d&apos;affichage UI.
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
              Signature Webhook HMAC
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
