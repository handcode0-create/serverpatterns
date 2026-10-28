import { isOk, ok, err, ServerPatternsError, type Result } from "@serverpatterns/core";
import { formatZodError, type SchemaLike } from "./zod-error.js";

export interface WithServerActionOptions<TInput, TResult> {
  /** Schéma Zod de validation de l'input de la Server Action */
  inputSchema: SchemaLike<TInput>;
  /** Fonction métier : reçoit l'input validé, renvoie un Result */
  action: (input: TInput) => Promise<Result<TResult, ServerPatternsError>>;
}

/** Forme de retour standard de toute Server Action générée par ServerPatterns. */
export type ServerActionResult<TResult> =
  | { success: true; data: TResult }
  | { success: false; error: { code: string; message: string } };

/**
 * Wrapper pour une Server Action Next.js : valide l'input via Zod, exécute
 * l'action métier, et normalise systématiquement le retour (jamais d'exception
 * qui remonte au client — toujours { success, data } ou { success: false, error }).
 *
 * @example
 * "use server";
 * export const createOrder = withServerAction({
 *   inputSchema: z.object({ productId: z.string(), quantity: z.number() }),
 *   action: async (input) => ok(await placeOrder(input)),
 * });
 */
export function withServerAction<TInput, TResult>(
  options: WithServerActionOptions<TInput, TResult>
) {
  return async function serverAction(input: TInput): Promise<ServerActionResult<TResult>> {
    const parsed = options.inputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: formatZodError(parsed.error) },
      };
    }

    try {
      const result = await options.action(parsed.data);
      if (isOk(result)) {
        return { success: true, data: result.data };
      }
      return {
        success: false,
        error: { code: result.error.code, message: result.error.message },
      };
    } catch (cause) {
      // Filet de sécurité : une Server Action ne doit jamais laisser fuiter
      // une exception non gérée vers le client.
      const error =
        cause instanceof ServerPatternsError
          ? cause
          : new ServerPatternsError("UNKNOWN_ERROR", "Erreur inattendue", { cause });
      return { success: false, error: { code: error.code, message: error.message } };
    }
  };
}

// Ré-export pour usage direct dans les actions (ok/err viennent de @serverpatterns/core)
export { ok, err };
