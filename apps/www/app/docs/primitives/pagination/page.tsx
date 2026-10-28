'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitivePaginationPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Pagination : Helpers Utilitaires
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Traitez, filtrez et paginez vos collections de données de façon unifiée grâce à des utilitaires de formatage simples et efficaces.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite-pagination">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <ListOrdered size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Trois fonctions simples</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Plutôt que d&apos;imposer un wrapper complexe, ServerPatterns fournit trois fonctions unitaires dans <code className="font-mono text-xs text-white">@serverpatterns/core</code> pour extraire les paramètres de pagination, paginer en mémoire si besoin, et sérialiser les réponses paginées au bon format.
        </p>
      </section>

      {/* Signatures */}
      <section className="space-y-4 pt-4" id="signatures">
        <h2 className="font-display text-lg font-bold text-white">Signatures des Helpers</h2>
        <CodeBlock 
          code={`export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Analyse et normalise les query params de pagination (page, pageSize)
export function parsePaginationParams(queryValue: unknown): PaginationParams;

// Pagine une liste d'éléments en mémoire locale
export function paginateInMemory<T>(items: T[], params: PaginationParams): PaginatedResult<T>;

// Construit une NextResponse standardisée pour l'API
export function createPaginatedResponse<T>(result: PaginatedResult<T>): NextResponse;`}
          title="@serverpatterns/core"
        />
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple d&apos;utilisation complet</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici comment utiliser ces helpers au sein d&apos;un Route Handler Next.js :
        </p>
        <CodeBlock 
          code={`import { createGetHandler } from "@serverpatterns/next";
import { parsePaginationParams, paginateInMemory, ok } from "@serverpatterns/core";
import { z } from "zod";

const usersQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

// GET /api/users?page=1&pageSize=10
export const GET = createGetHandler({
  querySchema: usersQuerySchema,
  handler: async (query) => {
    // 1. Extraire et normaliser les paramètres (valeurs par défaut appliquées)
    const params = parsePaginationParams(query);
    
    // 2. Récupérer les données brutes
    const allUsers = await db.users.findMany();
    
    // 3. Pagnier en mémoire
    const paginated = paginateInMemory(allUsers, params);
    
    // 4. Retourner le résultat encapsulé
    return ok(paginated);
  }
});`}
          title="src/app/api/users/route.ts"
        />
      </section>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/auth"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              withAuth()
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/rate-limiter"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              createRateLimiter()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
