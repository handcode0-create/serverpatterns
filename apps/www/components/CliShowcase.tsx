'use client';

import {useState} from 'react';
import Terminal from '@/components/Terminal';
import {cliTranscripts} from '@/lib/cli-transcripts';

const STEPS = [
  {
    id: 'init',
    command: 'npx @serverpatterns/cli init',
    title: 'Préparer le projet',
    text: 'Installe les trois dépendances et crée lib/api et lib/actions, ou src/lib si ton projet utilise src/.',
    transcript: cliTranscripts.init,
  },
  {
    id: 'api',
    command: 'npx @serverpatterns/cli add api users',
    title: 'Ajouter une ressource',
    text: 'Un client vers ton API externe et deux Route Handlers : la collection et l’élément [id].',
    transcript: cliTranscripts.addApi,
  },
  {
    id: 'action',
    command: 'npx @serverpatterns/cli add action update-stock',
    title: 'Ajouter une Server Action',
    text: 'Le schéma Zod se construit champ par champ ; avec des rôles, l’action est protégée par withAuth.',
    transcript: cliTranscripts.addAction,
  },
] as const;

export default function CliShowcase() {
  const [active, setActive] = useState<(typeof STEPS)[number]['id']>('api');
  const step = STEPS.find((item) => item.id === active) ?? STEPS[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10">
      <ol className="space-y-2">
        {STEPS.map((item, index) => {
          const selected = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                aria-pressed={selected}
                className={`w-full rounded-[10px] border px-4 py-3.5 text-left transition-colors ${
                  selected ? 'border-accent/60 bg-accent/[0.06]' : 'border-line hover:border-line-strong'
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className={`font-mono text-[0.8125rem] ${selected ? 'text-accent' : 'text-muted'}`}>{index + 1}</span>
                  <span className="font-display text-[1.0625rem] font-semibold text-text">{item.title}</span>
                </span>
                <span className="mt-1.5 block pl-6 text-[0.9375rem] leading-snug text-muted">{item.text}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div key={step.id} className="min-w-0 motion-safe:animate-[fade_180ms_ease-out]">
        <Terminal command={step.command} transcript={step.transcript} />
      </div>
    </div>
  );
}
