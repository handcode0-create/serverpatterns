# @serverpatterns/core

Primitives génériques ServerPatterns — indépendantes de Next.js, utilisables dans n'importe quel projet TypeScript/Node.

Fait partie de [ServerPatterns](https://github.com/handcode0-create/serverpatterns) — un framework de patterns serveur pour Next.js App Router. Pour l'usage avec Route Handlers et Server Actions, voir [@serverpatterns/next](https://www.npmjs.com/package/@serverpatterns/next).

## Installation

```bash
npm install @serverpatterns/core
```

## Ce que contient ce package

| Primitive | Rôle |
|---|---|
| `Result<T,E>`, `ok`, `err`, `isOk`, `isErr` | Type de retour standard — jamais de try/catch incohérent |
| `ServerPatternsError` | Erreur typée avec code (`VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `SERVER_ERROR`, `NETWORK_ERROR`, `UNKNOWN_ERROR`) |
| `createApiClient` | Client HTTP typé (GET/POST/PUT/PATCH/DELETE) avec gestion d'erreurs unifiée |
| `parsePaginationParams`, `createPaginatedResult`, `paginateInMemory` | Pagination générique (listes de produits, contacts, stock...) |
| `verifyHmacSignature`, `verifyTimestampedHmacSignature` | Vérification de signature webhook (HMAC-SHA256, format Wave/Stripe) |
| `createRateLimiter`, `createInMemoryRateLimitStore` | Rate limiting à fenêtre glissante |
| `withCache`, `createInMemoryCacheStore` | Cache TTL pour appels de lecture fréquents |

## Usage — client API

```typescript
import { createApiClient, isOk } from "@serverpatterns/core";

const client = createApiClient({ baseUrl: "https://api.example.com" });
const result = await client.get<{ id: string; name: string }>("/users/123");

if (isOk(result)) {
  console.log(result.data.name);
} else {
  console.error(result.error.code, result.error.status, result.error.details);
}
```

Erreurs renvoyées (jamais d'exception) :

| Situation | `error.code` | `error.status` | `error.details` |
|---|---|---|---|
| HTTP 400 / 422 | `VALIDATION_ERROR` | statut reçu | corps de la réponse (JSON ou texte) |
| HTTP 401 / 403 | `UNAUTHORIZED` | statut reçu | idem |
| HTTP 404 | `NOT_FOUND` | 404 | idem |
| Autre statut d'erreur | `SERVER_ERROR` | statut reçu | idem |
| 200 avec un corps non-JSON | `SERVER_ERROR` | — | début du corps reçu |
| Timeout, annulation, serveur injoignable | `NETWORK_ERROR` | — | — |

`timeoutMs` (défaut 10 s) s'applique toujours, y compris si tu passes ton propre `signal`.

## Usage — pagination

```typescript
import { parsePaginationParams, paginateInMemory } from "@serverpatterns/core";

const params = parsePaginationParams({ page: "2", pageSize: "20" });
const result = paginateInMemory(allUsers, params);
// { items, page, pageSize, totalItems, totalPages, hasNextPage, hasPreviousPage }
```

## Usage — rate limiting

```typescript
import { createRateLimiter } from "@serverpatterns/core";

const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 }); // 10 req/minute
const result = await limiter.check(userId);
if (!result.allowed) {
  // result.remaining, result.resetAt
}
```

## Usage — cache

```typescript
import { withCache } from "@serverpatterns/core";

const getCachedProduct = withCache(
  (id: string) => client.get<Product>(`/products/${id}`),
  { ttlMs: 60_000 } // 1 minute — n'entoure jamais une mutation (POST/PATCH/DELETE)
);
```

Un `Result` en erreur n'est jamais mis en cache (une coupure réseau passagère n'est pas resservie pendant tout le TTL). Option `shouldCache` pour personnaliser.

## Usage — webhooks (Wave, Stripe)

```typescript
import { verifyTimestampedHmacSignature } from "@serverpatterns/core";

export async function POST(request: Request) {
  const rawBody = await request.text(); // corps BRUT, jamais re-sérialisé

  // Wave : message signé = timestamp + corps (défaut)
  const wave = verifyTimestampedHmacSignature({
    rawBody,
    signatureHeader: request.headers.get("Wave-Signature"),
    secret: process.env.WAVE_WEBHOOK_SECRET!,
  });

  // Stripe : message signé = timestamp + "." + corps
  const stripe = verifyTimestampedHmacSignature({
    rawBody,
    signatureHeader: request.headers.get("Stripe-Signature"),
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
    payloadSeparator: ".",
  });

  if (!wave.valid) return new Response(wave.reason, { status: 401 });
  // ...
}
```

Plusieurs signatures `v1` dans le header (rotation de secret) sont acceptées : la vérification réussit si l'une d'elles est valide. Tolérance anti-rejeu : 300 s par défaut (`toleranceSeconds`).

## Documentation complète

[Dépôt GitHub](https://github.com/handcode0-create/serverpatterns#readme)

## Licence

MIT © HANCODE STUDIO
