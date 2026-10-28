export type ApiMethod = "get" | "list" | "create" | "update" | "delete";

export interface ApiTemplateOptions {
  /** Noms dérivés du nom saisi : "order-items" → kebab "order-items", camel "orderItems", pascal "OrderItems" */
  names: { kebab: string; camel: string; pascal: string };
  /** Méthodes sélectionnées interactivement par l'utilisateur */
  methods: ApiMethod[];
  /** Configuration d'authentification choisie interactivement */
  auth: { type: "none" } | { type: "cookie"; cookieName: string } | { type: "env"; envVar: string };
  /** Chemin d'import du client depuis app/api/<nom>/route.ts */
  clientImportFromCollectionRoute: string;
  /** Chemin d'import du client depuis app/api/<nom>/[id]/route.ts */
  clientImportFromItemRoute: string;
}

/** Méthodes servies par la route de collection : app/api/<nom>/route.ts */
export const COLLECTION_METHODS: ApiMethod[] = ["list", "create"];
/** Méthodes servies par la route d'élément : app/api/<nom>/[id]/route.ts */
export const ITEM_METHODS: ApiMethod[] = ["get", "update", "delete"];

function authHeadersSnippet(auth: ApiTemplateOptions["auth"]): string {
  if (auth.type === "cookie") {
    return `async () => {
    // cookies() est synchrone en Next 14 et asynchrone en Next 15+ : "await" couvre les deux.
    const token = (await cookies()).get("${auth.cookieName}")?.value;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = \`Bearer \${token}\`;
    return headers;
  }`;
  }
  if (auth.type === "env") {
    return `(): Record<string, string> => {
    const token = process.env.${auth.envVar};
    return token ? { Authorization: \`Bearer \${token}\` } : {};
  }`;
  }
  return `{}`;
}

/**
 * Génère le client API d'une ressource (lib/api/<nom>.ts), avec uniquement
 * les méthodes sélectionnées et l'injection d'auth Bearer configurée.
 */
export function apiClientTemplate(options: ApiTemplateOptions): string {
  const { names, methods, auth } = options;
  const { kebab, camel, pascal } = names;
  const client = `${camel}Client`;
  const needsInput = methods.includes("create") || methods.includes("update");

  const functions: string[] = [];

  if (methods.includes("get")) {
    functions.push(`/** Récupère un élément "${kebab}" par son id. */
export async function get${pascal}(id: string) {
  return ${client}.get<${pascal}>(\`/${kebab}/\${encodeURIComponent(id)}\`);
}`);
  }

  if (methods.includes("list")) {
    functions.push(`/**
 * Liste les éléments "${kebab}", paginés.
 * Suppose que l'API distante renvoie un PaginatedResult — adapte si son format diffère.
 */
export async function list${pascal}(params: PaginationParams) {
  return ${client}.get<PaginatedResult<${pascal}>>("/${kebab}", {
    query: { page: params.page, pageSize: params.pageSize },
  });
}`);
  }

  if (methods.includes("create")) {
    functions.push(`/** Crée un nouvel élément "${kebab}". */
export async function create${pascal}(input: ${pascal}Input) {
  return ${client}.post<${pascal}>("/${kebab}", input);
}`);
  }

  if (methods.includes("update")) {
    functions.push(`/** Met à jour partiellement un élément "${kebab}". */
export async function update${pascal}(id: string, input: Partial<${pascal}Input>) {
  return ${client}.patch<${pascal}>(\`/${kebab}/\${encodeURIComponent(id)}\`, input);
}`);
  }

  if (methods.includes("delete")) {
    functions.push(`/** Supprime un élément "${kebab}". */
export async function delete${pascal}(id: string) {
  return ${client}.delete<unknown>(\`/${kebab}/\${encodeURIComponent(id)}\`);
}`);
  }

  const coreImports = ["createApiClient"];
  if (methods.includes("list")) coreImports.push("type PaginationParams", "type PaginatedResult");

  return `import { ${coreImports.join(", ")} } from "@serverpatterns/core";
${auth.type === "cookie" ? 'import { cookies } from "next/headers";\n' : ""}
/**
 * Client API pour la ressource "${kebab}".
 * Définis API_BASE_URL dans ton .env (ex: API_BASE_URL=https://api.monservice.com).
 */
export const ${client} = createApiClient({
  baseUrl: process.env.API_BASE_URL ?? "https://api.example.com",
  defaultHeaders: ${authHeadersSnippet(auth)},
});

export interface ${pascal} {
  id: string;
  // TODO: complète les champs réels de la ressource
}
${needsInput ? `\n/** Données envoyées à la création / mise à jour (tout sauf l'id). */\nexport type ${pascal}Input = Omit<${pascal}, "id">;\n` : ""}
${functions.join("\n\n")}
`;
}

