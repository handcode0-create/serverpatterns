import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# ServerPatterns - Next.js App Router Server Standards

ServerPatterns is a lightweight, type-safe, and pragmatic framework designed exclusively for Next.js App Router applications to standardize the server layer. It unifies network fetch calls, Route Handlers, and Server Actions into a single clean architecture using functional programming primitives.

## Scope & Target
- Target environment: Next.js 14+ App Router, Node 18+, TypeScript.
- Exclusivity: Only supports Next.js App Router (does not support Vite, Laravel, Astro, etc.).

## Core Primitives Signatures

### 1. Result<T, E> Monad
Type representing success or failure, avoiding untyped try/catch exceptions.
\`\`\`typescript
export type Result<T, E = Error> =
  | { ok: true; value: T; isOk(): true; isErr(): false }
  | { ok: false; error: E; isOk(): false; isErr(): true };

export function ok<T>(value: T): Result<T, any>;
export function err<E>(error: E): Result<any, E>;
\`\`\`

### 2. createApiClient(config)
Client-side typed HTTP client that centralizes authorization headers and unifies requests into Result objects.
\`\`\`typescript
interface ApiClientConfig {
  baseUrl: string;
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
}

export function createApiClient(config: ApiClientConfig): {
  get<T>(url: string, options?: any): Promise<Result<T, Error>>;
  post<T>(url: string, data?: any, options?: any): Promise<Result<T, Error>>;
  put<T>(url: string, data?: any, options?: any): Promise<Result<T, Error>>;
  delete<T>(url: string, options?: any): Promise<Result<T, Error>>;
};
\`\`\`

### 3. createGetHandler & createPostHandler
Next.js Route Handler wrappers that automatically validate incoming search parameters or JSON payloads via Zod.
\`\`\`typescript
export function createGetHandler<S extends z.ZodType, R>(options: {
  schema?: S;
  handler: (args: { query: z.infer<S>; req: Request }) => Promise<{ status: number; body: R }>;
}): (req: Request) => Promise<Response>;

export function createPostHandler<S extends z.ZodType, R>(options: {
  schema: S;
  handler: (args: { body: z.infer<S>; req: Request }) => Promise<{ status: number; body: R }>;
}): (req: Request) => Promise<Response>;
\`\`\`

### 4. withServerAction
Next.js Server Action wrapper that enforces Zod validation on inputs and automatically returns a standard Result response to the client.
\`\`\`typescript
export function withServerAction<S extends z.ZodType, R>(options: {
  schema: S;
  action: (args: { body: z.infer<S> }) => Promise<R>;
}): (input: z.infer<S>) => Promise<Result<R, Error>>;
\`\`\`

## CLI Commands Reference
- \`npx serverpatterns init\` - Set up the config and initialize the API client.
- \`npx serverpatterns add api <name>\` - Create a route handler at \`app/api/<name>/route.ts\`.
- \`npx serverpatterns add action <name>\` - Create a server action at \`app/actions/<name>.ts\`.

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
