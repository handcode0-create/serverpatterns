/**
 * Primitive de rate limiting — générique, algorithme "fenêtre fixe" (la fenêtre
 * démarre à la première requête d'une clé et se réinitialise à expiration).
 * Le store par défaut est en mémoire (suffisant pour un seul serveur
 * ou du prototypage) ; pour un déploiement multi-instance (Vercel avec
 * plusieurs régions, par exemple), fournis ton propre `RateLimitStore` branché
 * sur Redis/Upstash via l'interface ci-dessous — ServerPatterns ne t'enferme
 * pas dans une implémentation de store spécifique.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Timestamp (ms) auquel la fenêtre actuelle se réinitialise */
  resetAt: number;
}

export interface RateLimitStore {
  /** Incrémente le compteur pour `key` et renvoie le nombre de requêtes dans la fenêtre courante */
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

/**
 * Store en mémoire — simple Map avec expiration. Ne survit pas à un redémarrage
 * du process et n'est pas partagé entre plusieurs instances serverless.
 * Suffisant pour du dev local ou un déploiement mono-instance.
 */
export function createInMemoryRateLimitStore(): RateLimitStore {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  let nextSweepAt = 0;

  return {
    async increment(key, windowMs) {
      const now = Date.now();

      // Purge périodique des fenêtres expirées (au plus une fois par fenêtre),
      // sinon la Map grossit indéfiniment avec chaque nouvelle clé (IP, userId).
      if (now >= nextSweepAt) {
        for (const [bucketKey, bucket] of buckets) {
          if (bucket.resetAt <= now) buckets.delete(bucketKey);
        }
        nextSweepAt = now + windowMs;
      }

      const existing = buckets.get(key);

      if (!existing || existing.resetAt <= now) {
        const resetAt = now + windowMs;
        buckets.set(key, { count: 1, resetAt });
        return { count: 1, resetAt };
      }

      existing.count += 1;
      return { count: existing.count, resetAt: existing.resetAt };
    },
  };
}

export interface RateLimiterOptions {
  /** Nombre maximum de requêtes autorisées par fenêtre */
  limit: number;
  /** Durée de la fenêtre en millisecondes */
  windowMs: number;
  /** Store à utiliser (défaut: mémoire — voir avertissement ci-dessus) */
  store?: RateLimitStore;
}

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

/**
 * Crée un rate limiter réutilisable, à appeler au début d'un Route Handler
 * ou d'une Server Action (clé = IP, userId, etc.).
 *
 * @example
 * const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 }); // 10 req/minute
 * const result = await limiter.check(userId);
 * if (!result.allowed) return err(new ServerPatternsError("VALIDATION_ERROR", "Trop de requêtes"));
 */
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const store = options.store ?? createInMemoryRateLimitStore();

  return {
    async check(key: string): Promise<RateLimitResult> {
      const { count, resetAt } = await store.increment(key, options.windowMs);
      return {
        allowed: count <= options.limit,
        remaining: Math.max(0, options.limit - count),
        resetAt,
      };
    },
  };
}