/**
 * Route de collection — app/api/<nom>/route.ts : GET (liste paginée) et POST
 * (création). Renvoie null si aucune de ces méthodes n'est sélectionnée.
 */
export function collectionRouteTemplate(options: ApiTemplateOptions): string | null {
  const { names, methods, clientImportFromCollectionRoute } = options;
  const { pascal } = names;
  const wanted = methods.filter((m) => COLLECTION_METHODS.includes(m));
  if (wanted.length === 0) return null;

  const nextImports: string[] = [];
  const clientImports: string[] = [];
  const blocks: string[] = [];

  if (wanted.includes("list")) {
    nextImports.push("createGetHandler");
    clientImports.push(`list${pascal}`);
    blocks.push(`const listQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

/** GET /api/${names.kebab}?page=1&pageSize=20 */
export const GET = createGetHandler({
  querySchema: listQuerySchema,
  handler: async (query) => list${pascal}(parsePaginationParams(query)),
});`);
  }

  if (wanted.includes("create")) {
    nextImports.push("createPostHandler");
    clientImports.push(`create${pascal}`);
    blocks.push(`/** Doit correspondre à ${pascal}Input (lib/api) — TypeScript te signalera tout écart. */
const createSchema = z.object({
  // TODO: décris les champs attendus, ex: name: z.string().min(1),
});

/** POST /api/${names.kebab} */
export const POST = createPostHandler({
  bodySchema: createSchema,
  handler: async (body) => create${pascal}(body),
});`);
  }

  return `import { z } from "zod";
import { ${nextImports.join(", ")} } from "@serverpatterns/next";
${wanted.includes("list") ? 'import { parsePaginationParams } from "@serverpatterns/core";\n' : ""}import { ${clientImports.join(", ")} } from "${clientImportFromCollectionRoute}";

${blocks.join("\n\n")}
`;
}

/**
 * Route d'élément — app/api/<nom>/[id]/route.ts : GET (un élément), PATCH
 * (mise à jour) et DELETE. L'id vient du segment dynamique [id], pas d'un
 * query param. Renvoie null si aucune de ces méthodes n'est sélectionnée.
 */
export function itemRouteTemplate(options: ApiTemplateOptions): string | null {
  const { names, methods, clientImportFromItemRoute } = options;
  const { pascal, kebab } = names;
  const wanted = methods.filter((m) => ITEM_METHODS.includes(m));
  if (wanted.length === 0) return null;

  const nextImports: string[] = [];
  const clientImports: string[] = [];
  const blocks: string[] = [];

  if (wanted.includes("get")) {
    nextImports.push("createGetHandler");
    clientImports.push(`get${pascal}`);
    blocks.push(`/** GET /api/${kebab}/:id */
export const GET = createGetHandler({
  handler: async (_query, _request, params) => get${pascal}(String(params.id)),
});`);
  }

  if (wanted.includes("update")) {
    nextImports.push("createPatchHandler");
    clientImports.push(`update${pascal}`);
    blocks.push(`/** Champs modifiables — tous optionnels pour une mise à jour partielle. */
const updateSchema = z.object({
  // TODO: décris les champs modifiables, ex: name: z.string().min(1).optional(),
});

/** PATCH /api/${kebab}/:id */
export const PATCH = createPatchHandler({
  bodySchema: updateSchema,
  handler: async (body, _request, params) => update${pascal}(String(params.id), body),
});`);
  }

  if (wanted.includes("delete")) {
    nextImports.push("createDeleteHandler");
    clientImports.push(`delete${pascal}`);
    blocks.push(`/** DELETE /api/${kebab}/:id */
export const DELETE = createDeleteHandler({
  handler: async (_body, _request, params) => {
    const id = String(params.id);
    return mapResult(await delete${pascal}(id), () => ({ id }));
  },
});`);
  }

  return `${wanted.includes("update") ? 'import { z } from "zod";\n' : ""}import { ${nextImports.join(", ")} } from "@serverpatterns/next";
${wanted.includes("delete") ? 'import { mapResult } from "@serverpatterns/core";\n' : ""}import { ${clientImports.join(", ")} } from "${clientImportFromItemRoute}";

${blocks.join("\n\n")}
`;
}
