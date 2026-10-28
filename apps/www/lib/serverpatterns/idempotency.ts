import { Result, ok, err } from './types';

export interface IdempotencyResponse {
  status: 'pending' | 'completed';
  result?: any;
  statusCode?: number;
  headers?: Record<string, string>;
}

export interface IdempotencyStore {
  get(key: string): Promise<IdempotencyResponse | null>;
  set(key: string, value: IdempotencyResponse, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

/**
 * Implémentation par défaut en mémoire vive (In-Memory)
 */
class InMemoryIdempotencyStore implements IdempotencyStore {
  private cache = new Map<string, { value: IdempotencyResponse; expiresAt: number }>();

  async get(key: string): Promise<IdempotencyResponse | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: IdempotencyResponse, ttlSeconds: number): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

export const defaultIdempotencyStore = new InMemoryIdempotencyStore();

export interface IdempotencyOptions {
  /**
   * Le store à utiliser (par défaut: InMemoryIdempotencyStore)
   */
  store?: IdempotencyStore;

  /**
   * Durée de vie en secondes de la clé d'idempotence (par défaut: 86400 soit 24h)
   */
  ttlSeconds?: number;

  /**
   * Fonction personnalisée pour extraire la clé d'idempotence (depuis l'en-tête, les arguments, etc.)
   */
  getKey?: (...args: any[]) => string | null | undefined | Promise<string | null | undefined>;

  /**
   * Message renvoyé en cas de traitement simultané déjà en cours (concurrency conflict)
   */
  pendingMessage?: string;
}

/**
 * Sécurise l'exécution d'un bloc de code ou d'une Server Action pour garantir qu'elle ne s'exécute qu'une seule fois.
 */
export function withIdempotency<TArgs extends any[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options: IdempotencyOptions = {}
) {
  const store = options.store ?? defaultIdempotencyStore;
  const ttlSeconds = options.ttlSeconds ?? 86400; // 24h par défaut
  const pendingMessage = options.pendingMessage ?? "Une requête identique est en cours de traitement.";

  return async (...args: TArgs): Promise<Result<TResult, Error>> => {
    try {
      // 1. Résoudre la clé d'idempotence
      let key: string | null | undefined = null;

      if (options.getKey) {
        const resolved = options.getKey(...args);
        key = resolved instanceof Promise ? await resolved : resolved;
      } else {
        // Fallback: si le premier argument est une requête standard (Route Handler)
        const firstArg = args[0];
        if (firstArg instanceof Request) {
          key = firstArg.headers.get('idempotency-key') || firstArg.headers.get('Idempotency-Key');
        } else if (firstArg && typeof firstArg === 'object') {
          // Si c'est un objet (ex: payload Server Action), on cherche un champ idempotencyKey
          key = firstArg.idempotencyKey || firstArg.idempotency_key;
        }
      }

      // Si aucune clé n'est trouvée, on passe l'idempotence et on exécute l'action directement
      if (!key) {
        const res = await action(...args);
        return ok(res);
      }

      // 2. Vérifier si un enregistrement existe déjà dans le store
      const cached = await store.get(key);

      if (cached) {
        if (cached.status === 'pending') {
          // Concurrence : une requête identique est déjà en train de s'exécuter
          return err(new Error(pendingMessage));
        }
        // Requête déjà complétée : on renvoie le résultat mis en cache
        return ok(cached.result as TResult);
      }

      // 3. Verrouiller la clé d'idempotence en la marquant comme "pending"
      await store.set(key, { status: 'pending' }, ttlSeconds);

      try {
        // 4. Exécuter l'action réelle
        const executionResult = await action(...args);

        // 5. Enregistrer le résultat et libérer le verrou
        await store.set(
          key,
          {
            status: 'completed',
            result: executionResult,
          },
          ttlSeconds
        );

        return ok(executionResult);
      } catch (actionError: any) {
        // En cas d'erreur lors de l'exécution, on libère le verrou pour permettre un nouvel essai
        await store.delete(key);
        throw actionError;
      }
    } catch (error: any) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };
}
