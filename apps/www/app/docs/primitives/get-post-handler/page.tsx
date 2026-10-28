import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'Route Handlers',
  description: 'createGetHandler, createPostHandler, createPutHandler, createPatchHandler, createDeleteHandler.',
};

export default function HandlersPage() {
  return (
    <DocPage
      href="/docs/primitives/get-post-handler"
      source="app/docs/primitives/get-post-handler/page.tsx"
      title="Route Handlers"
      lead="Cinq wrappers, un par méthode HTTP. Chacun valide l’entrée avec un schéma Zod, appelle ton handler et transforme le Result renvoyé en réponse JSON avec le bon statut HTTP."
    >
      <h2>Les wrappers</h2>
      <ApiTable
        rows={[
          {
            name: 'createGetHandler',
            type: '{ querySchema?, handler }',
            description: 'Valide les paramètres de l’URL (?page=2). Sans querySchema, le handler reçoit les paramètres bruts.',
          },
          {name: 'createPostHandler', type: '{ bodySchema, handler }', description: 'Valide le corps JSON. bodySchema est obligatoire.'},
          {name: 'createPutHandler', type: '{ bodySchema, handler }', description: 'Comme POST, pour un remplacement complet.'},
          {name: 'createPatchHandler', type: '{ bodySchema, handler }', description: 'Comme POST, pour une mise à jour partielle.'},
          {
            name: 'createDeleteHandler',
            type: '{ bodySchema?, handler }',
            description: 'Le corps est facultatif : une requête DELETE sans corps est acceptée même si bodySchema est défini.',
          },
        ]}
      />
      <p>Le handler reçoit trois arguments et renvoie une promesse de <code>Result</code> :</p>
      <CodeBlock
        title="Signature du handler"
        code={`handler: (
  input: T,               // query ou body déjà validé et typé par le schéma
  request: NextRequest,   // la requête d'origine (en-têtes, cookies…)
  params: RouteParams     // segments dynamiques, ex: { id: "42" } pour app/api/products/[id]
) => Promise<Result<TResult, ServerPatternsError>>

type RouteParams = Record<string, string | string[]>;`}
      />
      <p>
        <code>params</code> est déjà résolu : tu n’as pas à faire <code>await params</code>, que Next.js le fournisse en
        objet (14) ou en promesse (15 et plus).
      </p>

      <h2>Collection : liste paginée et création</h2>
      <Example file="handlers/app/api/products/route.ts" />

      <h2>Élément : lecture, mise à jour, suppression</h2>
      <Example file="handlers/app/api/products/[id]/route.ts" />

      <h2>Format des réponses</h2>
      <CodeBlock title="Succès : 200" language="json"
        wrap code={`{ "success": true, "data": { "id": "p_1", "name": "Attiéké 1 kg", "price": 1500 } }`} />
      <CodeBlock
        title="Erreur : statut selon le code"
        language="json"
        wrap
        code={`{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "price: Too small: expected number to be >0" } }`}
      />
      <div className="wide overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Cas</th>
              <th scope="col">Statut HTTP</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Succès</td><td>200</td></tr>
            <tr><td>JSON invalide ou schéma non respecté</td><td>400</td></tr>
            <tr><td><code>err(...)</code> avec un <code>status</code> défini</td><td>ce statut (ex: 429)</td></tr>
            <tr><td><code>VALIDATION_ERROR</code> · <code>UNAUTHORIZED</code> · <code>NOT_FOUND</code></td><td>400 · 401 · 404</td></tr>
            <tr><td><code>NETWORK_ERROR</code></td><td>502</td></tr>
            <tr><td><code>SERVER_ERROR</code> · <code>UNKNOWN_ERROR</code></td><td>500</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Le message de validation liste chaque champ en erreur : <code>champ: message; autre: message</code>. Le texte
        exact des messages par défaut dépend de ta version de Zod ; pour un texte maîtrisé, passe-le au schéma, par
        exemple <code>z.string().min(3, &quot;Trop court&quot;)</code>.
      </p>

      <Callout title="Erreur d’une API distante" type="warning">
        Si ton handler renvoie tel quel le <code>Result</code> d’un <code>createApiClient</code>, le statut de l’API
        distante est réutilisé (une 404 distante devient ta 404). Le corps de l’erreur distante (
        <code>details</code>) n’est pas transmis au client.
      </Callout>
    </DocPage>
  );
}
