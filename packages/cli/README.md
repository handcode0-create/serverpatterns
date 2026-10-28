# @serverpatterns/cli

CLI génératif pour [ServerPatterns](https://github.com/handcode0-create/serverpatterns) — initialise la structure et génère clients API, Route Handlers et Server Actions dans ton projet Next.js, via des prompts interactifs (aucun flag en ligne de commande).

## Installation

Pas besoin d'installation globale, utilise `npx` directement :

```bash
npx @serverpatterns/cli init
```

## Commandes

> Le CLI détecte la structure de ton projet : si ton App Router est dans `src/app/` (option `src/` de create-next-app), tous les fichiers sont générés sous `src/` (`src/app/api/...`, `src/lib/...`). Les imports générés sont relatifs : aucun alias `@/` n'est requis.

### `serverpatterns init`

Installe les dépendances (`@serverpatterns/core`, `@serverpatterns/next`, `zod`) et crée la structure `lib/api/`, `lib/actions/` (ou `src/lib/...`). Le gestionnaire de paquets est pré-sélectionné d'après ton lockfile.

### `serverpatterns add api <nom>`

Prompts interactifs, dans cet ordre :
1. Nom de la ressource (si non passé en argument)
2. Sélection multiple des méthodes à générer : récupérer (GET), lister paginé (GET), créer (POST), mettre à jour (PATCH), supprimer (DELETE)
3. Confirmation : besoin d'un token Bearer (JWT) dans les headers ?
4. Si oui : source du token — cookie de session ou variable d'environnement

Génère, selon les méthodes choisies :

| Fichier | Contenu |
|---|---|
| `lib/api/<nom>.ts` | Client API (`createApiClient`) + une fonction par méthode (`get<Nom>`, `list<Nom>`, `create<Nom>`, `update<Nom>`, `delete<Nom>`) |
| `app/api/<nom>/route.ts` | `GET` (liste paginée) et `POST` (création) |
| `app/api/<nom>/[id]/route.ts` | `GET` (un élément), `PATCH` (mise à jour), `DELETE` — l'id vient du segment `[id]` |

Les Route Handlers appellent le client, qui appelle l'API distante définie par `API_BASE_URL` dans ton `.env`. Les schémas Zod de création/mise à jour sont à compléter (`TODO` générés) ; TypeScript te signale tout écart avec l'interface de la ressource.

### `serverpatterns add action <nom>`

Prompts interactifs, dans cet ordre :
1. Nom de l'action (si non passé en argument)
2. Boucle de construction du schéma Zod : nom du champ, type (string/number/boolean), optionnel ou non — répété jusqu'à nom de champ vide
3. Confirmation : action restreinte à certains rôles (RBAC) ?
4. Si oui : liste des rôles autorisés, séparés par une virgule

Génère `lib/actions/<nom>.ts` — utilise `withAuth` si des rôles sont définis, `withServerAction` sinon.

Avec des rôles, le CLI crée aussi `lib/auth/session.ts` s'il n'existe pas (jamais écrasé s'il existe) : une fonction `getSession()` à brancher sur ton auth réelle. Tant qu'elle renvoie `null`, l'action protégée répond `UNAUTHORIZED` — sûr par défaut.

```bash
serverpatterns help
serverpatterns --version
```

## Documentation complète

Référence détaillée de chaque commande : [Dépôt GitHub](https://github.com/handcode0-create/serverpatterns#readme)

## Licence

MIT © HANCODE STUDIO
