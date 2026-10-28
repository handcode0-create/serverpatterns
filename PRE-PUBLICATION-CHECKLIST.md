# Checklist pré-publication — ServerPatterns

## ✅ Déjà fait

- [x] Noms de packages vérifiés disponibles sur npm (`@serverpatterns/core`, `@serverpatterns/next`, `@serverpatterns/cli` — tous en 404, donc libres au moment de la vérification, 15/07/2026).
- [x] `LICENSE` (MIT) ajoutée à la racine ET dans chaque package (npm ne remonte pas les fichiers d'un dossier parent — vérifié par `npm pack --dry-run`, la licence n'apparaissait dans aucun tarball avant correction).
- [x] Métadonnées npm complètes sur les 3 `package.json` : `repository`, `homepage`, `bugs`, `author`, `keywords`.
- [x] README dédié par package (celui affiché sur la page npm de chaque package, différent du README racine du monorepo).
- [x] Contenu exact des 3 tarballs vérifié via `npm pack --dry-run` — uniquement `dist/`, `README.md`, `LICENSE`, `package.json` inclus (pas de fuite de `src/` ou de fichiers de config).
- [x] Shebang `#!/usr/bin/env node` présent sur le binaire du CLI — npm gère automatiquement les droits d'exécution à l'installation, rien à faire de plus.

## ⚠️ À trancher avant publication définitive

- [ ] **Nom de domaine** — pas encore choisi. Tant que ce n'est pas fait, `homepage` pointe vers le repo GitHub (`https://github.com/handcode0-create/serverpatterns`), et les README pointent aussi vers GitHub plutôt qu'un site qui n'existe pas encore. Une fois le domaine choisi et le site en ligne, il faudra remplacer ces liens dans les 3 `package.json` + 3 README (recherche/remplacement simple, je peux le faire en une passe le moment venu).
- [x] **Dépôt GitHub** — `handcode0-create/serverpatterns`, utilisé dans tous les fichiers (repository, bugs, homepage).

## 🔲 Reste à faire avant de publier

### Qualité du code
- [x] Tests unitaires (38, `npm test` après `npm run build`) sur core, next et cli.
- [x] Correction des bugs du rapport du 06/10/2026 : CLI qui écrivait dans `app/` sur les projets `src/app` (masquait toute l'app), import cassé pour les noms composés (`order-items`), `lib/auth/session.ts` jamais généré pour les actions RBAC, PATCH/DELETE sans id (routes `[id]` désormais), cache des erreurs dans `withCache`, signature Stripe (séparateur `.`) et `v1` multiples, erreurs de `createApiClient` (corps non-JSON, corps d'erreur perdu, timeout ignoré avec un `signal`), fuite mémoire du rate limiter, messages Zod illisibles, import `next/server` incompatible Node ESM, `zod` inutile dans `core`, `tsconfig.tsbuildinfo` qui empêchait `core` d'être rebuild après un `npm run clean`.
- [x] Corrections du 28/10/2026 : compatibilité Zod 4 (`zod` devient peer dependency `^3.23.0 || ^4.0.0`, schémas typés structurellement), `baseUrl` relative de `createApiClient` (erreur au lieu d'exception côté serveur, résolue dans le navigateur), commentaire « fenêtre glissante » corrigé en « fenêtre fixe », CLI : libellés Oui/Non et placeholder du champ vide.
- [x] Site de documentation (`apps/www`) refait : contenu vérifié contre le code, exemples compilés (`npm run check:examples`), sorties du CLI et signatures générées (`npm run sync`).
- [ ] **Validation MVP réelle** : brancher le framework sur un vrai endpoint d'un projet HANCODE STUDIO (ECORG ou Prestige Drive) — c'est le critère de succès du MVP défini dans le PRD, pas une formalité. Publier sur npm avant cette étape veut dire publier quelque chose que tu n'as toi-même jamais utilisé en conditions réelles.

### Compte et organisation npm
- [ ] Créer un compte sur npmjs.com si pas encore fait.
- [ ] Créer l'organisation npm `serverpatterns` (gratuite pour du public) — c'est ce qui autorise à publier sous le scope `@serverpatterns/...`.
- [ ] `npm login` en local.

### Dépôt GitHub
- [x] Repo GitHub : `handcode0-create/serverpatterns` (framework dans `packages/`, site de documentation dans `apps/www/`).
- [ ] Pousser le monorepo tel quel (avec `.gitignore` déjà présent : `node_modules`, `dist`, `*.log`).
- [ ] Vérifier qu'aucun secret (clé API, `.env`) n'a été commité par erreur.

### Publication effective
Une fois tout ce qui précède fait, dans chaque package (`core` d'abord, puis `next` qui en dépend, puis `cli`) :
```bash
npm run build
npm test
npm publish --access public
```
Respecter cet ordre (core → next → cli) car `@serverpatterns/next` dépend de `@serverpatterns/core` déjà publié.

### Après publication
- [ ] Vérifier que `npm install @serverpatterns/core` fonctionne réellement depuis un projet neuf, hors de ta machine de dev si possible (ou au moins dans un dossier totalement différent, sans les liens `file:`/`npm link` utilisés jusqu'ici).
- [ ] Mettre à jour le site (une fois construit) pour que les commandes `npm install` affichées soient vraies et fonctionnelles, pas juste illustratives.
- [ ] Mettre à jour `ROADMAP-ServerPatterns.md` : cocher les cases de la Phase 3 concernées.

## Fichiers modifiés dans cette session

- `LICENSE` (racine + copiée dans chaque package)
- `packages/core/package.json`, `packages/next/package.json`, `packages/cli/package.json` (métadonnées)
- `packages/core/README.md`, `packages/next/README.md`, `packages/cli/README.md` (nouveaux)
