/**
 * Primitive de cache — TTL simple en mémoire pour les réponses de
 * `createApiClient`. Utile pour des appels GET fréquents vers des ressources
 * qui changent peu (configuration, catalogue produit rarement mis à jour,
 * référentiels CRM). Ne remplace pas un vrai cache distribué (Redis) pour
 * un usage multi-instance à fort trafic — c'est un premier niveau simple.
 */

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

export interface CacheStore {
  get(key: string): unknown | undefined;
  set(key: string, value: unknown, ttlMs: number): void;
}

/** Store de cache en mémoire (Map) avec expiration par entrée. */
export function createInMemoryCacheStore(): CacheStore {
  const store = new Map<string, CacheEntry>();

  return {
    get(key: string) {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt <= Date.now()) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key: string, value: unknown, ttlMs: number) {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
  };
}

export interface WithCacheOptions {
  /** Durée de vie du cache en millisecondes */
  ttlMs: number;
  /** Store à utiliser (défaut: mémoire) */
  store?: CacheStore;
  /** Construit la clé de cache à partir des arguments de la fonction cachée (défaut: JSON.stringify des arguments) */
  keyFn?: (...args: unknown[]) => string;
  /**
   * Décide si une valeur doit être mise en cache. Par défaut, un `Result` en
   * erreur (`{ success: false }`) n'est JAMAIS mis en cache : une coupure
   * réseau passagère ne doit pas être resservie pendant tout le TTL.
   */
  shouldCache?: (value: unknown) => boolean;
}

/** Vrai si la valeur ressemble à un Result en échec ({ success: false, ... }). */
function isFailedResult(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success: unknown }).success === false
  );
}

/**
 * Enveloppe une fonction asynchrone (typiquement un appel `client.get(...)`)
 * avec un cache TTL. Ne cache que les résultats — n'entoure jamais un GET qui
 * a des effets de bord, et ne l'utilise jamais sur des mutations (POST/PUT/DELETE).
 *
 * @example
 * const client = createApiClient({ baseUrl: "https://api.example.com" });
 * const getCachedProduct = withCache(
 *   (id: string) => client.get<Product>(`/products/${id}`),
 *   { ttlMs: 60_000 } // 1 minute
 * );
 */
export function withCache<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
  options: WithCacheOptions
): (...args: Args) => Promise<T> {
  const store = options.store ?? createInMemoryCacheStore();
  const keyFn = options.keyFn ?? ((...args: unknown[]) => JSON.stringify(args));
  const shouldCache = options.shouldCache ?? ((value: unknown) => !isFailedResult(value));

  return async (...args: Args): Promise<T> => {
    const key = keyFn(...args);
    const cached = store.get(key);
    if (cached !== undefined) {
      return cached as T;
    }
    const result = await fn(...args);
    if (result !== undefined && shouldCache(result)) {
      store.set(key, result, options.ttlMs);
    }
    return result;
  };
}
