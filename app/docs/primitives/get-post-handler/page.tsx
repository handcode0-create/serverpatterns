'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveGetPostHandlerPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          createGetHandler &amp; createPostHandler
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Assurez une validation instantanée et impénétrable de vos Route Handlers HTTP de Next.js App Router grâce à une intégration native de Zod.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securite">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Shield size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Validation Zod en amont</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Les wrappers <code className="font-mono text-[#FF6A00]">createGetHandler</code> et <code className="font-mono text-[#FF6A00]">createPostHandler</code> agissent comme des gardiens pour vos endpoints d&apos;API de Next.js. Zod intercepte, valide et normalise les schémas entrants (comme le corps JSON, les paramètres URL ou les cookies) avant de déléguer l&apos;exécution à votre contrôleur local.
        </p>
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple de Route Handler complet</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Définissez un schéma et écrivez un contrôleur typé sans boilerplate d&apos;extraction ou de formattage d&apos;erreur manuel :
        </p>
        <CodeBlock 
          code={`import { createPostHandler } from '@serverpatterns/next';
import { z } from 'zod';

// POST /api/feedback
export const POST = createPostHandler({
  // validation stricte
  schema: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().max(500)
  }),
  handler: async ({ body, headers }) => {
    // body est automatiquement typé selon le schéma Zod !
    const feedbackId = await db.feedbacks.save(body.rating, body.comment);
    return {
      status: 201,
      body: { success: true, feedbackId }
    };
  }
});`}
          title="src/app/api/feedback/route.ts"
        />
      </section>

      <Callout title="Génération automatique d'erreur" type="info">
        En cas de payload non conforme, le wrapper intercepte immédiatement l&apos;appel et renvoie une réponse standardisée <code className="font-mono text-xs text-white">HTTP 400 Bad Request</code> incluant le détail des erreurs retourné par Zod. Votre code applicatif ne s&apos;exécute jamais pour des requêtes corrompues.
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
