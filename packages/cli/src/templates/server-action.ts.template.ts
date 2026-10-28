export interface ActionField {
  name: string;
  zodType: "string" | "number" | "boolean";
  optional: boolean;
}

export interface ActionTemplateOptions {
  actionName: string;
  camelName: string;
  fields: ActionField[];
  /** Rôles RBAC requis — tableau vide = withServerAction simple (pas d'auth) */
  requiredRoles: string[];
  /** Chemin d'import de getSession depuis le fichier d'action (utilisé seulement si requiredRoles non vide) */
  sessionImport: string;
}

/**
 * Fichier lib/auth/session.ts généré quand il n'existe pas encore, pour que
 * l'action protégée compile immédiatement. Renvoie `null` tant qu'il n'est pas
 * branché : toute action protégée répond donc UNAUTHORIZED (sûr par défaut).
 */
export function sessionStubTemplate(): string {
  return `import type { AuthSession } from "@serverpatterns/next";

/**
 * Adapte ici ton vrai système d'authentification (NextAuth, Clerk, Supabase
 * Auth, JWT maison...) à la forme minimale { userId, roles } attendue par
 * withAuth. ServerPatterns ne fournit pas d'auth : il standardise juste la
 * façon de la brancher.
 *
 * Tant que cette fonction renvoie null, toute action protégée par withAuth
 * répond UNAUTHORIZED — comportement sûr par défaut.
 *
 * Exemple (NextAuth) :
 *   const session = await auth();
 *   return session?.user ? { userId: session.user.id, roles: session.user.roles ?? [] } : null;
 */
export async function getSession(): Promise<AuthSession | null> {
  // TODO: branche ton système d'authentification réel
  return null;
}
`;
}

function zodFieldLine(field: ActionField): string {
  const base =
    field.zodType === "string" ? "z.string()" : field.zodType === "number" ? "z.number()" : "z.boolean()";
  return `  ${field.name}: ${base}${field.optional ? ".optional()" : ""},`;
}

export function serverActionTemplate(options: ActionTemplateOptions): string {
  const { actionName, camelName, fields, requiredRoles, sessionImport } = options;

  const schemaFields =
    fields.length > 0
      ? fields.map(zodFieldLine).join("\n")
      : "  // TODO: complète les champs réels attendus par cette action";

  if (requiredRoles.length === 0) {
    return `"use server";

import { z } from "zod";
import { withServerAction, ok, err } from "@serverpatterns/next";
import { ServerPatternsError } from "@serverpatterns/core";

const inputSchema = z.object({
${schemaFields}
});

export const ${camelName} = withServerAction({
  inputSchema,
  action: async (input) => {
    try {
      // TODO: implémente la logique métier de "${actionName}"
      return ok(input);
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Échec de l'action ${actionName}", { cause }));
    }
  },
});
`;
  }

  return `"use server";

import { z } from "zod";
import { withAuth, ok, err } from "@serverpatterns/next";
import { ServerPatternsError } from "@serverpatterns/core";
import { getSession } from "${sessionImport}"; // TODO: branche ce fichier sur ton système d'auth réel (NextAuth, Clerk, etc.)

const inputSchema = z.object({
${schemaFields}
});

/**
 * Action protégée — rôles autorisés : ${requiredRoles.join(", ")}.
 * "getSession" doit être fourni par toi : ServerPatterns ne prend pas position
 * sur ton système d'authentification, juste sur la façon de le brancher.
 */
export const ${camelName} = withAuth({
  getSession,
  requiredRoles: [${requiredRoles.map((r) => `"${r}"`).join(", ")}],
  inputSchema,
  action: async (input, session) => {
    try {
      // TODO: implémente la logique métier de "${actionName}" (session.userId disponible)
      return ok(input);
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Échec de l'action ${actionName}", { cause }));
    }
  },
});
`;
}
