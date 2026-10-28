import {docsNav, REPO_URL, VERSION} from '@/lib/docs-nav';

// Généré à partir de la navigation du site : chaque page de la doc, avec une phrase.
export const dynamic = 'force-static';

const SITE = 'https://serverpatterns.vercel.app';

export function GET() {
  const sections = docsNav
    .map((group) => {
      const links = group.links.map((link) => `- [${link.title}](${SITE}${link.href}) : ${link.summary}`).join('\n');
      return `## ${group.title}\n\n${links}`;
    })
    .join('\n\n');

  const body = `# ServerPatterns

> Couche serveur standard pour Next.js App Router (14 et plus) : Result typé, client HTTP, wrappers de Route Handlers et de Server Actions avec validation Zod (3 ou 4), et un CLI qui génère le code. Version ${VERSION}, pas encore publiée sur npm.

Packages : @serverpatterns/core (sans Next.js), @serverpatterns/next, @serverpatterns/cli. Runtime Node.js uniquement (pas d'Edge). Code source : ${REPO_URL}

Référence complète en un fichier (signatures, codes d'erreur, CLI, exemples) : ${SITE}/llms-full.txt

${sections}
`;

  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
