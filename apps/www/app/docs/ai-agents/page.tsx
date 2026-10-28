import type {Metadata} from 'next';
import DocPage from '@/components/DocPage';
import CodeBlock from '@/components/CodeBlock';

export const metadata: Metadata = {
  title: 'Agents IA',
  description: 'llms.txt, llms-full.txt et un prompt système à copier dans tes projets.',
};

const AGENT_PROMPT = `# Conventions serveur : ServerPatterns

Ce projet Next.js (App Router) utilise ServerPatterns pour toute la couche serveur.

1. Ne lève pas d'exception pour un cas attendu. Les fonctions serveur renvoient un Result
   de @serverpatterns/core : ok(data) ou err(new ServerPatternsError(code, message)).
   Codes : VALIDATION_ERROR, UNAUTHORIZED, NOT_FOUND, NETWORK_ERROR, SERVER_ERROR, UNKNOWN_ERROR.
2. Les appels aux API externes passent par un client createApiClient (lib/api/*.ts),
   jamais par un fetch direct. Le client renvoie un Result, sans exception.
3. Chaque Route Handler est écrit avec createGetHandler, createPostHandler, createPutHandler,
   createPatchHandler ou createDeleteHandler de @serverpatterns/next, avec un schéma Zod
   (querySchema ou bodySchema). L'id d'une ressource vient du segment [id] : 3e argument "params".
4. Chaque Server Action est écrite avec withServerAction, ou withAuth si elle demande une session
   ou des rôles. getSession est défini dans lib/auth/session.ts.
5. Côté client, lis le retour d'une action avec result.success, puis result.data ou result.error.message.
6. Pour créer un nouveau fichier, utilise le CLI plutôt que de l'écrire de zéro :
   npx @serverpatterns/cli add api <nom>
   npx @serverpatterns/cli add action <nom>
7. Référence complète des signatures : https://serverpatterns.vercel.app/llms-full.txt`;

export default function AiAgentsPage() {
  return (
    <DocPage
      href="/docs/ai-agents"
      source="app/docs/ai-agents/page.tsx"
      title="Utiliser ServerPatterns avec un agent IA"
      lead="Des signatures explicites et un seul format d’erreur laissent moins de place à l’improvisation : un agent (Claude Code, Cursor, Copilot) qui connaît les conventions produit un code serveur cohérent avec le reste du projet."
    >
      <h2>llms.txt et llms-full.txt</h2>
      <p>Deux fichiers texte décrivent ServerPatterns pour un modèle de langage :</p>
      <ul>
        <li>
          <a href="/llms.txt">/llms.txt</a> : la liste des pages de documentation, avec une phrase pour chacune.
        </li>
        <li>
          <a href="/llms-full.txt">/llms-full.txt</a> : les signatures publiques, les codes d’erreur, le format des
          réponses, les commandes du CLI et les exemples, en un seul fichier.
        </li>
      </ul>
      <p>
        Les exemples de <code>llms-full.txt</code> sont les mêmes fichiers que ceux de cette documentation, compilés
        contre les vrais packages à chaque mise à jour.
      </p>

      <h2>Prompt système pour ton projet</h2>
      <p>
        Copie ces règles dans le fichier d’instructions de ton agent : <code>CLAUDE.md</code>,{' '}
        <code>.cursor/rules</code>, <code>.github/copilot-instructions.md</code> ou équivalent.
      </p>
      <CodeBlock title="CLAUDE.md" language="text" code={AGENT_PROMPT} />

      <h2>Serveur MCP</h2>
      <p>
        Un serveur MCP qui exposerait les commandes du CLI comme outils pour les agents est envisagé, mais ni développé
        ni planifié dans la version 0.1. En attendant, un agent peut lancer le CLI dans un terminal comme toi.
      </p>
    </DocPage>
  );
}
