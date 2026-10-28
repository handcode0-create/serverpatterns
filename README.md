# ServerPatterns

Framework de patterns serveur pour Next.js App Router : clients API, Route Handlers et Server Actions typés, avec un CLI génératif façon shadcn.

## Structure du monorepo (npm workspaces)

```
serverpatterns/
├── packages/
│   ├── core/     → @serverpatterns/core   (Result, ServerPatternsError, createApiClient,
│   │                                        pagination, webhook signatures, rate limiting, cache)
│   ├── next/     → @serverpatterns/next   (createGetHandler, createPostHandler/PutHandler/
│   │                                        PatchHandler/DeleteHandler, withServerAction, withAuth)
│   └── cli/      → @serverpatterns/cli    (commande "serverpatterns" : init, add api, add action —
│                                            prompts interactifs pour méthodes, auth JWT, RBAC)
├── apps/
│   └── www/      → site de documentation (Next.js) — application indépendante,
│                   hors des workspaces npm, avec ses propres dépendances
├── package.json  (racine, workspaces : packages/* uniquement)
└── tsconfig.base.json
```

## Site de documentation (`apps/www`)

```bash
cd apps/www
npm install
npm run dev
```

Déploiement (Vercel) : le dossier racine du projet doit être `apps/www`.

## Installation et build local

```bash
npm install
npm run build
npm test   # tests unitaires (node:test, aucune dépendance ajoutée) — à lancer après le build
```

Chaque package se build indépendamment via son propre `tsc -p tsconfig.json` (voir script `build` dans chaque `package.json`), orchestré par `npm run build --workspaces` à la racine.

## Tester le CLI en local sans publier sur npm

```bash
cd packages/cli
npm run build
npm link
# dans un projet Next.js de test :
npm link @serverpatterns/cli
serverpatterns init   # si tu acceptes l'install auto, elle échoue tant que les packages ne sont pas publiés :
                      # installe-les à la main depuis des tarballs (npm pack) ou via npm link
serverpatterns add api users
serverpatterns add action create-order
```

## État actuel

- [x] `@serverpatterns/core` — `Result`, `ServerPatternsError`, `createApiClient` (GET/POST/PUT/PATCH/DELETE), pagination (`parsePaginationParams`/`createPaginatedResult`/`paginateInMemory`), vérification webhook (`verifyHmacSignature`/`verifyTimestampedHmacSignature`), rate limiting (`createRateLimiter`), cache (`withCache`)
- [x] `@serverpatterns/next` — `createGetHandler`, `createPostHandler`/`PutHandler`/`PatchHandler`/`DeleteHandler`, `withServerAction`, `withAuth` (RBAC)
- [x] `@serverpatterns/cli` — `init`, `add api` (sélection de méthodes + config JWT), `add action` (builder Zod + RBAC), UX `@clack/prompts`
- [x] Validation réelle en conditions de projet : `withServerAction` testé et fonctionnel dans un projet Next.js indépendant (feedback board avec vote sur fichier JSON)
- [x] Tests unitaires : 36 tests (`core` : Result, client API, pagination, webhooks Wave/Stripe, rate limit, cache — `next` : handlers, params `[id]`, Server Actions, RBAC — `cli` : noms, structure `src/`, templates)
- [x] CLI vérifié de bout en bout (prompts pilotés comme au clavier) sur Next 14.2 (`app/` à la racine) et Next 16 (`src/app/`) : build OK, routes et actions appelées contre une API distante simulée
- [ ] Intégration réelle sur un projet HANCODE STUDIO en production (ECORG ou Prestige Drive) — validation MVP complète, cf. PRD section 5.3
- [ ] Publication npm (voir PRE-PUBLICATION-CHECKLIST.md)

## Prochaine étape recommandée

La validation sur un petit projet de test (feedback board) est faite. Reste : brancher ce squelette sur un vrai endpoint d'un projet HANCODE STUDIO en production (ECORG ou Prestige Drive) — c'est le critère de succès complet du MVP défini dans le PRD.
