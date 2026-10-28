import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import {REPO_URL} from '@/lib/docs-nav';

export const metadata: Metadata = {
  title: 'Introduction',
  description: 'Ce que fait ServerPatterns, pour qui, et où en est le projet.',
};

export default function DocsIntroduction() {
  return (
    <DocPage
      href="/docs"
      source="app/docs/page.tsx"
      title="Introduction"
      lead="ServerPatterns donne une forme unique à la couche serveur d’une application Next.js App Router : les appels aux API externes, les Route Handlers et les Server Actions s’écrivent de la même façon, d’un fichier à l’autre et d’un projet à l’autre."
    >
      <h2>Le problème</h2>
      <p>
        Dans une application Next.js, le code qui parle aux API externes finit souvent dupliqué : chaque fichier refait son{' '}
        <code>fetch</code>, ses en-têtes d’authentification et sa gestion d’erreurs. Un Route Handler renvoie{' '}
        <code>{'{ error }'}</code>, un autre <code>{'{ message }'}</code>, un troisième laisse fuiter une exception. Les
        données entrantes sont typées en TypeScript mais rarement validées à l’exécution.
      </p>

      <h2>Ce que ServerPatterns apporte</h2>
      <ul>
        <li>
          <strong>Un format de retour unique</strong> : chaque fonction renvoie un <code>Result</code>,{' '}
          <code>{'{ success: true, data }'}</code> ou <code>{'{ success: false, error }'}</code>, au lieu de lever des
          exceptions.
        </li>
        <li>
          <strong>Des wrappers pour Route Handlers et Server Actions</strong> qui valident l’entrée avec Zod et
          renvoient toujours la même forme de réponse.
        </li>
        <li>
          <strong>Un client HTTP</strong> pour tes API externes, avec timeout, en-têtes dynamiques et erreurs typées.
        </li>
        <li>
          <strong>Des utilitaires courants</strong> : pagination, vérification de signatures webhook (Wave, Stripe),
          rate limiting et cache simple.
        </li>
        <li>
          <strong>Un CLI</strong> qui génère ces fichiers dans ton projet, comme le fait shadcn pour les composants :
          le code généré t’appartient et reste modifiable.
        </li>
      </ul>

      <h2>Les trois packages</h2>
      <div className="wide overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Package</th>
              <th scope="col">Contenu</th>
              <th scope="col">Dépend de Next.js</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@serverpatterns/core</code></td>
              <td>Result, ServerPatternsError, createApiClient, pagination, webhooks, rate limiting, cache</td>
              <td>Non</td>
            </tr>
            <tr>
              <td><code>@serverpatterns/next</code></td>
              <td>Route Handlers, withServerAction, withAuth</td>
              <td>Oui (14 et plus, App Router)</td>
            </tr>
            <tr>
              <td><code>@serverpatterns/cli</code></td>
              <td>Commandes <code>init</code>, <code>add api</code>, <code>add action</code></td>
              <td>Génère du code Next.js</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Ce que ServerPatterns ne fait pas</h2>
      <p>
        Pas de système d’authentification : <code>withAuth</code> se branche sur le tien. Pas de génération depuis un
        schéma OpenAPI, pas de tableau de bord, pas de télémétrie. Pas d’autre framework que Next.js App Router.
      </p>

      <h2>Où en est le projet</h2>
      <p>
        La version 0.1.0 est en préparation. Le code des trois packages est dans le{' '}
        <a href={REPO_URL}>dépôt GitHub</a>, couvert par 38 tests unitaires, et le CLI a été vérifié de bout en bout sur
        Next.js 14.2 et Next.js 16, avec Zod 3 et Zod 4.
      </p>
      <Callout title="Pas encore sur npm" type="warning">
        Les packages ne sont pas encore publiés : les commandes <code>npm install</code> et <code>npx</code> de cette
        documentation fonctionneront dès la publication. En attendant, tu peux{' '}
        <a href={`${REPO_URL}#tester-le-cli-en-local-sans-publier-sur-npm`}>les tester depuis le dépôt</a>.
      </Callout>
      <p>
        Pour commencer, lis l’<Link href="/docs/installation">installation</Link> puis le{' '}
        <Link href="/docs/quickstart">quickstart</Link>.
      </p>
    </DocPage>
  );
}
