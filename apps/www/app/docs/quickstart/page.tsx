import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Example from '@/components/Example';

export const metadata: Metadata = {
  title: 'Quickstart',
  description: 'Un service, un Route Handler et une Server Action reliés de bout en bout.',
};

export default function QuickstartPage() {
  return (
    <DocPage
      href="/docs/quickstart"
      source="app/docs/quickstart/page.tsx"
      lead="On construit la création d’une tâche : un service qui renvoie un Result, exposé à la fois en Route Handler (pour une app mobile ou un partenaire) et en Server Action (pour ton interface React)."
    >
      <h2>1. Le service</h2>
      <p>
        La logique métier ne lève pas d’exception pour un cas attendu : elle renvoie <code>ok(…)</code> ou{' '}
        <code>err(…)</code>. Le type de retour annonce donc les deux issues possibles.
      </p>
      <Example file="quickstart/lib/services/tasks.ts" />

      <h2>2. Le Route Handler</h2>
      <p>
        <code>createPostHandler</code> lit le corps JSON, le valide avec le schéma Zod, appelle ton handler et
        transforme le <code>Result</code> en réponse HTTP. Le handler reçoit un <code>body</code> déjà typé.
      </p>
      <Example file="quickstart/app/api/tasks/route.ts" />
      <p>Les réponses ont toujours l’une de ces deux formes :</p>
      <CodeBlock
        title="POST /api/tasks : 200"
        language="json"
        wrap
        code={`{ "success": true, "data": { "id": "2f1c…", "title": "Relancer le client", "done": false } }`}
      />
      <CodeBlock
        title="POST /api/tasks avec un titre trop court : 400"
        language="json"
        wrap
        code={`{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "title: Le titre doit faire au moins 3 caractères." } }`}
      />
      <p>
        Le statut HTTP découle du code d’erreur : <code>VALIDATION_ERROR</code> donne 400, <code>UNAUTHORIZED</code>{' '}
        401, <code>NOT_FOUND</code> 404, <code>NETWORK_ERROR</code> 502, le reste 500. Le détail est dans{' '}
        <Link href="/docs/primitives/get-post-handler">Route Handlers</Link>.
      </p>

      <h2>3. La Server Action</h2>
      <p>Le même service, appelé depuis ton interface sans passer par HTTP :</p>
      <Example file="quickstart/lib/actions/create-task.ts" />

      <h2>4. Le composant client</h2>
      <p>
        L’action ne lève jamais d’exception vers le client : <code>result.success</code> suffit pour savoir quoi
        afficher, et <code>result.data</code> est typé.
      </p>
      <Example file="quickstart/components/create-task-form.tsx" />

      <Callout title="Route Handler ou Server Action ?">
        Depuis tes propres composants React, préfère la Server Action : elle est typée de bout en bout. Le Route
        Handler sert quand un client externe (app mobile, webhook, partenaire) doit appeler ton API en HTTP.
      </Callout>

      <h2>Et ensuite</h2>
      <ul>
        <li>
          Pour appeler une API externe depuis le service, utilise <Link href="/docs/primitives/api-client">createApiClient</Link>.
        </li>
        <li>
          Pour réserver l’action à certains utilisateurs, remplace <code>withServerAction</code> par{' '}
          <Link href="/docs/primitives/auth">withAuth</Link>.
        </li>
        <li>
          Pour générer ces fichiers au lieu de les écrire, vois le <Link href="/docs/cli/setup">CLI</Link>.
        </li>
      </ul>
    </DocPage>
  );
}
