import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'Pagination',
  description: 'parsePaginationParams, createPaginatedResult et paginateInMemory.',
};

export default function PaginationPage() {
  return (
    <DocPage
      href="/docs/primitives/pagination"
      source="app/docs/primitives/pagination/page.tsx"
      lead="Trois fonctions pour paginer n’importe quelle liste, quelle que soit ta source de données : lire les paramètres de l’URL sans risque, puis construire une réponse au format commun."
    >
      <h2>Signatures</h2>
      <CodeBlock
        title="@serverpatterns/core"
        code={`interface PaginationParams {
  page: number;      // 1 au minimum
  pageSize: number;
}

interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;      // 1 au minimum, même si la liste est vide
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Lit page et pageSize depuis des paramètres bruts (chaînes)
function parsePaginationParams(
  query: Record<string, string | undefined>,
  options?: { defaultPageSize?: number; maxPageSize?: number } // défauts : 20 et 100
): PaginationParams;

// Construit le résultat à partir d'une page déjà chargée et du nombre total d'éléments
function createPaginatedResult<T>(items: T[], totalItems: number, params: PaginationParams): PaginatedResult<T>;

// Découpe une liste complète déjà en mémoire
function paginateInMemory<T>(allItems: T[], params: PaginationParams): PaginatedResult<T>;`}
      />
      <p>
        <code>parsePaginationParams</code> ne renvoie jamais de valeur dangereuse : une page négative, nulle ou non
        numérique devient 1, une taille invalide prend la valeur par défaut, et une taille trop grande est ramenée à{' '}
        <code>maxPageSize</code>. Les décimales sont arrondies vers le bas.
      </p>

      <h2>Depuis une base de données</h2>
      <p>
        Charge seulement la page demandée et compte le total à part, puis assemble avec <code>createPaginatedResult</code> :
      </p>
      <Example file="pagination/app/api/orders/route.ts" />

      <h2>En mémoire</h2>
      <p>Pour une petite liste déjà chargée, <code>paginateInMemory</code> fait tout :</p>
      <Example file="pagination/lib/services/in-memory.ts" />
    </DocPage>
  );
}
