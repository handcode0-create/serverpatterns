import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'Cache',
  description: 'withCache : cache TTL en mémoire qui ne garde jamais les erreurs.',
};

export default function CachePage() {
  return (
    <DocPage
      href="/docs/primitives/cache"
      source="app/docs/primitives/cache/page.tsx"
      title="withCache"
      lead="Enveloppe une fonction de lecture pour réutiliser son résultat pendant une durée donnée. Utile pour des données qui changent peu : taux de change, catalogue, configuration."
    >
      <h2>Signatures</h2>
      <CodeBlock
        title="@serverpatterns/core"
        code={`function withCache<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
  options: {
    ttlMs: number;                               // durée de vie d'une entrée
    store?: CacheStore;                          // défaut : createInMemoryCacheStore()
    keyFn?: (...args: unknown[]) => string;      // défaut : JSON.stringify(args)
    shouldCache?: (value: unknown) => boolean;   // défaut : tout sauf un Result en erreur
  }
): (...args: Args) => Promise<T>;

interface CacheStore {
  get(key: string): unknown | undefined;
  set(key: string, value: unknown, ttlMs: number): void;
}`}
      />
      <p>
        Un cache par jeu d’arguments : <code>getRates(&quot;XOF&quot;)</code> et <code>getRates(&quot;EUR&quot;)</code>{' '}
        sont mis en cache séparément.
      </p>

      <h2>Exemple</h2>
      <Example file="cache/lib/services/exchange-rates.ts" />

      <h2>Ce qui n’est pas mis en cache</h2>
      <ul>
        <li>
          Un <code>Result</code> en erreur (<code>{'{ success: false }'}</code>) : une panne passagère n’est pas
          resservie pendant toute la durée du cache, l’appel suivant réessaie.
        </li>
        <li>
          La valeur <code>undefined</code>. Pour changer la règle, passe ton propre <code>shouldCache</code>.
        </li>
      </ul>

      <Callout title="À ne pas utiliser pour" type="warning">
        Les mutations (POST, PUT, PATCH, DELETE) et les données propres à un utilisateur si la clé ne l’identifie pas.
        Le store par défaut est en mémoire : il est propre à chaque instance du serveur et vidé à chaque redémarrage.
        Le <code>CacheStore</code> étant synchrone, un store Redis demande d’adapter le code.
      </Callout>
    </DocPage>
  );
}
