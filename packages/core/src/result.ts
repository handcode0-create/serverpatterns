/**
 * Result<T, E> — type de retour standard utilisé dans tout ServerPatterns.
 * Évite les try/catch incohérents : chaque fonction du framework renvoie
 * explicitement un succès ou une erreur typée, jamais une exception silencieuse.
 */
export type Result<T, E = ServerPatternsError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Construit un Result de succès.
 * @example
 * const result = ok({ id: "123" });
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Construit un Result d'erreur.
 * @example
 * const result = err(new ServerPatternsError("NOT_FOUND", "Ressource introuvable"));
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/** Garde de type : le Result est un succès. */
export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

/** Garde de type : le Result est une erreur. */
export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

/**
 * Transforme la donnée d'un Result réussi, laisse l'erreur inchangée.
 */
export function mapResult<T, U, E>(
  result: Result<T, E>,
  transform: (data: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return ok(transform(result.data));
  }
  return result;
}

/**
 * Déballe un Result : renvoie la donnée si succès, lève sinon.
 * À réserver aux scripts/tests — dans le code applicatif, préférer isOk/isErr.
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.data;
  }
  throw result.error instanceof Error ? result.error : new Error(String(result.error));
}

/**
 * Codes d'erreur standard ServerPatterns — utilisés par tous les packages
 * (@serverpatterns/core, @serverpatterns/next) pour garder un format cohérent.
 */
export type ServerPatternsErrorCode =
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

/**
 * Erreur standard ServerPatterns. Toute erreur produite par le framework
 * (client API, handlers, Server Actions) est une instance de cette classe,
 * jamais une string ou un objet ad hoc.
 */
export class ServerPatternsError extends Error {
  public readonly code: ServerPatternsErrorCode;
  public readonly cause?: unknown;
  public readonly status: number | undefined;
  /**
   * Corps de la réponse d'erreur renvoyé par l'API distante (JSON parsé, ou
   * texte brut), quand il existe. Utile pour le debug et les logs serveur.
   * Les Route Handlers et Server Actions ServerPatterns ne le renvoient
   * JAMAIS au client, pour ne pas faire fuiter de détails internes.
   */
  public readonly details: unknown;

  constructor(
    code: ServerPatternsErrorCode,
    message: string,
    options?: { cause?: unknown; status?: number; details?: unknown }
  ) {
    super(message);
    this.name = "ServerPatternsError";
    this.code = code;
    this.cause = options?.cause;
    this.status = options?.status;
    this.details = options?.details;
  }
}
