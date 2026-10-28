import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Ce qui a changé, version par version.',
};

export default function ChangelogPage() {
  return (
    <DocPage
      href="/docs/changelog"
      source="app/docs/changelog/page.tsx"
      lead="Les changements des packages @serverpatterns/core, @serverpatterns/next et @serverpatterns/cli."
    >
      <h2>0.1.0 (en préparation, non publiée)</h2>
      <p>
        Première version. Elle n’est pas encore publiée sur npm : elle le sera après une validation sur un projet en
        production.
      </p>

      <h3>Contenu</h3>
      <ul>
        <li>
          <strong>@serverpatterns/core</strong> : <code>Result</code> et ses helpers, <code>ServerPatternsError</code>,{' '}
          <code>createApiClient</code>, pagination, vérification de signatures webhook, <code>createRateLimiter</code>,{' '}
          <code>withCache</code>.
        </li>
        <li>
          <strong>@serverpatterns/next</strong> : <code>createGetHandler</code>, <code>createPostHandler</code>,{' '}
          <code>createPutHandler</code>, <code>createPatchHandler</code>, <code>createDeleteHandler</code>,{' '}
          <code>withServerAction</code>, <code>withAuth</code>.
        </li>
        <li>
          <strong>@serverpatterns/cli</strong> : <code>init</code>, <code>add api</code>, <code>add action</code>.
        </li>
      </ul>

      <h3>Corrections avant publication (octobre 2026)</h3>
      <ul>
        <li>
          Compatibilité Zod 4 : les schémas Zod 3 et Zod 4 sont acceptés. Avant, un projet installé avec la dernière
          version de Zod obtenait des erreurs de typage dans chaque handler et chaque action.
        </li>
        <li>
          CLI : prise en charge des projets avec dossier <code>src/</code>. Auparavant, le CLI écrivait dans{' '}
          <code>app/</code> à la racine, ce qui masquait toute l’application.
        </li>
        <li>
          CLI : <code>add api</code> génère deux routes, <code>route.ts</code> et <code>[id]/route.ts</code>, et les
          noms composés (<code>order-items</code>) produisent des imports corrects.
        </li>
        <li>
          CLI : <code>add action</code> avec des rôles crée <code>lib/auth/session.ts</code> s’il manque ; libellés
          Oui/Non en français.
        </li>
        <li>
          Handlers : le troisième argument <code>params</code> donne les segments dynamiques, sur Next.js 14 comme 15+.
        </li>
        <li>
          <code>createApiClient</code> : une réponse non JSON n’est plus prise pour une erreur réseau, le corps des
          erreurs est conservé dans <code>error.details</code>, le timeout s’applique aussi avec un{' '}
          <code>signal</code>, et une <code>baseUrl</code> relative fonctionne dans le navigateur au lieu de lever une
          exception.
        </li>
        <li>
          Webhooks : option <code>payloadSeparator</code> pour Stripe et prise en charge de plusieurs signatures{' '}
          <code>v1</code>.
        </li>
        <li>
          <code>withCache</code> ne met plus en cache les <code>Result</code> en erreur ; le store mémoire du rate
          limiter purge les fenêtres expirées.
        </li>
        <li>Messages de validation lisibles (« champ : message ») au lieu du JSON brut de Zod.</li>
        <li>38 tests unitaires sur les trois packages.</li>
      </ul>
    </DocPage>
  );
}
