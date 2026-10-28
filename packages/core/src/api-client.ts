import { type Result, type ServerPatternsErrorCode, ok, err, ServerPatternsError } from "./result.js";

export type HeadersResolver =
  | Record<string, string>
  | (() => Record<string, string> | Promise<Record<string, string>>);

export interface ApiClientConfig {
  /**
   * URL de base de l'API (ex: "https://api.example.com"). Côté serveur, elle
   * doit être absolue. Dans le navigateur, une URL relative ("/api") est
   * résolue contre l'origine de la page. Une URL invalide donne un Result en
   * erreur (VALIDATION_ERROR), jamais une exception.
   */
  baseUrl: string;
  /**
   * Headers par défaut ajoutés à chaque requête. Peut être un objet statique,
   * ou une fonction (sync ou async) résolue à CHAQUE requête — utile pour lire
   * un cookie de session via `cookies()` de next/headers, qui n'est accessible
   * que dans un contexte de requête, pas au moment de la création du client.
   */
  defaultHeaders?: HeadersResolver;
  /** Timeout en millisecondes avant abandon de la requête (défaut: 10000) */
  timeoutMs?: number;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  /** Query params ajoutés à l'URL */
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

export interface ApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<Result<T, ServerPatternsError>>;
  post<T>(
    path: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<Result<T, ServerPatternsError>>;
  put<T>(
    path: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<Result<T, ServerPatternsError>>;
  patch<T>(
    path: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<Result<T, ServerPatternsError>>;
  delete<T>(path: string, options?: RequestOptions): Promise<Result<T, ServerPatternsError>>;
}

/**
 * Résout baseUrl en URL absolue. Une baseUrl relative ("/api") est résolue
 * contre l'origine de la page quand elle existe (navigateur) ; côté serveur,
 * il n'y a pas d'origine et une baseUrl absolue est obligatoire.
 */
function resolveBaseUrl(baseUrl: string): string {
  const withSlash = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const origin = (globalThis as { location?: { origin?: string } }).location?.origin;
  return origin ? new URL(withSlash, origin).toString() : new URL(withSlash).toString();
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path.replace(/^\//, ""), resolveBaseUrl(baseUrl));
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/** Associe un statut HTTP d'erreur de l'API distante à un code ServerPatterns. */
function codeForStatus(status: number): ServerPatternsErrorCode {
  if (status === 400 || status === 422) return "VALIDATION_ERROR";
  if (status === 401 || status === 403) return "UNAUTHORIZED";
  if (status === 404) return "NOT_FOUND";
  return "SERVER_ERROR";
}

/** Parse un corps texte en JSON si possible, sinon renvoie le texte brut. */
function parseBodySafely(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function performRequest<T>(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  callerSignal?: AbortSignal
): Promise<Result<T, ServerPatternsError>> {
  // Le timeout s'applique TOUJOURS, même si l'appelant fournit son propre
  // signal : les deux sont combinés sur un seul AbortController.
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onCallerAbort = () => controller.abort();
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener("abort", onCallerAbort, { once: true });
  }

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    // Le corps est lu en texte puis parsé : une réponse non-JSON ne doit
    // jamais être confondue avec une erreur réseau.
    const text = await response.text();

    if (!response.ok) {
      return err(
        new ServerPatternsError(codeForStatus(response.status), `Requête échouée (${response.status})`, {
          status: response.status,
          details: text.length > 0 ? parseBodySafely(text) : undefined,
        })
      );
    }

    // Réponses sans corps (204, ou 200 vide)
    if (text.length === 0) {
      return ok(undefined as T);
    }

    try {
      return ok(JSON.parse(text) as T);
    } catch (cause) {
      // Pas de `status` ici : sinon un Route Handler renverrait l'erreur
      // avec le statut 200 de l'API distante.
      return err(
        new ServerPatternsError("SERVER_ERROR", "Réponse invalide de l'API distante (JSON attendu)", {
          cause,
          details: text.slice(0, 500),
        })
      );
    }
  } catch (cause) {
    if (timedOut) {
      return err(new ServerPatternsError("NETWORK_ERROR", "Requête expirée (timeout)", { cause }));
    }
    if (callerSignal?.aborted) {
      return err(new ServerPatternsError("NETWORK_ERROR", "Requête annulée", { cause }));
    }
    return err(new ServerPatternsError("NETWORK_ERROR", "Erreur réseau", { cause }));
  } finally {
    clearTimeout(timeout);
    callerSignal?.removeEventListener("abort", onCallerAbort);
  }
}

/**
 * Crée un client API typé avec gestion d'erreurs unifiée (Result).
 * @example
 * const client = createApiClient({ baseUrl: "https://api.example.com" });
 * const result = await client.get<User>("/users/123");
 * if (isOk(result)) console.log(result.data);
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  const timeoutMs = config.timeoutMs ?? 10_000;

  async function request<T>(
    method: string,
    path: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<Result<T, ServerPatternsError>> {
    let url: string;
    try {
      url = buildUrl(config.baseUrl, path, options?.query);
    } catch (cause) {
      // Jamais d'exception : une baseUrl relative côté serveur devient un Result en erreur.
      return err(
        new ServerPatternsError(
          "VALIDATION_ERROR",
          `URL invalide : "${config.baseUrl}". Côté serveur, baseUrl doit être absolue (ex: https://api.exemple.com).`,
          { cause }
        )
      );
    }
    const resolvedDefaultHeaders =
      typeof config.defaultHeaders === "function"
        ? await config.defaultHeaders()
        : (config.defaultHeaders ?? {});
    const headers: Record<string, string> = {
      Accept: "application/json",
      // Content-Type uniquement quand un corps est envoyé
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...resolvedDefaultHeaders,
      ...options?.headers,
    };
    const init: RequestInit = { method, headers };
    if (body !== undefined) init.body = JSON.stringify(body);

    return performRequest<T>(url, init, timeoutMs, options?.signal);
  }

  return {
    get: (path, options) => request("GET", path, undefined, options),
    post: (path, body, options) => request("POST", path, body, options),
    put: (path, body, options) => request("PUT", path, body, options),
    patch: (path, body, options) => request("PATCH", path, body, options),
    delete: (path, options) => request("DELETE", path, undefined, options),
  };
}
