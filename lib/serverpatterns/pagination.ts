import { Result, ok, err } from './types';

export interface PaginationOptions {
  /**
   * Le nombre d'éléments par défaut par page si non spécifié (par défaut: 10)
   */
  defaultLimit?: number;

  /**
   * La limite maximale autorisée pour éviter les requêtes abusives (par défaut: 100)
   */
  maxLimit?: number;
}

export interface RawPaginationParams {
  page?: string | number | null;
  limit?: string | number | null;
  cursor?: string | null;
}

export interface ResolvedPaginationParams {
  page: number;
  limit: number;
  offset: number;
  cursor?: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page?: number;
    limit: number;
    offset: number;
    total?: number;
    totalPages?: number;
    nextCursor?: string;
    hasMore: boolean;
  };
}

/**
 * Normalise et valide les paramètres de pagination (page, limit, cursor).
 * S'assure que la limite ne dépasse pas le maximum configuré.
 */
export function resolvePaginationParams(
  raw: RawPaginationParams,
  options: PaginationOptions = {}
): ResolvedPaginationParams {
  const defaultLimit = options.defaultLimit ?? 10;
  const maxLimit = options.maxLimit ?? 100;

  let page = 1;
  if (raw.page !== undefined && raw.page !== null) {
    const parsedPage = typeof raw.page === 'number' ? raw.page : parseInt(String(raw.page), 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  let limit = defaultLimit;
  if (raw.limit !== undefined && raw.limit !== null) {
    const parsedLimit = typeof raw.limit === 'number' ? raw.limit : parseInt(String(raw.limit), 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = Math.min(parsedLimit, maxLimit);
    }
  }

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
    cursor: raw.cursor || undefined,
  };
}

/**
 * Extrait les paramètres de pagination depuis l'URL d'une requête HTTP.
 */
export function getPaginationFromRequest(
  req: Request,
  options: PaginationOptions = {}
): ResolvedPaginationParams {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get('page');
    const limit = url.searchParams.get('limit');
    const cursor = url.searchParams.get('cursor');

    return resolvePaginationParams({ page, limit, cursor }, options);
  } catch {
    return resolvePaginationParams({}, options);
  }
}

/**
 * Wrapper de fonction de requêtage pour appliquer automatiquement la pagination et retourner un format uniforme.
 */
export function withPagination<TInput, TItem>(
  fetcher: (args: {
    params: ResolvedPaginationParams;
    input: TInput;
  }) => Promise<{ items: TItem[]; total?: number; nextCursor?: string }>,
  options: PaginationOptions = {}
) {
  return async (
    rawParams: RawPaginationParams,
    input: TInput
  ): Promise<Result<Paginated<TItem>, Error>> => {
    try {
      const params = resolvePaginationParams(rawParams, options);
      const { items, total, nextCursor } = await fetcher({ params, input });

      let hasMore = false;
      let totalPages: number | undefined;

      if (total !== undefined) {
        totalPages = Math.ceil(total / params.limit);
        hasMore = params.page < totalPages;
      } else if (nextCursor) {
        hasMore = true;
      } else {
        // Fallback heuristique si aucune information de total ou de curseur n'est fournie
        hasMore = items.length === params.limit;
      }

      const response: Paginated<TItem> = {
        items,
        pagination: {
          page: params.page,
          limit: params.limit,
          offset: params.offset,
          total,
          totalPages,
          nextCursor,
          hasMore,
        },
      };

      return ok(response);
    } catch (error: any) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };
}
