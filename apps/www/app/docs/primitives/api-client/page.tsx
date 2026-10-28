import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'createApiClient',
  description: 'Client HTTP typé qui renvoie toujours un Result, avec timeout et headers dynamiques.',
};

export default function ApiClientPage() {
  return (
    <DocPage
      href="/docs/primitives/api-client"
      source="app/docs/primitives/api-client/page.tsx"
      title="createApiClient"
      lead="Un client HTTP par API externe : il centralise l’URL de base, les en-têtes et le timeout, et renvoie un Result au lieu de lever une exception, quelle que soit la réponse."
    >
      <h2>Créer un client</h2>
      <Example file="api-client/lib/clients/catalog.ts" />
      <ApiTable
        rows={[
          {
            name: 'baseUrl',
            type: 'string',
            default: 'requis',
            description: (
              <>
                URL de l’API. Côté serveur, elle doit être absolue. Dans le navigateur, une URL relative comme{' '}
                <code>/api</code> est résolue contre l’origine de la page.
              </>
            ),
          },
          {
            name: 'defaultHeaders',
            type: 'objet ou fonction (sync ou async)',
            default: 'aucun',
            description: (
              <>
                En-têtes ajoutés à chaque requête. Une fonction est appelée à chaque requête : c’est là que tu lis un
                cookie avec <code>cookies()</code> ou une variable d’environnement.
              </>
            ),
          },
          {name: 'timeoutMs', type: 'number', default: '10000', description: 'Délai avant abandon de la requête.'},
        ]}
      />

      <h2>Appeler l’API</h2>
      <CodeBlock
        title="Méthodes du client"
        code={`client.get<T>(path, options?)
client.post<T>(path, body, options?)
client.put<T>(path, body, options?)
client.patch<T>(path, body, options?)
client.delete<T>(path, options?)
// toutes renvoient Promise<Result<T, ServerPatternsError>>

// options : { headers?, query?: { clé: string | number | boolean | undefined }, signal? }`}
      />
      <p>
        Le corps est envoyé en JSON (<code>Content-Type: application/json</code> seulement s’il y a un corps). Les
        paramètres <code>query</code> à <code>undefined</code> sont ignorés.
      </p>
      <Example file="api-client/lib/services/catalog-service.ts" />

      <h2>Erreurs renvoyées</h2>
      <div className="wide overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Situation</th>
              <th scope="col">error.code</th>
              <th scope="col">error.status</th>
              <th scope="col">error.details</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Réponse 400 ou 422</td><td><code>VALIDATION_ERROR</code></td><td>statut reçu</td><td>corps de la réponse</td></tr>
            <tr><td>Réponse 401 ou 403</td><td><code>UNAUTHORIZED</code></td><td>statut reçu</td><td>corps de la réponse</td></tr>
            <tr><td>Réponse 404</td><td><code>NOT_FOUND</code></td><td>404</td><td>corps de la réponse</td></tr>
            <tr><td>Autre statut d’erreur</td><td><code>SERVER_ERROR</code></td><td>statut reçu</td><td>corps de la réponse</td></tr>
            <tr><td>Réponse 2xx dont le corps n’est pas du JSON</td><td><code>SERVER_ERROR</code></td><td>aucun</td><td>début du corps</td></tr>
            <tr><td>Timeout, annulation, serveur injoignable</td><td><code>NETWORK_ERROR</code></td><td>aucun</td><td>aucun</td></tr>
            <tr><td><code>baseUrl</code> relative côté serveur</td><td><code>VALIDATION_ERROR</code></td><td>aucun</td><td>aucun</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Une réponse 204 ou un corps vide donne <code>ok(undefined)</code>. Le <code>details</code> d’une erreur
        contient le JSON parsé, ou le texte brut s’il ne s’agit pas de JSON.
      </p>

      <Callout title="Le timeout reste actif avec ton propre signal">
        Si tu passes un <code>signal</code> (par exemple pour annuler une requête), il est combiné au timeout : la
        requête s’arrête au premier des deux.
      </Callout>

      <h2>Depuis le navigateur</h2>
      <p>
        Le client fonctionne aussi côté client, avec une <code>baseUrl</code> relative. Mais pour appeler ton propre
        backend depuis tes composants, une <Link href="/docs/primitives/server-action">Server Action</Link> est plus
        simple : elle est typée de bout en bout et n’expose aucune URL.
      </p>
    </DocPage>
  );
}
