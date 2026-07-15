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
          withPagination()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Standardisez, sécurisez et simplifiez les requêtes paginées à travers vos Route Handlers et Server Actions de façon fluide et robuste.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite-pagination">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <ListOrdered size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Pagination Unifiée</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Qu&apos;il s&apos;agisse de pagination par numéros de page (Offset) ou par jeton (Cursor-based), le wrapper <code className="font-mono text-[#FF6A00]">withPagination</code> standardise les paramètres entrants, impose des limites saines (maxLimit) pour éviter le déni de service, et enveloppe automatiquement les résultats dans la monade standard <code className="font-mono text-white">Result&lt;Paginated&lt;T&gt;, Error&gt;</code>.
        </p>
      </section>

      {/* Configuration Options */}
      <section className="space-y-4" id="configuration">
        <h2 className="font-display text-lg font-bold text-white">Options de Configuration</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Vous pouvez affiner le comportement par défaut de la pagination en passant des options :
        </p>
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-4 overflow-x-auto">
          <table className="min-w-full font-mono text-[11px] text-[#8E8E8A]">
            <thead>
              <tr className="border-b border-white/10 text-white">
                <th className="py-2 text-left">Option</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">defaultLimit</td>
                <td className="py-2 pr-4 text-[#FF6A00]">number</td>
                <td className="py-2">Nombre d&apos;éléments par défaut par page s&apos;il n&apos;est pas fourni (Défaut : <code className="text-white">10</code>).</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-semibold">maxLimit</td>
                <td className="py-2 pr-4 text-[#FF6A00]">number</td>
                <td className="py-2">Limite maximale autorisée pour prévenir les requêtes d&apos;extraction massive (Défaut : <code className="text-white">100</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple d&apos;Usage complet avec Prisma / Drizzle</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici comment déclarer une fonction de requêtage paginée côté serveur à l&apos;aide de <code className="font-mono text-[#FF6A00]">withPagination</code> :
        </p>
        <CodeBlock 
          code={`import { withPagination, getPaginationFromRequest } from '@/lib/serverpatterns/pagination';
import { db } from '@/lib/db';

// 1. Déclarer la fonction paginée
export const getPaginatedProducts = withPagination(
  async ({ params, input }: { params: any; input: { category?: string } }) => {
    const { limit, offset } = params;

    // Requête vers votre BDD
    const [items, total] = await Promise.all([
      db.product.findMany({
        where: { category: input.category },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      db.product.count({
        where: { category: input.category }
      })
    ]);

    return { items, total };
  },
  { defaultLimit: 12, maxLimit: 48 }
);

// 2. Exemple d'utilisation dans un Route Handler Next.js
export async function GET(req: Request) {
  // Extraction des paramètres HTTP standard (?page=2&limit=12)
  const paginationParams = getPaginationFromRequest(req);
  
  const result = await getPaginatedProducts(paginationParams, { category: 'electronics' });

  if (result.ok) {
    return Response.json(result.value);
  } else {
    return Response.json({ error: result.error.message }, { status: 500 });
  }
}`}
          title="src/app/api/products/route.ts"
        />
      </section>

      <Callout title="Payload de retour standardisé" type="info">
        La monade renvoyée contient un objet de données avec la structure suivante :
        <pre className="mt-2 text-[11px] font-mono text-white leading-relaxed">
{`{
  items: T[],
  pagination: {
    page: number,
    limit: number,
    offset: number,
    total: number,
    totalPages: number,
    hasMore: boolean
  }
}`}
        </pre>
      </Callout>

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
          href="/docs/primitives/idempotency"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              withIdempotency()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
