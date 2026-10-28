import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import CliShowcase from '@/components/CliShowcase';
import CodeBlock from '@/components/CodeBlock';
import {examples} from '@/lib/generated/examples';
import {REPO_URL} from '@/lib/docs-nav';

const PACKAGES = [
  {
    name: '@serverpatterns/core',
    role: 'Le format Result et les erreurs typées, un client HTTP pour tes API externes, la pagination, la vérification de signatures webhook, le rate limiting et un cache simple. Sans dépendance à Next.js.',
    usage: `import { createApiClient, ok, err } from "@serverpatterns/core";`,
    href: '/docs/primitives/result',
  },
  {
    name: '@serverpatterns/next',
    role: 'Des wrappers pour les Route Handlers et les Server Actions : validation Zod de l’entrée, réponse au format unique, session et rôles avec withAuth.',
    usage: `import { createPostHandler, withServerAction } from "@serverpatterns/next";`,
    href: '/docs/primitives/get-post-handler',
  },
  {
    name: '@serverpatterns/cli',
    role: 'Génère ces fichiers dans ton projet. Le code généré t’appartient : tu le lis et le modifies comme le reste.',
    usage: `npx @serverpatterns/cli add api users`,
    href: '/docs/cli/setup',
  },
];

export default function Home() {
  return (
    <main id="contenu">
      {/* En-tête de page */}
      <section className="mx-auto max-w-[88rem] px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
        <h1 className="max-w-[17ch] font-display text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.25rem] lg:text-[5rem]">
          Ta couche serveur Next.js, écrite pareil partout.
        </h1>
        <p className="mt-6 max-w-[56ch] text-[1.125rem] leading-relaxed text-muted sm:text-[1.25rem]">
          ServerPatterns donne une seule forme à tes appels d’API, tes Route Handlers et tes Server Actions : même
          validation, même format d’erreur, d’un fichier à l’autre et d’un projet à l’autre. Un CLI écrit le squelette
          dans ton code.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/docs/quickstart"
            className="rounded-lg bg-accent px-5 py-3 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-accent-soft"
          >
            Lire le quickstart
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-line-strong px-5 py-3 text-[0.9375rem] font-semibold text-text transition-colors hover:border-muted"
          >
            Voir le code sur GitHub
          </a>
        </div>
      </section>

      {/* Avant / après : l'élément central de la page */}
      <section aria-labelledby="comparaison" className="mx-auto max-w-[88rem] px-4 pb-24 sm:px-6">
        <h2 id="comparaison" className="sr-only">
          Le même Route Handler, avec et sans ServerPatterns
        </h2>
        <BeforeAfter
          before={{
            label: 'Avant',
            file: 'app/api/orders/route.ts',
            code: examples['home-before/app/api/orders/route.ts'],
            summary: 'Un Route Handler qui crée une commande auprès d’une API de boutique, écrit à la main comme on en trouve dans beaucoup de projets.',
            annotations: [
              {match: 'let body: any', note: 'Le corps est typé any : TypeScript ne vérifie plus rien.'},
              {match: 'typeof body.productId', note: 'Validation écrite à la main, qui laisse passer une quantité négative.'},
              {match: '{ message: "Données invalides" }', note: 'Trois formes d’erreur dans un même fichier : error, message, err.'},
              {match: 'const res = await fetch', note: 'Pas de timeout : si l’API ne répond pas, la requête attend indéfiniment.'},
              {match: 'String(e)', note: 'Le message d’exception part tel quel vers le client.'},
            ],
          }}
          after={{
            label: 'Après',
            file: 'app/api/orders/route.ts',
            code: examples['home-after/app/api/orders/route.ts'],
            summary: 'Le même endpoint. Le client vers la boutique est déclaré une fois dans lib/api/shop.ts et réutilisé par toutes les routes.',
            annotations: [
              {match: 'bodySchema', note: 'Le corps est validé par Zod et typé ; une quantité de 0 est refusée avec une erreur 400.'},
              {match: 'shop.post', note: 'Le client applique un timeout (10 s par défaut) et renvoie un Result au lieu de lever une exception.'},
              {match: 'export const POST', note: 'Toutes les réponses ont la même forme : { success, data } ou { success, error: { code, message } }.'},
            ],
          }}
        />
      </section>

      {/* Les packages */}
      <section aria-labelledby="packages" className="border-t border-line">
        <div className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
          <h2 id="packages" className="max-w-[24ch] font-display text-[2rem] font-semibold leading-tight sm:text-[2.5rem]">
            Trois packages, à prendre ensemble ou séparément
          </h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className="grid gap-4 py-7 lg:grid-cols-[18rem_minmax(0,1fr)_minmax(0,26rem)] lg:gap-10">
                <h3 className="font-mono text-[1rem] text-text">
                  <Link href={pkg.href} className="hover:text-accent-soft">
                    {pkg.name}
                  </Link>
                </h3>
                <p className="max-w-[60ch] text-[1rem] leading-relaxed text-muted">{pkg.role}</p>
                <code className="self-start break-words rounded-md border border-line bg-surface px-3 py-2 font-mono text-[0.8125rem] text-[#D6D3CC]">
                  {pkg.usage}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le CLI */}
      <section aria-labelledby="cli" className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
          <h2 id="cli" className="font-display text-[2rem] font-semibold leading-tight sm:text-[2.5rem]">
            Le CLI écrit le squelette
          </h2>
          <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-relaxed text-muted">
            Trois commandes interactives, sans option ni fichier de configuration. Ci-dessous, leurs vraies sorties.
          </p>
          <div className="mt-10">
            <CliShowcase />
          </div>
        </div>
      </section>

      {/* Format de réponse */}
      <section aria-labelledby="format" className="border-t border-line">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <div>
            <h2 id="format" className="font-display text-[2rem] font-semibold leading-tight sm:text-[2.5rem]">
              Une seule forme de réponse
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              Route Handler ou Server Action, ton interface lit toujours <code className="font-mono text-[0.9em] text-text">success</code>, puis{' '}
              <code className="font-mono text-[0.9em] text-text">data</code> ou <code className="font-mono text-[0.9em] text-text">error</code>. Le
              statut HTTP suit le code d’erreur : 400, 401, 404, 502 ou 500.
            </p>
            <Link href="/docs/primitives/result" className="mt-6 inline-block font-semibold text-accent-soft underline underline-offset-4 hover:text-accent">
              Les codes d’erreur
            </Link>
          </div>
          <div className="grid min-w-0 gap-4">
            <CodeBlock title="Succès" language="json" wrap code={`{ "success": true, "data": { "id": "cmd_812", "status": "pending" } }`} />
            <CodeBlock
              title="Erreur"
              language="json"
              wrap
              code={`{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "quantity: Too small: expected number to be >0" } }`}
            />
          </div>
        </div>
      </section>

      {/* État du projet */}
      <section aria-labelledby="etat" className="border-t border-line">
        <div className="mx-auto max-w-[88rem] px-4 py-20 sm:px-6">
          <h2 id="etat" className="font-display text-[2rem] font-semibold leading-tight sm:text-[2.5rem]">
            Où en est le projet
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-display text-[1.25rem] font-semibold text-ok">Fait</h3>
              <ul className="mt-4 space-y-2.5 text-[1rem] text-[#D6D3CC]">
                <li>Les trois packages, en TypeScript strict</li>
                <li>38 tests unitaires</li>
                <li>CLI vérifié de bout en bout sur Next.js 14.2 et 16, avec ou sans dossier src/</li>
                <li>Compatible Zod 3 et Zod 4</li>
                <li>Exemples de cette documentation compilés contre les vrais packages</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-[1.25rem] font-semibold text-accent-soft">À venir</h3>
              <ul className="mt-4 space-y-2.5 text-[1rem] text-[#D6D3CC]">
                <li>Validation sur un projet HANCODE STUDIO en production</li>
                <li>Publication de la version 0.1.0 sur npm</li>
                <li>Premiers retours d’utilisateurs externes</li>
              </ul>
            </div>
          </div>
          <p className="mt-12 max-w-[60ch] text-[1.0625rem] text-muted">
            En attendant la publication, tu peux{' '}
            <a href={`${REPO_URL}#tester-le-cli-en-local-sans-publier-sur-npm`} className="font-semibold text-text underline underline-offset-4 hover:text-accent-soft">
              tester ServerPatterns depuis le dépôt
            </a>{' '}
            ou lire la <Link href="/docs" className="font-semibold text-text underline underline-offset-4 hover:text-accent-soft">documentation</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
