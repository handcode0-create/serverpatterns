import type {Metadata} from 'next';
import Link from 'next/link';
import DocPage from '@/components/DocPage';
import Callout from '@/components/Callout';
import Example from '@/components/Example';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import {cliCommands} from '@/lib/commands';

export const metadata: Metadata = {
  title: 'Guide : feedback board',
  description: 'Une Server Action de vote complète, puis le même code séparé en repository.',
};

export default function FeedbackBoardGuide() {
  return (
    <DocPage
      href="/docs/guide-feedback-board"
      source="app/docs/guide-feedback-board/page.tsx"
      title="Guide : un feedback board"
      lead="Un tableau d’idées triées par votes : un cas simple qui parcourt tout le cycle d’une mutation serveur, de la validation de l’entrée à la revalidation de la page."
    >
      <h2>Ce qu’on veut éviter</h2>
      <p>Une Server Action de vote écrite sans cadre accumule vite trois problèmes :</p>
      <ul>
        <li>
          <strong>Entrée non validée</strong> : une Server Action est un point d’entrée HTTP public. Sans validation, un
          appel forgé peut écrire n’importe quoi dans tes données.
        </li>
        <li>
          <strong>Erreurs incohérentes</strong> : une exception non rattrapée remonte au client, un cas « introuvable »
          renvoie <code>undefined</code>, l’interface ne sait pas quoi afficher.
        </li>
        <li>
          <strong>Tout dans un fichier</strong> : lecture du stockage, règle métier et invalidation du cache mélangées.
        </li>
      </ul>

      <h2>L’action avec ServerPatterns</h2>
      <p>
        Les votes sont stockés dans un fichier JSON pour garder l’exemple autonome ; remplace-le par ta base de données
        en production.
      </p>
      <Example file="feedback-board/lib/actions/vote.ts" />
      <ul>
        <li>
          <code>inputSchema</code> rejette un <code>id</code> vide ou absent avant toute lecture du fichier, avec
          l’erreur <code>VALIDATION_ERROR</code>.
        </li>
        <li>Une suggestion inexistante donne <code>NOT_FOUND</code>, que l’interface peut afficher tel quel.</li>
        <li>
          <code>Number(item.votes ?? 0)</code> protège le compteur si le fichier contient une valeur manquante.
        </li>
        <li>
          Même sans le <code>try/catch</code>, <code>withServerAction</code> transformerait une exception imprévue en{' '}
          <code>UNKNOWN_ERROR</code> sans exposer son message au client.
        </li>
      </ul>

      <Callout title="Écritures concurrentes" type="warning">
        Lire puis réécrire un fichier JSON n’est pas sûr si deux votes arrivent en même temps : le dernier écrase
        l’autre. Avec une base de données, utilise une incrémentation atomique (par exemple <code>UPDATE … SET votes =
        votes + 1</code>).
      </Callout>

      <h2>Séparer l’accès aux données</h2>
      <p>
        Pour que l’action ne contienne que l’orchestration, déplace la lecture et l’écriture dans un module dédié.
        L’action devient courte et le module de données se teste seul.
      </p>
      <Example file="feedback-board/lib/db.ts" />
      <Example file="feedback-board/lib/actions/vote-repository.ts" title="lib/actions/vote.ts (après séparation)" />

      <h2>Générer le squelette</h2>
      <PackageManagerTabs commands={cliCommands('add action vote')} />
      <p>
        Le CLI demande les champs un par un (ici <code>id</code>, de type <code>string</code>) et génère{' '}
        <code>lib/actions/vote.ts</code> avec <code>withServerAction</code>, le schéma Zod et un <code>try/catch</code>{' '}
        prêt à remplir. La logique de vote reste à écrire. Voir <Link href="/docs/cli/add-action">add action</Link>.
      </p>
    </DocPage>
  );
}
