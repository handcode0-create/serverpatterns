'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';

export default function PrimitiveResultPage() {
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
          Result&lt;T, E&gt; : Monade de Retour
        </h1>
        <p className="text-base text-[#8E8E8A] leading-relaxed">
          Un standard immuable de typage de retour qui élimine la propagation non contrôlée des erreurs et force une gestion explicite de tous vos scénarios.
        </p>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Philosophy */}
      <section className="space-y-4" id="philosophie">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
            <Layers size={18} />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Pourquoi interdire le throw d&apos;erreurs ?</h2>
        </div>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le mot-clé <code className="font-mono text-[#FF6A00]">throw</code> court-circuite le flux d&apos;exécution classique sans déclarer formellement son intention au niveau de la signature du type. En TypeScript, un appel asynchrone qui lève une exception renvoie simplement <code className="font-mono text-xs text-white">Promise&lt;T&gt;</code>, masquant le fait qu&apos;elle peut échouer de façon dramatique à l&apos;exécution.
        </p>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          En remplaçant les exceptions par la monade <code className="font-mono text-xs text-white">Result&lt;T, E&gt;</code>, vous éradiquez totalement l&apos;incertitude : chaque fonction asynchrone déclare formellement ses échecs attendus, obligeant le développeur à gérer tous les scénarios de façon fluide et structurée.
        </p>
      </section>

      {/* Signature */}
      <section className="space-y-4 pt-4" id="signature">
        <h2 className="font-display text-lg font-bold text-white">Signature TypeScript Core</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Voici la signature de type de la primitive distribuée dans notre package de base :
        </p>
        <CodeBlock 
          code={`export type Result<T, E = ServerPatternsError> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<T, never>;
export function err<E>(error: E): Result<never, E>;

export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T };
export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E };

export function mapResult<T, U, E>(
  result: Result<T, E>,
  transform: (data: T) => U
): Result<U, E>;

export function unwrap<T, E>(result: Result<T, E>): T;`}
          title="@serverpatterns/core"
        />
      </section>

      <section className="space-y-4 pt-4" id="server-patterns-error">
        <h2 className="font-display text-lg font-bold text-white">Gestion d&apos;erreur standardisée</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Le framework fournit une classe d&apos;erreur unifiée <code className="font-mono text-xs text-white">ServerPatternsError</code> contenant des codes standardisés pour typifier vos échecs :
        </p>
        <CodeBlock 
          code={`export type ServerPatternsErrorCode =
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

export class ServerPatternsError extends Error {
  public readonly code: ServerPatternsErrorCode;
  public readonly cause?: unknown;
  public readonly status: number | undefined;

  constructor(
    code: ServerPatternsErrorCode,
    message: string,
    options?: { cause?: unknown; status?: number }
  );
}`}
          title="@serverpatterns/core"
        />
      </section>

      <Callout title="Règle de Typage" type="recommendation">
        Pour garder des signatures de type hautement expressives, utilisez la classe <code className="font-mono text-xs text-white">ServerPatternsError</code>. Elle vous permet d&apos;embarquer le code d&apos;erreur, la cause sous-jacente (par exemple l&apos;exception d&apos;origine d&apos;un ORM) et un code de statut HTTP.
      </Callout>

      {/* Code Example */}
      <section className="space-y-4 pt-4" id="exemples">
        <h2 className="font-display text-lg font-bold text-white">Exemple d&apos;utilisation dans vos services</h2>
        <p className="text-xs text-[#8E8E8A] leading-relaxed">
          Déclarez de vrais services et contrôlez chaque échec attendu de façon explicite :
        </p>
        <CodeBlock 
          code={`import { Result, ok, err, ServerPatternsError } from '@serverpatterns/core';

interface Product { id: string; price: number; }

export async function fetchProduct(id: string): Promise<Result<Product, ServerPatternsError>> {
  try {
    const product = await db.products.findById(id);
    if (!product) {
      return err(new ServerPatternsError("NOT_FOUND", "Produit introuvable", { status: 404 }));
    }
    return ok(product);
  } catch (cause) {
    return err(new ServerPatternsError("SERVER_ERROR", "Erreur lors de la récupération", { cause }));
  }
}`}
          title="src/lib/services/products.ts"
        />
      </section>

      <div className="h-[1px] bg-white/10 pt-4" />

      {/* Navigation Précédent / Suivant */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs/changelog"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-left transition-all flex items-center gap-3 select-none"
        >
          <ChevronLeft size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Précédent
            </span>
            <span className="block text-xs font-bold text-white">
              Changelog
            </span>
          </div>
        </Link>

        <Link
          href="/docs/primitives/api-client"
          className="group border border-white/5 bg-[#121212]/50 hover:border-[#FF6A00]/20 hover:bg-[#FF6A00]/5 p-4 rounded-xl text-right transition-all flex items-center gap-3 select-none"
        >
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors">
              Suivant
            </span>
            <span className="block text-xs font-bold text-white">
              createApiClient()
            </span>
          </div>
          <ChevronRight size={16} className="text-[#8E8E8A] group-hover:text-[#FF6A00] transition-colors" />
        </Link>
      </div>

    </div>
  );
}
