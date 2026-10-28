import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import {cliCommands, installCommands} from '@/lib/commands';
import {REPO_URL} from '@/lib/docs-nav';

export const metadata: Metadata = {
  title: 'Installation',
  description: 'Prérequis, installation avec ou sans le CLI, et état de la publication npm.',
};

export default function InstallationPage() {
  return (
    <DocPage
      href="/docs/installation"
      source="app/docs/installation/page.tsx"
      lead="Deux façons d’installer ServerPatterns : laisser le CLI installer les dépendances et créer les dossiers, ou ajouter les packages toi-même."
    >
      <Callout title="Les packages ne sont pas encore publiés" type="warning">
        Les commandes ci-dessous échouent tant que <code>@serverpatterns/*</code> n’est pas sur npm. Pour essayer dès
        maintenant, clone le dépôt et suis la section{' '}
        <a href={`${REPO_URL}#tester-le-cli-en-local-sans-publier-sur-npm`}>Tester le CLI en local</a> du README.
      </Callout>

      <h2>Prérequis</h2>
      <ul>
        <li>
          <strong>Node.js 18.17 ou plus récent.</strong>
        </li>
        <li>
          <strong>Next.js 14 ou plus récent, avec l’App Router.</strong> Le Pages Router n’est pas pris en charge. Testé
          sur Next.js 14.2 et 16.
        </li>
        <li>
          <strong>Zod 3.23 ou plus récent, ou Zod 4.</strong> Les deux versions majeures sont acceptées.
        </li>
        <li>
          <strong>Le runtime Node.js</strong>, celui que Next.js utilise par défaut. Le runtime Edge n’est pas pris en
          charge : <code>@serverpatterns/core</code> importe <code>node:crypto</code> pour vérifier les signatures
          webhook.
        </li>
      </ul>

      <h2>Avec le CLI</h2>
      <p>À la racine de ton projet Next.js :</p>
      <PackageManagerTabs commands={cliCommands('init')} />
      <p>La commande :</p>
      <ol>
        <li>te demande ton gestionnaire de paquets (npm, pnpm ou yarn, présélectionné d’après ton lockfile) ;</li>
        <li>
          propose d’installer <code>@serverpatterns/core</code>, <code>@serverpatterns/next</code> et <code>zod</code> ;
        </li>
        <li>
          crée les dossiers <code>lib/api/</code> et <code>lib/actions/</code>, ou <code>src/lib/…</code> si ton projet
          utilise un dossier <code>src/</code>.
        </li>
      </ol>
      <p>
        Elle ne crée aucun fichier de configuration et aucun client API : ceux-ci sont générés ensuite par{' '}
        <Link href="/docs/cli/add-api">add api</Link>. Détails dans la page <Link href="/docs/cli/init">init</Link>.
      </p>

      <h2>Sans le CLI</h2>
      <PackageManagerTabs commands={installCommands('@serverpatterns/core @serverpatterns/next zod')} />
      <p>
        Si tu n’utilises pas Next.js (script Node, autre framework serveur), <code>@serverpatterns/core</code> suffit :
        il ne dépend ni de Next.js ni de Zod.
      </p>
      <PackageManagerTabs commands={installCommands('@serverpatterns/core')} />

      <h2>Variables d’environnement</h2>
      <p>
        ServerPatterns ne lit aucune variable par lui-même. Les clients générés par <code>add api</code> lisent{' '}
        <code>API_BASE_URL</code>, l’adresse de l’API externe qu’ils appellent :
      </p>
      <CodeBlock
        title=".env.local"
        language="bash"
        code={`API_BASE_URL=https://api.monservice.com
# Si tu as choisi un token serveur à serveur avec add api :
API_TOKEN=ton-token`}
      />

      <h2>Et ensuite</h2>
      <p>
        Le <Link href="/docs/quickstart">quickstart</Link> relie un service, un Route Handler et une Server Action en
        quelques fichiers.
      </p>
    </DocPage>
  );
}
