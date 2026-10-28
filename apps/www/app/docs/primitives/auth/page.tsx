import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'withAuth',
  description: 'Server Action protégée par ta session et des rôles (RBAC).',
};

export default function AuthPage() {
  return (
    <DocPage
      href="/docs/primitives/auth"
      source="app/docs/primitives/auth/page.tsx"
      title="withAuth"
      lead="withServerAction, plus une vérification de session et de rôles avant d’exécuter l’action. ServerPatterns ne fournit pas d’authentification : tu branches la tienne avec une fonction getSession."
    >
      <h2>Signature</h2>
      <CodeBlock
        title="@serverpatterns/next"
        code={`interface AuthSession {
  userId: string;
  roles: string[];
}

type GetSessionFn = () => Promise<AuthSession | null>;

function withAuth<TInput, TResult>(options: {
  getSession: GetSessionFn;
  requiredRoles?: string[];          // absent ou vide : toute session valide suffit
  inputSchema: SchemaLike<TInput>;
  action: (input: TInput, session: AuthSession) => Promise<Result<TResult, ServerPatternsError>>;
}): (input: TInput) => Promise<ServerActionResult<TResult>>;`}
      />

      <h2>1. Brancher ta session</h2>
      <p>
        <code>getSession</code> lit ta session réelle et la ramène à <code>{'{ userId, roles }'}</code>, ou{' '}
        <code>null</code> si personne n’est connecté :
      </p>
      <Example file="auth/lib/auth/session.ts" />
      <p>
        Avec <Link href="/docs/cli/add-action">add action</Link> et des rôles, le CLI crée ce fichier s’il n’existe pas.
        La version générée renvoie <code>null</code> : tant que tu ne l’as pas branchée, toute action protégée répond{' '}
        <code>UNAUTHORIZED</code>.
      </p>

      <h2>2. Protéger une action</h2>
      <Example file="auth/lib/actions/delete-article.ts" />

      <h2>Ordre des vérifications</h2>
      <ol>
        <li>Pas de session : <code>UNAUTHORIZED</code>, « Authentification requise ».</li>
        <li>
          Aucun des <code>requiredRoles</code> dans <code>session.roles</code> : <code>UNAUTHORIZED</code>, « Rôle
          insuffisant pour cette action ».
        </li>
        <li>Entrée invalide : <code>VALIDATION_ERROR</code>.</li>
        <li>L’action est appelée avec l’entrée typée et la session.</li>
      </ol>

      <Callout title="Ne revérifie pas dans l’action">
        L’action ne s’exécute que si la session et les rôles sont valides : inutile d’appeler <code>getSession()</code>{' '}
        à nouveau. Utilise <code>session.userId</code> pour savoir qui agit, plutôt qu’un identifiant envoyé par le
        client.
      </Callout>
    </DocPage>
  );
}
