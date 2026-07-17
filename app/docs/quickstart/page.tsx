'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Zap, CheckCircle } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function DocsQuickstart() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Quickstart (10 minutes)
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Découvrez en 10 minutes comment chaîner Result, createPostHandler et createApiClient pour une architecture Next.js irréprochable.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Goal */}
      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2" id="objectif">
        <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
          <Zap size={16} className="text-[#FF6A00]" />
          <span>Objectif de ce guide</span>
        </h3>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Nous allons construire un flux de création de tâche de bout en bout :
        </p>
        <ul className="text-xs text-[#8E8E8A] font-mono space-y-1.5 pl-4 list-decimal">
          <li>Écrire un service robuste qui retourne un type <strong className="text-white">Result&lt;Task, Error&gt;</strong>.</li>
          <li>Créer un Route Handler <strong className="text-white">POST</strong> Next.js qui valide l&apos;entrée avec Zod.</li>
          <li>Consommer cette API côté client de façon entièrement typée avec le client d&apos;API.</li>
        </ul>
      </div>

      {/* Step 1 */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-white" id="service-monadique">
          Étape 1 : Le Service Monadique (Result)
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Nous créons un service asynchrone pour stocker les tâches. Au lieu de lever des exceptions globales en cas de doublon, nous retournons un objet unifié :
        </p>
        <CodeBlock 
          code={`// src/lib/services/tasks.ts
import { Result, ok, err } from '@serverpatterns/core';

export interface Task { id: string; title: string; done: boolean; }

export async function saveTask(title: string): Promise<Result<Task, Error>> {
  if (title.toLowerCase() === 'admin') {
    return err(new Error("Le titre 'admin' est réservé au système."));
  }

  const newTask: Task = {
    id: Math.random().toString(36).substring(7),
    title,
    done: false
  };

  return ok(newTask);
}`}
          title="src/lib/services/tasks.ts"
        />
      </div>

      {/* Step 2 */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-white" id="route-handler">
          Étape 2 : Le Route Handler sécurisé (Zod validation)
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Nous créons un Route Handler standard. Grâce à <code className="font-mono text-xs text-white">createPostHandler()</code>, les données entrantes (JSON payload) sont automatiquement validées par Zod avant d&apos;appeler le service :
        </p>
        <CodeBlock 
          code={`// src/app/api/tasks/route.ts
import { createPostHandler } from '@serverpatterns/next';
import { saveTask } from '@/lib/services/tasks';
import { z } from 'zod';
import { ok, err, ServerPatternsError } from '@serverpatterns/core';

export const POST = createPostHandler({
  // Zod analyse le JSON d'entrée automatiquement
  bodySchema: z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères.")
  }),
  
  handler: async (body) => {
    const result = await saveTask(body.title);
    
    if (!result.success) {
      return err(new ServerPatternsError("VALIDATION_ERROR", result.error.message, { status: 400 }));
    }

    return ok(result.data);
  }
});`}
          title="src/app/api/tasks/route.ts"
        />
      </div>

      <Callout title="Bénéfice immédiat" type="recommendation">
        Grâce à <code className="font-mono text-xs text-white">createPostHandler()</code>, les requêtes malformées n&apos;atteignent jamais votre base de données. Le typage statique extrait de Zod est propagé de manière transparente vers l&apos;API client.
      </Callout>

      {/* Step 3 */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-white" id="consommation-client">
          Étape 3 : Consommer le endpoint côté client
        </h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Maintenant, utilisez l&apos;API Client typé depuis vos composants clients React. Il n&apos;y a aucun try/catch et la réponse renvoie un type Result natif :
        </p>
        <CodeBlock 
          code={`'use client';
// src/components/CreateTaskForm.tsx
import { api } from '@/lib/api';
import { useState } from 'react';

export default function CreateTaskForm() {
  const [title, setTitle] = useState('');

  const handleSubmit = async () => {
    // Entièrement typé de bout en bout
    const res = await api.post<Task>('/api/tasks', { title });

    if (!res.success) {
      console.error("Erreur de requête: " + res.error.message);
      return;
    }

    console.log(\`Tâche créée avec succès ! ID: \${res.data.id}\`);
  };

  return (
    <div className="flex gap-2">
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={handleSubmit}>Créer</button>
    </div>
  );
}`}
          title="src/components/CreateTaskForm.tsx"
        />
      </div>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/installation"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Installation
            </span>
          </div>
        </Link>

        <Link
          href="/docs/guide-feedback-board"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              Guide Canonique 🏆
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
