'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveRateLimiterPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          createRateLimiter()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Protégez vos endpoints d&apos;API contre les abus et les attaques par force brute grâce à un limiteur de débit performant et extensible.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="limitation-debit">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <ShieldAlert size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Limitation robuste &amp; Stores interchangeables</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          La primitive <code className="font-mono text-[#FF6A00]">createRateLimiter</code> permet de définir des limites strictes de requêtes sur une fenêtre de temps donnée. Elle est livrée par défaut avec un stockage en mémoire (<code className="font-mono text-xs text-white">MemoryRateLimitStore</code>) et définit un contrat simple (<code className="font-mono text-xs text-white">RateLimitStore</code>) pour brancher facilement Redis ou tout autre système de persistance distribué.
        </p>
      </section>

      {/* Signatures */}
      <section className="space-y-4 pt-4" id="signatures">
        <h2 className="font-display text-lg font-bold text-white">Interface &amp; Signature Core</h2>
        <CodeBlock 
          code={`export interface RateLimitStore {
  get(key: string): Promise<{ count: number; resetTime: number }>;
  increment(key: string, ttlMs: number): Promise<void>;
}

export interface RateLimiterConfig {
  store?: RateLimitStore; // défaut: MemoryRateLimitStore
  limit: number; // nombre de requêtes autorisées
  windowMs: number; // fenêtre de temps en millisecondes
  keyPrefix?: string; // préfixe des clés dans le store
}

export function createRateLimiter(config: RateLimiterConfig): (key: string) => Promise<
  Result<{
    limit: number;
    remaining: number;
    reset: number;
  }, ServerPatternsError>
>;`}
          title="@serverpatterns/core"
        />
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple d&apos;utilisation dans un Route Handler</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Instanciez votre limiteur et appliquez-le sur des clés identifiant de manière unique le client (par exemple, son adresse IP ou son ID utilisateur) :
        </p>
        <CodeBlock 
          code={`import { createPostHandler } from "@serverpatterns/next";
import { createRateLimiter, isErr, ok, err, ServerPatternsError } from "@serverpatterns/core";
import { z } from "zod";

// Limite : 100 requêtes toutes les 15 minutes
const loginLimiter = createRateLimiter({
  limit: 100,
  windowMs: 15 * 60 * 1000,
  keyPrefix: "login-limit:"
});

export const POST = createPostHandler({
  bodySchema: z.object({ email: z.string().email(), password: z.string() }),
  handler: async (body, request) => {
    // 1. Déterminer une clé d'identification (ex: adresse IP)
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    // 2. Vérifier la limite de débit
    const limitCheck = await loginLimiter(ip);
    if (isErr(limitCheck)) {
      return err(new ServerPatternsError("SERVER_ERROR", "Échec de vérification du limiteur"));
    }

    const { remaining, limit, reset } = limitCheck.data;
    if (remaining < 0) {
      return err(new ServerPatternsError("UNAUTHORIZED", "Trop de tentatives. Veuillez réessayer plus tard.", { status: 429 }));
    }

    // 3. Procéder à l'authentification
    const authResult = await db.users.authenticate(body.email, body.password);
    return ok(authResult);
  }
});`}
          title="src/app/api/auth/login/route.ts"
        />
      </section>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/pagination"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Pagination
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/cache"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              withCache()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
