import type { z } from "zod";
import { isOk, ServerPatternsError, type Result } from "@serverpatterns/core";
import type { ServerActionResult } from "./server-action.js";
import { formatZodError } from "./zod-error.js";

/**
 * Session minimale attendue par withAuth. ServerPatterns ne fournit pas de
 * système d'authentification (NextAuth, Clerk, Supabase Auth, JWT maison...
 * chacun a le sien) — tu branches ta propre fonction `getSession` qui sait
 * lire ta session réelle et la ramène à cette forme minimale.
 */
export interface AuthSession {
  userId: string;
  roles: string[];
}

export type GetSessionFn = () => Promise<AuthSession | null>;

export interface WithAuthOptions<TInput, TResult> {
  /** Ta fonction qui lit la session réelle (cookie, JWT, provider tiers...) */
  getSession: GetSessionFn;
  /** Rôles autorisés — si omis, toute session valide suffit (pas de contrainte de rôle) */
  requiredRoles?: string[];
  inputSchema: z.ZodType<TInput>;
  /** Reçoit l'input validé ET la session — pratique pour scoper une requête à `session.userId` */
  action: (input: TInput, session: AuthSession) => Promise<Result<TResult, ServerPatternsError>>;
}

/**
 * Server Action protégée par authentification + RBAC optionnel. Combine
 * validation Zod (comme `withServerAction`) et vérification de session/rôles
 * avant d'exécuter la logique métier.
 *
 * @example
 * "use server";
 * export const updateInventory = withAuth({
 *   getSession: () => getSessionFromCookie(), // ta fonction, pas fournie par ServerPatterns
 *   requiredRoles: ["admin", "stock_manager"],
 *   inputSchema: z.object({ sku: z.string(), quantity: z.number().int() }),
 *   action: async (input, session) => ok(await updateStock(input, session.userId)),
 * });
 */
export function withAuth<TInput, TResult>(options: WithAuthOptions<TInput, TResult>) {
  return async function guardedAction(input: TInput): Promise<ServerActionResult<TResult>> {
    const session = await options.getSession();

    if (!session) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Authentification requise" } };
    }

    if (options.requiredRoles && options.requiredRoles.length > 0) {
      const hasRole = options.requiredRoles.some((role) => session.roles.includes(role));
      if (!hasRole) {
        return { success: false, error: { code: "UNAUTHORIZED", message: "Rôle insuffisant pour cette action" } };
      }
    }

    const parsed = options.inputSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: { code: "VALIDATION_ERROR", message: formatZodError(parsed.error) } };
    }

    try {
      const result = await options.action(parsed.data, session);
      if (isOk(result)) {
        return { success: true, data: result.data };
      }
      return { success: false, error: { code: result.error.code, message: result.error.message } };
    } catch (cause) {
      const error =
        cause instanceof ServerPatternsError
          ? cause
          : new ServerPatternsError("UNKNOWN_ERROR", "Erreur inattendue", { cause });
      return { success: false, error: { code: error.code, message: error.message } };
    }
  };
}
