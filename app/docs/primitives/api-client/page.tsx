'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Network } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveApiClientPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          createApiClient(config)
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Générez un client d&apos;API unifié, léger et hautement typé, capable de traduire les codes HTTP bruts en objets Result structurés.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="fonctionnement">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Network size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Client HTTP unifié et sûr</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          La méthode <code className="font-mono text-[#FF6A00]">createApiClient</code> élimine l&apos;écriture de wrappers de requêtes `fetch` redondants dans vos composants React. Elle configure de manière centralisée les entêtes (headers), intercepte les requêtes pour injecter des tokens d&apos;authentification de façon dynamique, et retourne des réponses encapsulées dans notre monade de succès ou d&apos;échec.
        </p>
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple de configuration et d&apos;appels</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Créez une seule instance d&apos;API client et utilisez-la indifféremment sur l&apos;ensemble de vos pages client :
        </p>
        <CodeBlock 
          code={`import { createApiClient } from '@serverpatterns/core';

export const api = createApiClient({
  baseUrl: '/api',
  headers: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: \`Bearer \${token}\` } : {};
  }
});

// Appels réseau fluides et sécurisés :
interface User { id: string; name: string; }

async function loadProfile() {
  const res = await api.get<User>('/user/profile');
  if (res.isErr()) {
    console.error("Erreur profile:", res.error.message);
    return;
  }
  
  // res.value est maintenant garanti de type User !
  console.log("Bienvenue", res.value.name);
}`}
          title="src/lib/api.ts"
        />
      </section>

      <Callout title="Sécurité et Hydratation" type="recommendation">
        Pour éviter des erreurs d&apos;hydratation (Hydration Mismatch) lors du rendu côté serveur, l&apos;injecteur de header effectue une vérification automatique de l&apos;environnement de l&apos;appel (<code className="font-mono text-xs text-white">typeof window !== &apos;undefined&apos;</code>).
      </Callout>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/result"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Result&lt;T, E&gt;
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/get-post-handler"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              createGetHandler / createPostHandler
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
