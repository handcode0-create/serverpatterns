'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveCachePage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          withCache()
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Accélérez vos requêtes de données lourdes ou lentes en enveloppant vos fonctions asynchrones d&apos;une couche de mise en cache ultra-performante.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <section className="space-y-4" id="mise-en-cache">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Zap size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Cache transparent &amp; Extensible</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          La fonction d&apos;ordre supérieur (Higher-Order Function) <code className="font-mono text-[#FF6A00]">withCache</code> permet de mémoïser de façon asynchrone le résultat d&apos;appels à des bases de données ou à des APIs tierces. Par défaut, elle utilise un stockage mémoire interne (<code className="font-mono text-xs text-white">createInMemoryCacheStore()</code>) et définit une interface standardisée (<code className="font-mono text-xs text-white">CacheStore</code>) pour y coupler Redis ou Memcached en production.
        </p>
      </section>

      {/* Signatures */}
      <section className="space-y-4 pt-4" id="signatures">
        <h2 className="font-display text-lg font-bold text-white">Interface &amp; Signature Core</h2>
        <CodeBlock 
          code={`export interface CacheStore {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
}

export interface WithCacheOptions {
  store?: CacheStore; // défaut: créé via createInMemoryCacheStore()
  ttlMs: number; // durée de vie en millisecondes
}

export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: WithCacheOptions
): (...args: TArgs) => Promise<TResult>;
export function createInMemoryCacheStore(): CacheStore;`}
          title="@serverpatterns/core"
        />
      </section>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple d&apos;utilisation dans vos services</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici comment optimiser un service de récupération de météo ou d&apos;articles de blog lourds :
        </p>
        <CodeBlock 
          code={`import { withCache, createInMemoryCacheStore } from "@serverpatterns/core";

interface WeatherData {
  temp: number;
  condition: string;
}

// Fonction lente d'origine
async function fetchWeatherFromThirdParty(city: string): Promise<WeatherData> {
  const response = await fetch(\`https://api.weather.com/v1/\${city}\`);
  return response.json();
}

// Version optimisée avec cache (durée de vie : 10 minutes)
export const getCachedWeather = withCache(fetchWeatherFromThirdParty, {
  ttlMs: 10 * 60 * 1000, // 10 minutes (600 000 ms)
});

// Utilisation transparente :
// Le premier appel interrogera l'API externe,
// les appels suivants dans la limite des 10 minutes renverront le cache instantanément.
const londonWeather = await getCachedWeather("london");`}
          title="src/lib/services/weather.ts"
        />
      </section>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/primitives/rate-limiter"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              createRateLimiter()
            </span>
          </div>
        </Link>

        <Link
          href="/docs/cli/setup"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              CLI : Introduction &amp; Configuration
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
