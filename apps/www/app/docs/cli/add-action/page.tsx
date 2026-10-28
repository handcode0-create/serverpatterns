import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import CodeBlock from '@/components/CodeBlock';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import {cliCommands} from '@/lib/commands';
import Terminal from '@/components/Terminal';
import {cliTranscripts} from '@/lib/cli-transcripts';
import {cliOutput} from '@/lib/generated/cli-output';

export const metadata: Metadata = {
  title: 'serverpatterns add action',
  description: 'Génère une Server Action avec son schéma Zod, protégée par rôles si besoin.',
};

export default function CliAddActionPage() {
  return (
    <DocPage
      href="/docs/cli/add-action"
      source="app/docs/cli/add-action/page.tsx"
      title="add action"
      lead="Génère une Server Action dans lib/actions/, avec le schéma Zod construit champ par champ et, si tu donnes des rôles, la protection withAuth."
    >
      <PackageManagerTabs commands={cliCommands('add action <nom>')} />

      <h2>Questions posées</h2>
      <Terminal command="npx @serverpatterns/cli add action update-stock" transcript={cliTranscripts.addAction} />
      <ol>
        <li>
          <strong>Les champs</strong>, un par un : nom (identifiant TypeScript valide, sans doublon), type (
          <code>string</code>, <code>number</code> ou <code>boolean</code>) et caractère optionnel. Laisse le nom vide
          pour terminer.
        </li>
        <li>
          <strong>Restriction par rôles</strong> : si oui, liste des rôles séparés par des virgules. L’action est alors
          générée avec <code>withAuth</code>, sinon avec <code>withServerAction</code>.
        </li>
      </ol>

      <h2>Avec des rôles</h2>
      <p>
        La commande ci-dessus génère l’action, et <code>lib/auth/session.ts</code> s’il n’existe pas encore :
      </p>
      <CodeBlock title={cliOutput.rbacAction.path} code={cliOutput.rbacAction.code} />
      <CodeBlock title={cliOutput.sessionStub.path} code={cliOutput.sessionStub.code} />
      <p>
        Tant que <code>getSession</code> renvoie <code>null</code>, l’action répond <code>UNAUTHORIZED</code> à tout le
        monde : c’est volontaire. Branche-la sur ton authentification en suivant{' '}
        <Link href="/docs/primitives/auth">withAuth</Link>.
      </p>

      <h2>Sans rôles</h2>
      <p>
        Pour <code>add action create-order</code> avec trois champs (<code>productId</code>, <code>quantity</code>,{' '}
        <code>note</code> optionnel) et sans rôles :
      </p>
      <CodeBlock title={cliOutput.plainAction.path} code={cliOutput.plainAction.code} />
      <p>
        L’action générée renvoie l’entrée telle quelle (<code>ok(input)</code>) : remplace-la par ta logique métier à
        l’endroit du <code>TODO</code>.
      </p>
    </DocPage>
  );
}
