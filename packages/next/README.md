# @serverpatterns/next

Adaptateurs ServerPatterns pour Next.js App Router — Route Handlers, Server Actions et gardes d'authentification typés.

Fait partie de [ServerPatterns](https://github.com/handcode0-create/serverpatterns). Dépend de [@serverpatterns/core](https://www.npmjs.com/package/@serverpatterns/core).

## Installation

```bash
npm install @serverpatterns/core @serverpatterns/next
```

Compatible Next.js 14+ (App Router) — testé sur Next 14.2 et Next 16. `zod` est une peer dependency : Zod 3 (3.23+) et Zod 4 sont acceptés.

## Ce que contient ce package

| Primitive | Rôle |
|---|---|
| `createGetHandler` | Route Handler GET avec validation `querySchema` (Zod) |
| `createPostHandler`, `createPutHandler`, `createPatchHandler` | Route Handlers de mutation avec validation `bodySchema` |
| `createDeleteHandler` | Route Handler DELETE, `bodySchema` optionnel |
| `withServerAction` | Server Action avec validation `inputSchema` et retour typé |
| `withAuth` | Server Action protégée par authentification + RBAC optionnel (`requiredRoles`) |

## Usage — Route Handler GET

```typescript
import { z } from "zod";
import { createGetHandler } from "@serverpatterns/next";
import { ok } from "@serverpatterns/core";

export const GET = createGetHandler({
  querySchema: z.object({ id: z.string() }),
  handler: async ({ id }) => ok(await findUser(id)),
});
```

## Usage — Route Handler PATCH avec segment dynamique

Le handler reçoit `(input, request, params)`. `params` contient les segments dynamiques déjà résolus — que Next les fournisse en objet (Next 14) ou en Promise (Next 15+).

```typescript
// app/api/products/[id]/route.ts
import { z } from "zod";
import { createPatchHandler } from "@serverpatterns/next";
import { ok } from "@serverpatterns/core";

export const PATCH = createPatchHandler({
  bodySchema: z.object({ quantity: z.number().int() }),
  handler: async (body, _request, params) => ok(await updateStock(String(params.id), body)),
});
```

## Format des réponses

Succès : `{ "success": true, "data": ... }`. Erreur : `{ "success": false, "error": { "code", "message" } }` avec le statut HTTP correspondant (400, 401, 404, 502 pour `NETWORK_ERROR`, 500 sinon — ou le statut renvoyé par l'API distante). Les erreurs Zod sont lisibles (`"quantity: Expected number, received string"`). Les détails internes (`cause`, `details`) ne sont jamais renvoyés au client.

## Usage — Server Action

```typescript
"use server";
import { z } from "zod";
import { withServerAction, ok } from "@serverpatterns/next";

export const createOrder = withServerAction({
  inputSchema: z.object({ productId: z.string(), quantity: z.number() }),
  action: async (input) => ok(await placeOrder(input)),
});
```

## Usage — Server Action protégée (RBAC)

`getSession` n'est pas fourni par ServerPatterns — c'est une fonction que tu écris toi-même, qui adapte ton vrai système d'authentification (NextAuth, Clerk, JWT maison) à la forme minimale `{ userId, roles } | null`.

```typescript
"use server";
import { z } from "zod";
import { withAuth, ok } from "@serverpatterns/next";
import { getSession } from "@/lib/auth/session"; // ta fonction

export const updateInventory = withAuth({
  getSession,
  requiredRoles: ["admin", "stock_manager"],
  inputSchema: z.object({ sku: z.string(), quantity: z.number().int() }),
  action: async (input, session) => ok(await updateStock(input, session.userId)),
});
```

## Documentation complète

[Dépôt GitHub](https://github.com/handcode0-create/serverpatterns#readme)

## Licence

MIT © HANCODE STUDIO
