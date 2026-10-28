import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import {cliCommands} from '@/lib/commands';
import Terminal from '@/components/Terminal';
import {cliTranscripts} from '@/lib/cli-transcripts';
import {cliOutput} from '@/lib/generated/cli-output';

export const metadata: Metadata = {
  title: 'serverpatterns add api',
  description: 'Génère un client API et deux Route Handlers (collection et [id]).',
};

export default function CliAddApiPage() {
  return (
    <DocPage
      href="/docs/cli/add-api"
      source="app/docs/cli/add-api/page.tsx"
      title="add api"
      lead="Génère, pour une ressource, un client vers ton API externe et les Route Handlers qui l’exposent dans ton application."
    >
      <PackageManagerTabs commands={cliCommands('add api <nom>')} />
      <p>
        Le nom (par exemple <code>users</code> ou <code>order-items</code>) commence par une lettre et ne contient que
        des lettres, chiffres, <code>-</code> ou <code>_</code>. Sans argument, le CLI le demande.
      </p>

      <h2>Questions posées</h2>
      <Terminal command="npx @serverpatterns/cli add api users" transcript={cliTranscripts.addApi} />
      <ol>
        <li>
          <strong>Méthodes</strong> à générer (espace pour cocher, <kbd>a</kbd> pour tout cocher) : récupérer un élément,
          lister avec pagination, créer, mettre à jour, supprimer.
        </li>
        <li>
          <strong>Token Bearer</strong> : faut-il un en-tête <code>Authorization</code> ? Si oui, d’où vient-il : d’un
          cookie de session (tu donnes son nom) ou d’une variable d’environnement (tu donnes son nom, par défaut{' '}
          <code>API_TOKEN</code>).
        </li>
      </ol>

      <h2>Fichiers générés</h2>
      <div className="wide overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Fichier</th>
              <th scope="col">Créé si tu coches</th>
              <th scope="col">Routes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>lib/api/&lt;nom&gt;.ts</code></td>
              <td>toujours</td>
              <td>client + une fonction par méthode</td>
            </tr>
            <tr>
              <td><code>app/api/&lt;nom&gt;/route.ts</code></td>
              <td>lister ou créer</td>
              <td><code>GET /api/&lt;nom&gt;</code>, <code>POST /api/&lt;nom&gt;</code></td>
            </tr>
            <tr>
              <td><code>app/api/&lt;nom&gt;/[id]/route.ts</code></td>
              <td>récupérer, mettre à jour ou supprimer</td>
              <td><code>GET</code>, <code>PATCH</code>, <code>DELETE /api/&lt;nom&gt;/:id</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Voici exactement ce que produit la commande ci-dessus (toutes les méthodes, token lu dans le cookie <code>token</code>) :</p>
      <CodeBlock title={cliOutput.apiClient.path} code={cliOutput.apiClient.code} />
      <CodeBlock title={cliOutput.apiCollectionRoute.path} code={cliOutput.apiCollectionRoute.code} />
      <CodeBlock title={cliOutput.apiItemRoute.path} code={cliOutput.apiItemRoute.code} />

      <h2>Après la génération</h2>
      <ol>
        <li>
          Définis <code>API_BASE_URL</code> dans ton <code>.env.local</code> : c’est l’API externe qu’appelle le client.
        </li>
        <li>
          Complète l’interface de la ressource (ici <code>Users</code>) avec ses vrais champs.
        </li>
        <li>
          Décris les champs acceptés dans <code>createSchema</code> et <code>updateSchema</code>. Tant qu’ils sont
          vides, Zod retire tous les champs du corps reçu : la création envoie un objet vide.
        </li>
      </ol>
      <Callout title="Les types se surveillent mutuellement">
        <code>create&lt;Nom&gt;</code> attend un <code>&lt;Nom&gt;Input</code> (l’interface sans <code>id</code>). Dès
        que tu ajoutes un champ obligatoire à l’interface, TypeScript signale le schéma de création qui ne le fournit
        pas.
      </Callout>
      <p>
        Les wrappers utilisés sont détaillés dans <Link href="/docs/primitives/get-post-handler">Route Handlers</Link> et{' '}
        <Link href="/docs/primitives/api-client">createApiClient</Link>.
      </p>
    </DocPage>
  );
}
