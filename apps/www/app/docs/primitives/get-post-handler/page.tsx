'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Shield, ArrowRight } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveGetPostHandlerPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Route Handlers : create[Method]Handler
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Sécurisez, validez par Zod et encapsulez vos Route Handlers Next.js App Router dans un format d&apos;échange standardisé et infaillible.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Shield size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Validation Zod &amp; Réponses unifiées</h2>
          </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Les wrappers <code className="font-mono text-[#FF6A00]">createGetHandler</code>, <code className="font-mono text-[#FF6A00]">createPostHandler</code>, <code className="font-mono text-[#FF6A00]">createPutHandler</code>, <code className="font-mono text-[#FF6A00]">createPatchHandler</code>, et <code className="font-mono text-[#FF6A00]">createDeleteHandler</code> agissent comme des garde-fous pour vos endpoints d&apos;API. Zod valide automatiquement les searchParams entrants (<code className="font-mono text-xs text-white">querySchema</code>) ou le corps de la requête (<code className="font-mono text-xs text-white">bodySchema</code>).
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le handler utilisateur reçoit directement l&apos;entrée validée ainsi que l&apos;objet <code className="font-mono text-xs text-white">NextRequest</code> natif, puis doit retourner un objet <code className="font-mono text-xs text-white">Result</code> (<code className="font-mono text-xs text-white">ok(...)</code> ou <code className="font-mono text-xs text-white">err(...)</code>). Le wrapper gère lui-même la construction de la <code className="font-mono text-xs text-white">NextResponse</code> finale.
        </p>
      </section>

      {/* Code Example GET */}
      <section className="space-y-4 pt-4" id="exemples-get">
        <h2 className="font-display text-lg font-bold text-white">GET Handler (validation des Query Params)</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Pour les requêtes GET, utilisez <code className="font-mono text-xs text-white">querySchema</code> :
        </p>
        <CodeBlock 
          code={`import { createGetHandler } from "@serverpatterns/next";
import { ok, err, parsePaginationParams, paginateInMemory } from "@serverpatterns/core";
import { z } from "zod";

const paginationQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

// GET /api/users?page=1&pageSize=10
export const GET = createGetHandler({
  querySchema: paginationQuerySchema,
  handler: async (query, request) => {
    // query est typé { page?: string, pageSize?: string }
    const params = parsePaginationParams(query);
    const users = [{ id: "1", name: "Alice" }, { id: "2", name: "Bob" }];
    
    return ok(paginateInMemory(users, params));
  },
});`}
          title="src/app/api/users/route.ts"
        />
      </section>

      {/* Code Example POST */}
      <section className="space-y-4 pt-4" id="exemples-post">
        <h2 className="font-display text-lg font-bold text-white">POST/PUT/PATCH/DELETE (validation du corps JSON)</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Pour les méthodes modifiant des ressources, utilisez <code className="font-mono text-xs text-white">bodySchema</code> :
        </p>
        <CodeBlock 
          code={`import { createPostHandler } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import { z } from "zod";

const createFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500),
});

// POST /api/feedback
export const POST = createPostHandler({
  bodySchema: createFeedbackSchema,
  handler: async (body, request) => {
    // body est typé { rating: number, comment: string } et garanti validé par Zod !
    try {
      const feedbackId = await db.feedbacks.save(body.rating, body.comment);
      return ok({ success: true, feedbackId });
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Échec d'enregistrement", { cause }));
    }
  },
});`}
          title="src/app/api/feedback/route.ts"
        />
      </section>

      <Callout title="Génération automatique d'erreur" type="info">
        En cas de payload non conforme ou d&apos;erreur retournée par le handler, le wrapper intercepte l&apos;appel et renvoie une réponse standardisée incluant le détail des erreurs. Votre code métier ne s&apos;exécute jamais pour des requêtes corrompues, éliminant totalement les risques de plantage silencieux.
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/api-client"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              createApiClient()
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/server-action"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              withServerAction()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
