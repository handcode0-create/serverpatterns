import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'Result et erreurs',
  description: 'Result<T, E>, ok, err, isOk, isErr, mapResult, unwrap et ServerPatternsError.',
};

export default function ResultPage() {
  return (
    <DocPage
      href="/docs/primitives/result"
      source="app/docs/primitives/result/page.tsx"
      title="Result et ServerPatternsError"
      lead="Toutes les primitives de ServerPatterns renvoient un Result : un objet qui contient soit la donnée, soit l’erreur. L’appelant voit dans le type qu’un échec est possible et doit le traiter."
    >
      <h2>Pourquoi pas throw</h2>
      <p>
        Une fonction qui lève une exception a pour type <code>Promise&lt;T&gt;</code> : rien ne signale qu’elle peut
        échouer. Avec <code>Result</code>, l’échec fait partie du type de retour, et TypeScript t’oblige à vérifier{' '}
        <code>success</code> avant d’accéder à <code>data</code>.
      </p>
      <p>
        Les exceptions restent utiles pour l’imprévu (un bug, une panne). Les wrappers de <code>@serverpatterns/next</code>{' '}
        les rattrapent et les transforment en erreur <code>UNKNOWN_ERROR</code>.
      </p>

      <h2>Signatures</h2>
      <CodeBlock
        title="@serverpatterns/core"
        code={`type Result<T, E = ServerPatternsError> =
  | { success: true; data: T }
  | { success: false; error: E };

function ok<T>(data: T): Result<T, never>;
function err<E>(error: E): Result<never, E>;
function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T };
function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E };

// Transforme la donnée d'un succès, laisse l'erreur intacte
function mapResult<T, U, E>(result: Result<T, E>, transform: (data: T) => U): Result<U, E>;

// Renvoie la donnée ou lève l'erreur : pour les scripts et les tests uniquement
function unwrap<T, E>(result: Result<T, E>): T;`}
      />

      <h2>ServerPatternsError</h2>
      <CodeBlock
        title="@serverpatterns/core"
        code={`type ServerPatternsErrorCode =
  | "VALIDATION_ERROR"   // entrée invalide (400)
  | "UNAUTHORIZED"       // session absente ou rôle insuffisant (401)
  | "NOT_FOUND"          // ressource introuvable (404)
  | "NETWORK_ERROR"      // timeout, API injoignable (502)
  | "SERVER_ERROR"       // échec côté serveur ou API distante (500)
  | "UNKNOWN_ERROR";     // exception imprévue rattrapée par un wrapper (500)

class ServerPatternsError extends Error {
  readonly code: ServerPatternsErrorCode;
  readonly status: number | undefined; // statut HTTP à utiliser, s'il est imposé
  readonly cause?: unknown;            // erreur d'origine (ORM, fetch…)
  readonly details: unknown;           // corps de la réponse d'une API distante en erreur

  constructor(
    code: ServerPatternsErrorCode,
    message: string,
    options?: { cause?: unknown; status?: number; details?: unknown }
  );
}`}
      />
      <p>
        Les statuts entre parenthèses sont ceux qu’appliquent les Route Handlers quand <code>status</code> n’est pas
        défini. <code>cause</code> et <code>details</code> servent à tes logs : ils ne sont jamais renvoyés au client.
      </p>

      <h2>Dans un service</h2>
      <Example file="result/lib/services/products.ts" />

      <h2>Dans une page</h2>
      <Example file="result/app/products/[id]/page.tsx" />

      <h2>mapResult et unwrap</h2>
      <Example file="result/lib/services/helpers.ts" />
    </DocPage>
  );
}
