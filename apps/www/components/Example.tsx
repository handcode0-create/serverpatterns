import CodeBlock from '@/components/CodeBlock';
import {examples, type ExampleKey} from '@/lib/generated/examples';

interface ExampleProps {
  /** Clé "<groupe>/<chemin>" d'un fichier de examples/ (compilé par npm run check:examples) */
  file: ExampleKey;
  /** Titre affiché, par défaut le chemin du fichier dans le projet */
  title?: string;
}

/** Affiche un exemple de la doc : le fichier réel, vérifié à la compilation. */
export default function Example({file, title}: ExampleProps) {
  const path = file.split('/').slice(1).join('/');
  const language = file.endsWith('.json') ? 'json' : 'ts';
  return <CodeBlock code={examples[file]} title={title ?? path} language={language} />;
}
