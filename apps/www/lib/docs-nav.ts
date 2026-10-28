// Source unique de la navigation : barre latérale, liens précédent/suivant et llms.txt.

export interface DocLink {
  href: string;
  title: string;
  /** Une phrase : ce que la page apprend. Réutilisée dans llms.txt. */
  summary: string;
}

export interface DocGroup {
  title: string;
  links: DocLink[];
}

export const docsNav: DocGroup[] = [
  {
    title: 'Démarrer',
    links: [
      { href: '/docs', title: 'Introduction', summary: 'Ce que fait ServerPatterns, pour qui, et où en est le projet.' },
      { href: '/docs/installation', title: 'Installation', summary: 'Prérequis, installation avec ou sans le CLI, et état de la publication npm.' },
      { href: '/docs/quickstart', title: 'Quickstart', summary: 'Un service, un Route Handler et une Server Action reliés de bout en bout.' },
      { href: '/docs/guide-feedback-board', title: 'Guide : feedback board', summary: 'Une Server Action de vote complète, puis le même code séparé en repository.' },
      { href: '/docs/ai-agents', title: 'Agents IA', summary: 'llms.txt, llms-full.txt et un prompt système à copier dans tes projets.' },
      { href: '/docs/changelog', title: 'Changelog', summary: 'Ce qui a changé, version par version.' },
    ],
  },
  {
    title: 'Primitives',
    links: [
      { href: '/docs/primitives/result', title: 'Result et erreurs', summary: 'Result<T, E>, ok, err, isOk, isErr, mapResult, unwrap et ServerPatternsError.' },
      { href: '/docs/primitives/api-client', title: 'createApiClient', summary: 'Client HTTP typé qui renvoie toujours un Result, avec timeout et headers dynamiques.' },
      { href: '/docs/primitives/get-post-handler', title: 'Route Handlers', summary: 'createGetHandler, createPostHandler, createPutHandler, createPatchHandler, createDeleteHandler.' },
      { href: '/docs/primitives/server-action', title: 'withServerAction', summary: 'Server Action validée, avec un retour { success, data | error } sans exception.' },
      { href: '/docs/primitives/auth', title: 'withAuth', summary: 'Server Action protégée par ta session et des rôles (RBAC).' },
      { href: '/docs/primitives/webhook', title: 'Signatures webhook', summary: 'verifyHmacSignature et verifyTimestampedHmacSignature pour Wave, Stripe, GitHub.' },
      { href: '/docs/primitives/pagination', title: 'Pagination', summary: 'parsePaginationParams, createPaginatedResult et paginateInMemory.' },
      { href: '/docs/primitives/rate-limiter', title: 'Rate limiting', summary: 'createRateLimiter à fenêtre fixe, avec un store mémoire ou le tien (Redis).' },
      { href: '/docs/primitives/cache', title: 'Cache', summary: 'withCache : cache TTL en mémoire qui ne garde jamais les erreurs.' },
    ],
  },
  {
    title: 'CLI',
    links: [
      { href: '/docs/cli/setup', title: 'Vue d’ensemble', summary: 'Lancer le CLI, structure détectée, ce qu’il génère et ce qu’il ne fait pas.' },
      { href: '/docs/cli/init', title: 'init', summary: 'Installe les dépendances et crée lib/api et lib/actions.' },
      { href: '/docs/cli/add-api', title: 'add api', summary: 'Génère un client API et deux Route Handlers (collection et [id]).' },
      { href: '/docs/cli/add-action', title: 'add action', summary: 'Génère une Server Action avec son schéma Zod, protégée par rôles si besoin.' },
    ],
  },
];

export const allDocLinks: DocLink[] = docsNav.flatMap((group) => group.links);

export function getDocNeighbours(href: string): { prev?: DocLink; next?: DocLink } {
  const index = allDocLinks.findIndex((link) => link.href === href);
  if (index === -1) return {};
  return { prev: allDocLinks[index - 1], next: allDocLinks[index + 1] };
}

export function getDocLink(href: string): DocLink {
  const link = allDocLinks.find((item) => item.href === href);
  if (!link) throw new Error(`Page absente de docs-nav.ts : ${href}`);
  return link;
}

export const REPO_URL = 'https://github.com/handcode0-create/serverpatterns';
export const VERSION = '0.1.0';
