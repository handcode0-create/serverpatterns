import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'Rate limiting',
  description: 'createRateLimiter à fenêtre fixe, avec un store mémoire ou le tien (Redis).',
};

export default function RateLimiterPage() {
  return (
    <DocPage
      href="/docs/primitives/rate-limiter"
      source="app/docs/primitives/rate-limiter/page.tsx"
      lead="Limite le nombre de requêtes par clé (adresse IP, identifiant utilisateur) sur une période donnée, pour freiner les abus comme les tentatives de connexion en rafale."
    >
      <h2>Signatures</h2>
      <CodeBlock
        title="@serverpatterns/core"
        code={`function createRateLimiter(options: {
  limit: number;           // requêtes autorisées par fenêtre
  windowMs: number;        // durée de la fenêtre, en millisecondes
  store?: RateLimitStore;  // défaut : createInMemoryRateLimitStore()
}): RateLimiter;

interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;         // timestamp (ms) de fin de la fenêtre en cours
}

// Le contrat à implémenter pour brancher ton propre stockage
interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}`}
      />
      <p>
        L’algorithme est une <strong>fenêtre fixe</strong> : la fenêtre démarre à la première requête d’une clé et le
        compteur repart à zéro quand elle expire. Chaque appel à <code>check</code> compte comme une requête, même
        refusée.
      </p>

      <h2>Exemple : connexion</h2>
      <Example file="rate-limiter/app/api/auth/login/route.ts" />
      <p>
        Il n’existe pas de code d’erreur dédié au dépassement : fixe <code>status: 429</code> sur l’erreur pour que le
        Route Handler réponde avec le bon statut HTTP.
      </p>

      <h2>Plusieurs instances : brancher Redis</h2>
      <Callout title="Le store par défaut est local à chaque instance" type="warning">
        <code>createInMemoryRateLimitStore</code> garde les compteurs dans la mémoire du processus. Sur Vercel ou tout
        hébergement à plusieurs instances, chaque instance a ses propres compteurs et la limite réelle est multipliée.
        Il est aussi remis à zéro à chaque redémarrage.
      </Callout>
      <p>Pour une limite partagée, implémente <code>RateLimitStore</code> avec un stockage commun :</p>
      <Example file="rate-limiter/lib/rate-limit/redis-store.ts" />
      <CodeBlock
        title="Utilisation"
        code={`const limiter = createRateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1000,
  store: createRedisRateLimitStore(redis),
});`}
      />
    </DocPage>
  );
}
