import { Result, err, ok } from './types';

export interface AuthConfig<TUser = any> {
  /**
   * Fonction globale pour récupérer l'utilisateur connecté ou la session active.
   * Peut lire les en-têtes, cookies, ou faire appel à un fournisseur d'auth (Auth.js, Clerk, Supabase, etc.).
   */
  getSessionUser: () => Promise<TUser | null | undefined>;

  /**
   * Message d'erreur par défaut pour un utilisateur non authentifié.
   */
  defaultUnauthorizedMessage?: string;

  /**
   * Message d'erreur par défaut pour un utilisateur non autorisé (rôles insuffisants).
   */
  defaultForbiddenMessage?: string;
}

export interface WithAuthOptions<TUser = any, TInput = any> {
  /**
   * Rôles requis pour exécuter cette action.
   * Si spécifié, l'utilisateur doit posséder au moins l'un de ces rôles.
   */
  roles?: string[];

  /**
   * Fonction de validation personnalisée (ex: vérifier l'accès à une ressource spécifique de l'input).
   * Reçoit l'utilisateur authentifié et les données d'entrée de l'action.
   */
  authorize?: (user: TUser, input?: TInput) => boolean | Promise<boolean>;

  /**
   * Surcharger le message d'erreur d'authentification pour cette action spécifique.
   */
  unauthorizedMessage?: string;

  /**
   * Surcharger le message d'erreur d'autorisation pour cette action spécifique.
   */
  forbiddenMessage?: string;

  /**
   * Optionnel : Résolveur de session spécifique à l'action. 
   * S'il est présent, il surcharge le résolveur global.
   */
  getSessionUser?: () => Promise<TUser | null | undefined>;
}

/**
 * Crée un wrapper `withAuth` hautement typé et personnalisé avec votre système de session/rôles.
 * Idéal pour instancier un wrapper réutilisable sur tout le projet.
 */
export function createAuthWrapper<TUser = any>(globalConfig?: AuthConfig<TUser>) {
  /**
   * Wrapper `withAuth` pour sécuriser les Server Actions ou fonctions serveur.
   * Valide l'authentification, les rôles, et injecte le contexte de l'utilisateur dans l'action.
   */
  return function withAuth<TInput = any, TOutput = any>(
    options: WithAuthOptions<TUser, TInput>,
    action: (args: { input: TInput; user: TUser }) => Promise<TOutput>
  ): (input: TInput) => Promise<Result<TOutput, Error>> {
    return async (input: TInput): Promise<Result<TOutput, Error>> => {
      try {
        // 1. Résolution de l'utilisateur
        const resolver = options.getSessionUser || globalConfig?.getSessionUser;
        if (!resolver) {
          throw new Error("Aucun résolveur de session utilisateur n'a été fourni.");
        }

        const user = await resolver();
        if (!user) {
          const msg = options.unauthorizedMessage || globalConfig?.defaultUnauthorizedMessage || 'Non authentifié. Accès refusé.';
          return err(new Error(msg));
        }

        // 2. Vérification des rôles (si spécifiés)
        if (options.roles && options.roles.length > 0) {
          const userRoles: string[] = [];
          const u = user as any;

          // Détection automatique du rôle (supporte les structures classiques d'utilisateurs/tokens)
          if (typeof u.role === 'string') {
            userRoles.push(u.role);
          } else if (Array.isArray(u.roles)) {
            userRoles.push(...u.roles);
          } else if (typeof u.getRoles === 'function') {
            const resolved = await u.getRoles();
            if (Array.isArray(resolved)) userRoles.push(...resolved);
          } else if (typeof u.role === 'object' && u.role?.name) {
            userRoles.push(u.role.name);
          }

          const hasRequiredRole = options.roles.some((role) => userRoles.includes(role));
          if (!hasRequiredRole) {
            const msg = options.forbiddenMessage || globalConfig?.defaultForbiddenMessage || 'Accès interdit. Rôle requis manquant.';
            return err(new Error(msg));
          }
        }

        // 3. Validation d'autorisation fine et contextuelle (ex: ID d'organisation, ressource appartenant à l'user)
        if (options.authorize) {
          const isAuthorized = await options.authorize(user, input);
          if (!isAuthorized) {
            const msg = options.forbiddenMessage || globalConfig?.defaultForbiddenMessage || 'Accès interdit. Autorisation refusée.';
            return err(new Error(msg));
          }
        }

        // 4. Exécution de l'action encapsulée
        const output = await action({ input, user });
        return ok(output);
      } catch (error: any) {
        return err(error instanceof Error ? error : new Error(String(error)));
      }
    };
  };
}

/**
 * Une instance par défaut de `withAuth` pour des cas d'usage simples et directs.
 * Nécessite de passer le résolveur de session ou d'utilisateur dans l'appel.
 */
export const withAuth = createAuthWrapper();
