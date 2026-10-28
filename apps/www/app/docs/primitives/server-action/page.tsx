import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'withServerAction',
  description: 'Server Action validée, avec un retour { success, data | error } sans exception.',
};

export default function ServerActionPage() {
  return (
    <DocPage
      href="/docs/primitives/server-action"
      source="app/docs/primitives/server-action/page.tsx"
      title="withServerAction"
      lead="Une Server Action est un point d’entrée HTTP public, même si elle ressemble à un appel de fonction. withServerAction valide son entrée et garantit que le client reçoit toujours un objet { success, data } ou { success, error }."
    >
      <h2>Signature</h2>
      <CodeBlock
        title="@serverpatterns/next"
        code={`function withServerAction<TInput, TResult>(options: {
  inputSchema: SchemaLike<TInput>;   // un schéma Zod 3 ou Zod 4
  action: (input: TInput) => Promise<Result<TResult, ServerPatternsError>>;
}): (input: TInput) => Promise<ServerActionResult<TResult>>;

type ServerActionResult<TResult> =
  | { success: true; data: TResult }
  | { success: false; error: { code: string; message: string } };`}
      />
      <p>
        Côté client, l’erreur est un objet simple <code>{'{ code, message }'}</code> : une instance de classe ne peut
        pas traverser la frontière serveur/client.
      </p>

      <h2>Exemple</h2>
      <Example file="server-action/lib/actions/update-username.ts" />
      <Example file="server-action/components/username-form.tsx" />

      <h2>Ce que fait le wrapper</h2>
      <ol>
        <li>Valide l’entrée avec <code>inputSchema</code>. En cas d’échec : <code>VALIDATION_ERROR</code>, l’action n’est pas appelée.</li>
        <li>Appelle ton action avec l’entrée typée.</li>
        <li>Transforme le <code>Result</code> en <code>ServerActionResult</code>.</li>
        <li>
          Rattrape toute exception levée par l’action. Le client reçoit <code>UNKNOWN_ERROR</code> avec le message
          « Erreur inattendue » : le message d’origine, qui peut contenir des détails internes, n’est pas exposé. Si
          l’exception est une <code>ServerPatternsError</code>, son code et son message sont conservés.
        </li>
      </ol>

      <Callout title="Qui appelle l’action ?" type="warning">
        Dans cet exemple, <code>userId</code> vient du client : n’importe qui peut envoyer celui d’un autre utilisateur.
        Dès qu’une action agit au nom d’un utilisateur, prends son identité dans la session avec{' '}
        <Link href="/docs/primitives/auth">withAuth</Link>.
      </Callout>

      <p>
        Range tes actions dans <code>lib/actions/</code> avec la directive <code>&quot;use server&quot;</code> en tête
        de fichier : c’est là que le CLI les génère.
      </p>
    </DocPage>
  );
}
