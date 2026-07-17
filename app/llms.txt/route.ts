import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# ServerPatterns - Next.js App Router Server Standards

ServerPatterns is a lightweight, type-safe, pragmatic framework for Next.js App Router applications. It standardizes API clients, Route Handlers, and Server Actions using a Result-based error model. It does not use a configuration file — all choices are made interactively via the CLI.

## Scope & Target
- Target environment: Next.js 14+ App Router, Node 18+, TypeScript.
- Exclusivity: Only supports Next.js App Router (does not support Vite, Laravel, Astro, etc.).
- Packages: @serverpatterns/core (framework-agnostic), @serverpatterns/next (Next.js adapters), @serverpatterns/cli (interactive generator).

## Core Primitives Signatures

### 1. Result<T, E> Monad
\`\`\`typescript
export type Result<T, E = ServerPatternsError> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<T, never>;
export function err<E>(error: E): Result<never, E>;
export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T };
export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E };
\`\`\`

### 2. ServerPatternsError
\`\`\`typescript
export type ServerPatternsErrorCode =
  | "VALIDATION_ERROR" | "NETWORK_ERROR" | "NOT_FOUND"
  | "UNAUTHORIZED" | "SERVER_ERROR" | "UNKNOWN_ERROR";

export class ServerPatternsError extends Error {
  code: ServerPatternsErrorCode;
  status?: number;
  constructor(code: ServerPatternsErrorCode, message: string, options?: { cause?: unknown; status?: number });
}
\`\`\`

### 3. createApiClient (from @serverpatterns/core)
\`\`\`typescript
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>);
  timeoutMs?: number;
}

export interface ApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<Result<T, ServerPatternsError>>;
  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<Result<T, ServerPatternsError>>;
  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<Result<T, ServerPatternsError>>;
  patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<Result<T, ServerPatternsError>>;
  delete<T>(path: string, options?: RequestOptions): Promise<Result<T, ServerPatternsError>>;
}

export function createApiClient(config: ApiClientConfig): ApiClient;
\`\`\`

### 4. Route Handlers (from @serverpatterns/next)
\`\`\`typescript
export function createGetHandler<TQuery, TResult>(options: {
  querySchema?: ZodType<TQuery>;
  handler: (input: TQuery, request: NextRequest) => Promise<Result<TResult, ServerPatternsError>>;
}): RouteHandler;

// createPostHandler / createPutHandler / createPatchHandler share the same shape:
export function createPostHandler<TBody, TResult>(options: {
  bodySchema: ZodType<TBody>;
  handler: (input: TBody, request: NextRequest) => Promise<Result<TResult, ServerPatternsError>>;
}): RouteHandler;

export function createDeleteHandler<TBody, TResult>(options: {
  bodySchema?: ZodType<TBody>;
  handler: (input: TBody, request: NextRequest) => Promise<Result<TResult, ServerPatternsError>>;
}): RouteHandler;
\`\`\`

### 5. withServerAction (from @serverpatterns/next)
\`\`\`typescript
export function withServerAction<TInput, TResult>(options: {
  inputSchema: ZodType<TInput>;
  action: (input: TInput) => Promise<Result<TResult, ServerPatternsError>>;
}): (input: TInput) => Promise<
  { success: true; data: TResult } | { success: false; error: { code: string; message: string } }
>;
\`\`\`

### 6. withAuth — RBAC guard (from @serverpatterns/next)
\`\`\`typescript
export interface AuthSession { userId: string; roles: string[]; }
export type GetSessionFn = () => Promise<AuthSession | null>;

export function withAuth<TInput, TResult>(options: {
  getSession: GetSessionFn; // developer-provided, not built into ServerPatterns
  requiredRoles?: string[]; // omit = any authenticated session is allowed
  inputSchema: ZodType<TInput>;
  action: (input: TInput, session: AuthSession) => Promise<Result<TResult, ServerPatternsError>>;
}): (input: TInput) => Promise<
  { success: true; data: TResult } | { success: false; error: { code: string; message: string } }
>;
\`\`\`

### 7. Pagination (from @serverpatterns/core)
\`\`\`typescript
export function parsePaginationParams(
  query: Record<string, string | undefined>,
  options?: { defaultPageSize?: number; maxPageSize?: number }
): { page: number; pageSize: number };

export function createPaginatedResult<T>(
  items: T[], totalItems: number, params: { page: number; pageSize: number }
): { items: T[]; page: number; pageSize: number; totalItems: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };

export function paginateInMemory<T>(allItems: T[], params: { page: number; pageSize: number }): ReturnType<typeof createPaginatedResult<T>>;
\`\`\`

### 8. Webhook signature verification (from @serverpatterns/core)
\`\`\`typescript
export function verifyHmacSignature(options: {
  rawBody: string; signatureHeader: string | null; secret: string;
}): { valid: boolean; reason?: string };

export function verifyTimestampedHmacSignature(options: {
  rawBody: string; signatureHeader: string | null; secret: string; toleranceSeconds?: number;
}): { valid: boolean; reason?: string };
\`\`\`

### 9. Rate limiting (from @serverpatterns/core)
\`\`\`typescript
export interface RateLimiter { check(key: string): Promise<{ allowed: boolean; remaining: number; resetAt: number }>; }
export function createRateLimiter(options: { limit: number; windowMs: number; store?: RateLimitStore }): RateLimiter;
export function createInMemoryRateLimitStore(): RateLimitStore;
\`\`\`

### 10. Cache (from @serverpatterns/core)
\`\`\`typescript
export function withCache<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
  options: { ttlMs: number; store?: CacheStore; keyFn?: (...args: unknown[]) => string }
): (...args: Args) => Promise<T>;
export function createInMemoryCacheStore(): CacheStore;
\`\`\`

## CLI Commands Reference (fully interactive, no flags)
- \`npx serverpatterns init\` - creates lib/api/ and lib/actions/ folders. No config file is created.
- \`npx serverpatterns add api <name>\` - prompts for methods (get/list/create/update/delete) and optional Bearer auth (cookie or env var). Creates lib/api/<name>.ts and app/api/<name>/route.ts.
- \`npx serverpatterns add action <name>\` - prompts field-by-field for a Zod schema, then optional RBAC roles. Creates lib/actions/<name>.ts using withAuth (if roles given) or withServerAction.

## Full Documentation
For complete code snippets, quickstarts, and detailed guides, see the full LLM document at:
/llms-full.txt
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
