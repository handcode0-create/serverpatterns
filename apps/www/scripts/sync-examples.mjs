// Régénère lib/generated/examples.ts à partir des fichiers réels de examples/.
// Les pages affichent ces exemples ; check-examples.mjs vérifie qu'ils compilent.
//
// Usage (depuis apps/www) : npm run sync:examples
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const examplesDir = join(here, '../examples');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const examples = {};
for (const file of walk(examplesDir).sort()) {
  const key = relative(examplesDir, file).split(sep).join('/');
  if (key.startsWith('cli-generated/')) continue; // déjà dans cli-output.ts
  examples[key] = readFileSync(file, 'utf-8');
}

const out = join(here, '../lib/generated/examples.ts');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  `// FICHIER GÉNÉRÉ par scripts/sync-examples.mjs depuis examples/ — ne pas modifier à la main.
// Clé : "<groupe>/<chemin dans le projet>". Chaque groupe compile (npm run check:examples).

export const examples = ${JSON.stringify(examples, null, 2)} as const;

export type ExampleKey = keyof typeof examples;
`
);
console.log(`Écrit : ${out} (${Object.keys(examples).length} fichiers)`);
