import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import {cliCommands} from '@/lib/commands';
import Terminal from '@/components/Terminal';
import {cliTranscripts} from '@/lib/cli-transcripts';

export const metadata: Metadata = {
  title: 'serverpatterns init',
  description: 'Installe les dépendances et crée lib/api et lib/actions.',
};

export default function CliInitPage() {
  return (
    <DocPage
      href="/docs/cli/init"
      source="app/docs/cli/init/page.tsx"
      title="init"
      lead="Prépare un projet Next.js : installe les dépendances et crée les dossiers où les autres commandes génèrent leurs fichiers."
    >
      <PackageManagerTabs commands={cliCommands('init')} />

      <h2>Déroulement</h2>
      <Terminal command="npx @serverpatterns/cli init" transcript={cliTranscripts.init} />
      <ol>
        <li>
          Si <code>package.json</code> ne déclare pas la dépendance <code>next</code>, le CLI le signale et demande s’il
          doit continuer.
        </li>
        <li>
          <strong>Gestionnaire de paquets</strong> : npm, pnpm ou yarn, présélectionné d’après ton lockfile.
        </li>
        <li>
          <strong>Installation</strong> de <code>@serverpatterns/core</code>, <code>@serverpatterns/next</code> et{' '}
          <code>zod</code>. Si elle échoue, le CLI affiche la commande à lancer toi-même et continue.
        </li>
        <li>
          <strong>Dossiers</strong> : <code>lib/api/</code> et <code>lib/actions/</code>, chacun avec un{' '}
          <code>.gitkeep</code> (ou <code>src/lib/…</code> pour un projet avec <code>src/</code>).
        </li>
      </ol>
      <p>
        Si les deux dossiers existent déjà, la commande s’arrête sans rien modifier.
      </p>

      <Callout title="Ce que init ne crée pas">
        Aucun fichier de configuration et aucun client API. Les clients sont générés par ressource avec{' '}
        <Link href="/docs/cli/add-api">add api</Link>.
      </Callout>
    </DocPage>
  );
}
