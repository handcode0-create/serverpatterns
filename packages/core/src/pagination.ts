/**
 * Primitive de pagination — générique, utilisable pour lister n'importe quel
 * type de ressource (produits, contacts CRM, mouvements de stock, etc.).
 * ServerPatterns ne prend pas parti sur la source de données (SQL, ORM, API
 * externe) : cette primitive normalise juste les paramètres d'entrée et la
 * forme du résultat.
 */

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ParsePaginationOptions {
  /** Taille de page par défaut si non précisée (défaut: 20) */
  defaultPageSize?: number;
  /** Taille de page maximale autorisée, pour éviter qu'un client demande 1M lignes (défaut: 100) */
  maxPageSize?: number;
}

/**
 * Parse des query params bruts (ex: URLSearchParams d'un Route Handler)
 * en PaginationParams sûrs — jamais de page négative, jamais de pageSize
 * qui dépasse la limite définie.
 *
 * @example
 * const params = parsePaginationParams(searchParams, { maxPageSize: 50 });
 */
export function parsePaginationParams(
  query: Record<string, string | undefined>,
  options?: ParsePaginationOptions
): PaginationParams {
  const defaultPageSize = options?.defaultPageSize ?? 20;
  const maxPageSize = options?.maxPageSize ?? 100;

  const rawPage = Number(query.page ?? "1");
  const rawPageSize = Number(query.pageSize ?? defaultPageSize);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSizeCandidate =
    Number.isFinite(rawPageSize) && rawPageSize > 0 ? Math.floor(rawPageSize) : defaultPageSize;
  const pageSize = Math.min(pageSizeCandidate, maxPageSize);

  return { page, pageSize };
}

/**
 * Construit un PaginatedResult à partir d'une page d'éléments déjà récupérée
 * et du nombre total d'éléments (ex: `SELECT COUNT(*)` côté SQL, ou le total
 * renvoyé par une API externe).
 *
 * @example
 * const result = createPaginatedResult(users, totalUsersCount, { page: 2, pageSize: 20 });
 */
export function createPaginatedResult<T>(
  items: T[],
  totalItems: number,
  params: PaginationParams
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(totalItems / params.pageSize));
  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    totalItems,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1,
  };
}

/**
 * Pagine un tableau déjà entièrement chargé en mémoire — utile pour des
 * petits jeux de données ou du prototypage rapide. Pour de vraies volumétries,
 * préfère une pagination au niveau de la requête (LIMIT/OFFSET SQL, curseur API)
 * et utilise directement `createPaginatedResult`.
 */
export function paginateInMemory<T>(allItems: T[], params: PaginationParams): PaginatedResult<T> {
  const start = (params.page - 1) * params.pageSize;
  const items = allItems.slice(start, start + params.pageSize);
  return createPaginatedResult(items, allItems.length, params);
}
