import {REPO_URL, VERSION} from '@/lib/docs-nav';
import {examples, type ExampleKey} from '@/lib/generated/examples';
import {cliOutput} from '@/lib/generated/cli-output';
import {signatures} from '@/lib/generated/signatures';

// Tout est généré depuis les sources réelles : .d.ts compilés, exemples compilés, sorties du CLI.
export const dynamic = 'force-static';

const fence = (code: string, lang = 'ts') => '```' + lang + '\n' + code.replace(/\n+$/, '') + '\n```';
const example = (key: ExampleKey) => `Fichier ${key.split('/').slice(1).join('/')} :\n${fence(examples[key], key.endsWith('.tsx') ? 'tsx' : 'ts')}`;

export function GET() {
  const body = `# ServerPatterns ${VERSION} : référence complète

Couche serveur standard pour Next.js App Router. Ce fichier est généré à partir du code : les signatures viennent des fichiers .d.ts compilés, les exemples sont compilés contre les vrais packages, et le code du CLI est celui que ses templates produisent.

Statut : version ${VERSION} en préparation, PAS ENCORE PUBLIÉE sur npm. Code : ${REPO_URL}

## Prérequis

- Node.js 18.17+, Next.js 14+ avec App Router (pas de Pages Router).
- Zod 3.23+ ou Zod 4 (peer dependency de @serverpatterns/next).
- Runtime Node.js uniquement : @serverpatterns/core importe node:crypto. Le runtime Edge n'est pas pris en charge.

## Installation

${fence('npx @serverpatterns/cli init\n# ou, sans le CLI :\nnpm install @serverpatterns/core @serverpatterns/next zod', 'bash')}

## Règles d'usage

1. Les fonctions renvoient un Result : { success: true, data } ou { success: false, error }. Ne pas lever d'exception pour un cas attendu.
2. Codes d'erreur : VALIDATION_ERROR (400), UNAUTHORIZED (401), NOT_FOUND (404), NETWORK_ERROR (502), SERVER_ERROR (500), UNKNOWN_ERROR (500). Un status défini sur l'erreur remplace ce statut.
3. Réponse HTTP des Route Handlers : { "success": true, "data": ... } ou { "success": false, "error": { "code", "message" } }. cause et details ne sont jamais renvoyés au client.
4. Retour des Server Actions (withServerAction, withAuth) : { success: true, data } ou { success: false, error: { code: string, message: string } }. Une exception imprévue devient UNKNOWN_ERROR avec le message "Erreur inattendue".
5. Le handler d'un Route Handler reçoit (input, request, params) ; params contient les segments dynamiques déjà résolus (Next 14 et 15+).
6. createApiClient : baseUrl absolue côté serveur ; timeoutMs 10000 par défaut ; 400/422 → VALIDATION_ERROR, 401/403 → UNAUTHORIZED, 404 → NOT_FOUND, autres → SERVER_ERROR ; corps d'erreur dans error.details.
7. Webhooks Stripe : verifyTimestampedHmacSignature avec payloadSeparator: "." (Wave : séparateur vide, le défaut).
8. createRateLimiter : fenêtre fixe ; store mémoire local à chaque instance.
9. withCache : ne met jamais en cache un Result en erreur ni undefined.

## Signatures : @serverpatterns/core

${fence(signatures.core)}

## Signatures : @serverpatterns/next

formatZodError est interne (non exporté par l'index du package).

${fence(signatures.next)}

## CLI : @serverpatterns/cli

Commandes interactives, sans options ni fichier de configuration :
- init : installe @serverpatterns/core, @serverpatterns/next et zod ; crée lib/api/ et lib/actions/ (src/lib/ si le projet utilise src/app/).
- add api <nom> : questions = méthodes (get, list, create, update, delete) et token Bearer (cookie ou variable d'environnement). Crée lib/api/<nom>.ts, app/api/<nom>/route.ts (list, create) et app/api/<nom>/[id]/route.ts (get, update, delete). Le client lit API_BASE_URL.
- add action <nom> : champs un par un (string, number, boolean ; optionnel ou non), puis rôles RBAC facultatifs. Crée lib/actions/<nom>.ts avec withServerAction, ou withAuth si des rôles sont donnés ; crée alors lib/auth/session.ts s'il n'existe pas (getSession renvoie null tant qu'il n'est pas branché).
- Imports générés relatifs (pas d'alias @/ requis). Un fichier existant n'est écrasé qu'après confirmation ; lib/auth/session.ts jamais.

Sortie de "add api users" (toutes les méthodes, token dans le cookie "token") :

Fichier ${cliOutput.apiClient.path} :
${fence(cliOutput.apiClient.code)}

Fichier ${cliOutput.apiCollectionRoute.path} :
${fence(cliOutput.apiCollectionRoute.code)}

Fichier ${cliOutput.apiItemRoute.path} :
${fence(cliOutput.apiItemRoute.code)}

Sortie de "add action update-stock" (rôles admin, stock_manager) :

Fichier ${cliOutput.rbacAction.path} :
${fence(cliOutput.rbacAction.code)}

Fichier ${cliOutput.sessionStub.path} :
${fence(cliOutput.sessionStub.code)}

## Exemples

### Service + Route Handler + Server Action + composant client

${example('quickstart/lib/services/tasks.ts')}

${example('quickstart/app/api/tasks/route.ts')}

${example('quickstart/lib/actions/create-task.ts')}

${example('quickstart/components/create-task-form.tsx')}

### Client HTTP

${example('api-client/lib/clients/catalog.ts')}

${example('api-client/lib/services/catalog-service.ts')}

### Route Handlers avec segment [id] et pagination

${example('handlers/app/api/products/route.ts')}

${example('handlers/app/api/products/[id]/route.ts')}

### withAuth

${example('auth/lib/auth/session.ts')}

${example('auth/lib/actions/delete-article.ts')}

### Webhooks

${example('webhook/app/api/webhooks/wave/route.ts')}

${example('webhook/app/api/webhooks/stripe/route.ts')}

${example('webhook/app/api/webhooks/github/route.ts')}

### Rate limiting

${example('rate-limiter/app/api/auth/login/route.ts')}

${example('rate-limiter/lib/rate-limit/redis-store.ts')}

### Cache

${example('cache/lib/services/exchange-rates.ts')}
`;

  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
