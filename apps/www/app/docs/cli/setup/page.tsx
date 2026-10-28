import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import {cliCommands} from '@/lib/commands';

export const metadata: Metadata = {
  title: 'CLI : vue d’ensemble',
  description: 'Lancer le CLI, structure détectée, ce qu’il génère et ce qu’il ne fait pas.',
};

export default function CliSetupPage() {
  return (
    <DocPage
      href="/docs/cli/setup"
      source="app/docs/cli/setup/page.tsx"
      title="Le CLI"
      lead="@serverpatterns/cli écrit les fichiers à ta place, comme shadcn le fait pour les composants : le code généré est dans ton projet, tu le lis et tu le modifies librement."
    >
      <h2>Lancer une commande</h2>
      <p>Pas besoin d’installation globale. À la racine de ton projet Next.js :</p>
      <PackageManagerTabs commands={cliCommands('init')} />
      <p>
        Toutes les commandes sont interactives : le CLI pose ses questions dans le terminal, il n’y a ni options en
        ligne de commande ni fichier de configuration. Seul le nom de la ressource ou de l’action peut être passé en
        argument.
      </p>

      <h2>Commandes</h2>
      <div className="wide overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Commande</th>
              <th scope="col">Ce qu’elle fait</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Link href="/docs/cli/init" className="no-underline"><code>init</code></Link></td>
              <td>Installe les dépendances et crée <code>lib/api/</code> et <code>lib/actions/</code>.</td>
            </tr>
            <tr>
              <td><Link href="/docs/cli/add-api" className="no-underline"><code>add api &lt;nom&gt;</code></Link></td>
              <td>Génère un client API et les Route Handlers de la ressource.</td>
            </tr>
            <tr>
              <td><Link href="/docs/cli/add-action" className="no-underline"><code>add action &lt;nom&gt;</code></Link></td>
              <td>Génère une Server Action avec son schéma Zod, protégée par rôles si besoin.</td>
            </tr>
            <tr>
              <td><code>help</code>, <code>--version</code></td>
              <td>Affiche l’aide ou la version.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Structure détectée</h2>
      <p>
        Si ton projet a un dossier <code>app/</code> à la racine, le CLI écrit dans <code>app/</code> et{' '}
        <code>lib/</code>. S’il utilise <code>src/app/</code> (l’option <code>src/</code> de create-next-app), il écrit
        dans <code>src/app/</code> et <code>src/lib/</code>. Les imports générés sont relatifs : l’alias <code>@/</code>{' '}
        n’est pas nécessaire.
      </p>

      <h2>Fichiers existants</h2>
      <p>
        Si un fichier à générer existe déjà, le CLI demande avant de l’écraser ; la réponse par défaut est non. Le
        fichier <code>lib/auth/session.ts</code> n’est jamais écrasé.
      </p>

      <Callout title="Le code généré est un point de départ">
        Le CLI crée la structure : schémas, wrappers, imports, gestion d’erreurs. La logique métier et les champs réels
        de tes ressources restent à écrire là où il laisse des commentaires <code>TODO</code>.
      </Callout>
    </DocPage>
  );
}
