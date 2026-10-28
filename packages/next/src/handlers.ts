import type { z } from "zod";
import { NextResponse, type NextRequest } from "next/server.js";
import { isOk, ServerPatternsError, type Result } from "@serverpatterns/core";
import { formatZodError } from "./zod-error.js";

/**
 * Contexte passé par Next.js en 2e argument d'un Route Handler. `params` est
 * un objet en Next 14 et une Promise en Next 15+ : les deux sont gérés.
 */
type HandlerContext = { params?: unknown };

/**
 * Paramètres dynamiques du segment de route, déjà résolus — ex: `{ id: "42" }`
 * pour `app/api/users/[id]/route.ts`. Objet vide pour une route statique.
 */
export type RouteParams = Record<string, string | string[]>;

export interface CreateHandlerOptions<TQuery, TResult> {
  /** Schéma Zod de validation des query params (GET) — optionnel */
  querySchema?: z.ZodType<TQuery>;
  /** Fonction métier : reçoit les données validées, la requête et les params de route, renvoie un Result */
  handler: (
    input: TQuery,
    request: NextRequest,
    params: RouteParams
  ) => Promise<Result<TResult, ServerPatternsError>>;
}

export interface CreatePostHandlerOptions<TBody, TResult> {
  /** Schéma Zod de validation du body — obligatoire pour POST/PATCH/PUT */
  bodySchema: z.ZodType<TBody>;
  handler: (
    input: TBody,
    request: NextRequest,
    params: RouteParams
  ) => Promise<Result<TResult, ServerPatternsError>>;
}

export interface CreateDeleteHandlerOptions<TBody, TResult> {
  /** Schéma Zod de validation du body — optionnel, un DELETE n'a souvent pas de corps */
  bodySchema?: z.ZodType<TBody>;
  handler: (
    input: TBody,
    request: NextRequest,
    params: RouteParams
  ) => Promise<Result<TResult, ServerPatternsError>>;
}

/** Résout `context.params` (objet en Next 14, Promise en Next 15+) en RouteParams. */
async function resolveRouteParams(context: HandlerContext | undefined): Promise<RouteParams> {
  const raw: unknown = context?.params ? await context.params : undefined;
  const params: RouteParams = {};
  if (raw && typeof raw === "object") {
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string") params[key] = value;
      else if (Array.isArray(value)) params[key] = value.map(String);
    }
  }
  return params;
}

const HTTP_STATUS_BY_CODE: Record<ServerPatternsError["code"], number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  NETWORK_ERROR: 502,
  SERVER_ERROR: 500,
  UNKNOWN_ERROR: 500,
};

function errorResponse(error: ServerPatternsError) {
  const status = error.status ?? HTTP_STATUS_BY_CODE[error.code] ?? 500;
  return NextResponse.json(
    { success: false, error: { code: error.code, message: error.message } },
    { status }
  );
}

/**
 * Wrapper pour un Route Handler GET : valide les query params via Zod,
 * exécute le handler métier, et renvoie une réponse JSON au format standard
 * { success, data } ou { success: false, error }.
 *
 * @example
 * export const GET = createGetHandler({
 *   querySchema: z.object({ id: z.string() }),
 *   handler: async ({ id }) => ok(await findUser(id)),
 * });
 */
export function createGetHandler<TQuery, TResult>(
  options: CreateHandlerOptions<TQuery, TResult>
) {
  return async function GET(request: NextRequest, context?: HandlerContext) {
    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    const params = await resolveRouteParams(context);

    let input: TQuery = searchParams as unknown as TQuery;
    if (options.querySchema) {
      const parsed = options.querySchema.safeParse(searchParams);
      if (!parsed.success) {
        return errorResponse(
          new ServerPatternsError("VALIDATION_ERROR", formatZodError(parsed.error))
        );
      }
      input = parsed.data;
    }

    const result = await options.handler(input, request, params);
    if (isOk(result)) {
      return NextResponse.json({ success: true, data: result.data });
    }
    return errorResponse(result.error);
  };
}

/**
 * Fabrique interne partagée par createPostHandler/createPutHandler/
 * createPatchHandler/createDeleteHandler — évite de dupliquer la logique
 * de parsing JSON + validation Zod + réponse standard 4 fois.
 */
function createMutationHandler<TBody, TResult>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  options: CreatePostHandlerOptions<TBody, TResult> | CreateDeleteHandlerOptions<TBody, TResult>
) {
  return async function handler(request: NextRequest, context?: HandlerContext) {
    let input: TBody = undefined as unknown as TBody;
    const params = await resolveRouteParams(context);

    if (options.bodySchema) {
      // Lecture en texte : fiable même sans header content-length (transfert chunked)
      const text = await request.text();
      // Un DELETE sans corps est accepté tel quel ; les autres méthodes exigent un corps JSON.
      if (!(method === "DELETE" && text.trim().length === 0)) {
        let rawBody: unknown;
        try {
          rawBody = JSON.parse(text);
        } catch (cause) {
          return errorResponse(
            new ServerPatternsError("VALIDATION_ERROR", "Corps de requête JSON invalide", { cause })
          );
        }

        const parsed = options.bodySchema.safeParse(rawBody);
        if (!parsed.success) {
          return errorResponse(new ServerPatternsError("VALIDATION_ERROR", formatZodError(parsed.error)));
        }
        input = parsed.data;
      }
    }

    const result = await options.handler(input, request, params);
    if (isOk(result)) {
      return NextResponse.json({ success: true, data: result.data });
    }
    return errorResponse(result.error);
  };
}

/**
 * Wrapper pour un Route Handler POST : valide le body via Zod (obligatoire),
 * exécute le handler métier, renvoie une réponse JSON au format standard.
 *
 * @example
 * export const POST = createPostHandler({
 *   bodySchema: z.object({ name: z.string() }),
 *   handler: async (body) => ok(await createUser(body)),
 * });
 */
export function createPostHandler<TBody, TResult>(options: CreatePostHandlerOptions<TBody, TResult>) {
  return createMutationHandler("POST", options);
}

/**
 * Wrapper pour un Route Handler PUT — même comportement que createPostHandler,
 * sémantique HTTP différente (remplacement complet de la ressource).
 */
export function createPutHandler<TBody, TResult>(options: CreatePostHandlerOptions<TBody, TResult>) {
  return createMutationHandler("PUT", options);
}

/**
 * Wrapper pour un Route Handler PATCH — mise à jour partielle d'une ressource.
 *
 * @example
 * export const PATCH = createPatchHandler({
 *   bodySchema: z.object({ quantity: z.number().int() }),
 *   handler: async (body) => ok(await updateStock(body)),
 * });
 */
export function createPatchHandler<TBody, TResult>(options: CreatePostHandlerOptions<TBody, TResult>) {
  return createMutationHandler("PATCH", options);
}

/**
 * Wrapper pour un Route Handler DELETE — le body est optionnel (souvent
 * l'identifiant est dans l'URL plutôt que dans un corps de requête).
 *
 * @example
 * // app/api/users/[id]/route.ts
 * export const DELETE = createDeleteHandler({
 *   handler: async (_body, _request, params) => ok(await deleteUser(String(params.id))),
 * });
 */
export function createDeleteHandler<TBody, TResult>(
  options: CreateDeleteHandlerOptions<TBody, TResult>
) {
  return createMutationHandler("DELETE", options);
}
