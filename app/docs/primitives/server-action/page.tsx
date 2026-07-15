'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Zap } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveServerActionPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          withServerAction()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Sécurisez vos Server Actions Next.js côté serveur contre les injections en validant les payloads à l&apos;exécution avec Zod.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="securisation">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Zap size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Sécurisez vos Server Actions</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Les Server Actions Next.js facilitent l&apos;écriture de contrôleurs directement appelables depuis vos formulaires client. Cependant, puisqu&apos;il s&apos;agit de simples requêtes POST HTTP déguisées, elles doivent faire l&apos;objet d&apos;un audit strict côté serveur.
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          <code className="font-mono text-[#FF6A00]">withServerAction</code> intercepte le payload (qu&apos;il s&apos;agisse de JSON classique ou de FormData natif de formulaires), exécute la validation Zod côté serveur et renvoie systématiquement un objet Result unifié pour une intégration client sans friction.
        </p>
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple de Server Action de base de données</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Déclarez une action sécurisée en base de données et utilisez-la directement dans vos interfaces de formulaires :
        </p>
        <CodeBlock 
          code={`'use server';

import { withServerAction } from '@serverpatterns/next';
import { z } from 'zod';

export const updateUsername = withServerAction({
  schema: z.object({
    userId: z.string(),
    newUsername: z.string().min(3).max(20)
  }),
  action: async ({ body }) => {
    // body est garanti valide et typé !
    const ok = await db.users.updateName(body.userId, body.newUsername);
    if (!ok) {
      throw new Error("Impossible de renommer l'utilisateur");
    }
    return { updated: true };
  }
});`}
          title="src/app/actions/user.ts"
        />
      </section>

      <Callout title="Zod &amp; FormData" type="recommendation">
        Le wrapper <code className="font-mono text-xs text-white">withServerAction</code> prend en charge l&apos;extraction des valeurs depuis les formulaires natifs (<code className="font-mono text-xs text-white">FormData</code>) de façon transparente, vous évitant d&apos;appeler manuellement <code className="font-mono text-xs text-white">formData.get()</code> pour chaque champ.
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-start items-center pt-4">
        <Link
          href="/docs/primitives/get-post-handler"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              createGetHandler / createPostHandler
            </span>
          </div>
        </Link>
      </div>

    </div>
  );
}
