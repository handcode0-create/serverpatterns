import type { AuthSession } from "@serverpatterns/next";

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
