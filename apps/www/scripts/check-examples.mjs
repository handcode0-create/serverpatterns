// Compile chaque groupe d'exemples (examples/<groupe>/) comme un mini-projet Next.js,
// contre les VRAIS packages @serverpatterns/* du monorepo.
// Un exemple de la doc qui ne compile pas fait échouer ce script.
//
// Usage (depuis apps/www, après `npm install` à la racine du dépôt et `npm run build` des packages) :
//   npm run check:examples
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const www = join(here, '..');
const examplesDir = join(www, 'examples');
// Dossier de travail DANS apps/www pour que la résolution trouve next/react (apps/www/node_modules)
// puis zod et @serverpatterns/* (node_modules à la racine du dépôt).
const workDir = join(www, '.examples-check');
const tsc = join(www, 'node_modules/typescript/bin/tsc');

rmSync(workDir, { recursive: true, force: true });
mkdirSync(workDir, { recursive: true });

const groups = readdirSync(examplesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let failures = 0;
for (const group of groups) {
  const target = join(workDir, group);
  cpSync(join(examplesDir, group), target, { recursive: true });
  writeFileSync(
    join(target, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['dom', 'dom.iterable', 'esnext'],
          module: 'esnext',
          moduleResolution: 'bundler',
          jsx: 'preserve',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          esModuleInterop: true,
          isolatedModules: true,
          types: ['node', 'react'],
          baseUrl: '.',
          paths: { '@/*': ['./*'] },
        },
        include: ['**/*.ts', '**/*.tsx'],
      },
      null,
      2
    )
  );
  const run = spawnSync(process.execPath, [tsc, '-p', join(target, 'tsconfig.json')], { encoding: 'utf-8' });
  if (run.status === 0) {
    console.log(`✓ ${group}`);
  } else {
    failures++;
    console.log(`✗ ${group}\n${run.stdout}${run.stderr}`);
  }
}

rmSync(workDir, { recursive: true, force: true });
if (failures > 0) {
  console.error(`\n${failures} groupe(s) d'exemples ne compilent pas.`);
  process.exit(1);
}
console.log(`\nTous les exemples compilent (${groups.length} groupes).`);
