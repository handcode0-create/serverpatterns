// Régénère lib/generated/cli-output.ts à partir des templates RÉELS du CLI
// (packages/cli/dist). Le site affiche ainsi exactement ce que le CLI produit.
//
// Usage :
//   (à la racine du dépôt) npm install && npm run build   # build des packages
//   (dans apps/www)        npm run sync
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cliDist = join(here, '../../../packages/cli/dist');
const load = (p) => import(pathToFileURL(join(cliDist, p)).href);

const { apiClientTemplate, collectionRouteTemplate, itemRouteTemplate } = await load('templates/api-route.ts.template.js');
const { serverActionTemplate, sessionStubTemplate } = await load('templates/server-action.ts.template.js');
const { toKebabCase, toCamelCase, toPascalCase, relativeImport } = await load('utils/fs.js');

// Scénario 1 : `serverpatterns add api users` — toutes les méthodes, token lu dans le cookie "token"
const name = 'users';
const clientPath = `lib/api/${toKebabCase(name)}.ts`;
const collectionPath = `app/api/${toKebabCase(name)}/route.ts`;
const itemPath = `app/api/${toKebabCase(name)}/[id]/route.ts`;
const apiOptions = {
  names: { kebab: toKebabCase(name), camel: toCamelCase(name), pascal: toPascalCase(name) },
  methods: ['get', 'list', 'create', 'update', 'delete'],
  auth: { type: 'cookie', cookieName: 'token' },
  clientImportFromCollectionRoute: relativeImport(collectionPath, clientPath),
  clientImportFromItemRoute: relativeImport(itemPath, clientPath),
};

// Scénario 2 : `serverpatterns add action update-stock` — sku (string), quantity (number), rôles admin + stock_manager
const actionPath = 'lib/actions/update-stock.ts';
const sessionPath = 'lib/auth/session.ts';
const actionOptions = {
  actionName: 'update-stock',
  camelName: toCamelCase('update-stock'),
  fields: [
    { name: 'sku', zodType: 'string', optional: false },
    { name: 'quantity', zodType: 'number', optional: false },
  ],
  requiredRoles: ['admin', 'stock_manager'],
  sessionImport: relativeImport(actionPath, sessionPath),
};

// Scénario 3 : `serverpatterns add action create-order` — sans rôles
const plainActionOptions = {
  actionName: 'create-order',
  camelName: toCamelCase('create-order'),
  fields: [
    { name: 'productId', zodType: 'string', optional: false },
    { name: 'quantity', zodType: 'number', optional: false },
    { name: 'note', zodType: 'string', optional: true },
  ],
  requiredRoles: [],
  sessionImport: '../auth/session',
};

const files = {
  apiClient: { path: clientPath, code: apiClientTemplate(apiOptions) },
  apiCollectionRoute: { path: collectionPath, code: collectionRouteTemplate(apiOptions) },
  apiItemRoute: { path: itemPath, code: itemRouteTemplate(apiOptions) },
  rbacAction: { path: actionPath, code: serverActionTemplate(actionOptions) },
  sessionStub: { path: sessionPath, code: sessionStubTemplate() },
  plainAction: { path: 'lib/actions/create-order.ts', code: serverActionTemplate(plainActionOptions) },
};

const out = join(here, '../lib/generated/cli-output.ts');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  `// FICHIER GÉNÉRÉ par scripts/sync-cli-output.mjs — ne pas modifier à la main.
// Contenu produit par les templates réels de @serverpatterns/cli.

export interface GeneratedFile {
  path: string;
  code: string;
}

export const cliOutput = ${JSON.stringify(files, null, 2)} satisfies Record<string, GeneratedFile>;
`
);
console.log(`Écrit : ${out}`);

// Signatures publiques réelles, extraites des .d.ts compilés (pour llms-full.txt).
const packagesDir = join(here, '../../../packages');
const declarationFiles = {
  core: ['result', 'api-client', 'pagination', 'webhook', 'rate-limit', 'cache'],
  next: ['zod-error', 'handlers', 'server-action', 'auth'],
};
const signatures = {};
for (const [pkg, modules] of Object.entries(declarationFiles)) {
  signatures[pkg] = modules
    .map((module) => {
      const source = readFileSync(join(packagesDir, pkg, 'dist', `${module}.d.ts`), 'utf-8')
        .replace(/^\/\/# sourceMappingURL=.*$/m, '')
        .trim();
      return `// --- ${module}.d.ts ---\n${source}`;
    })
    .join('\n\n');
}
writeFileSync(
  join(here, '../lib/generated/signatures.ts'),
  `// FICHIER GÉNÉRÉ par scripts/sync-cli-output.mjs depuis packages/*/dist/*.d.ts — ne pas modifier à la main.

export const signatures = ${JSON.stringify(signatures, null, 2)} as const;
`
);
console.log('Écrit : lib/generated/signatures.ts');

// Copie aussi le code généré dans examples/cli-generated/ : check-examples le compile
// comme le reste de la doc (le code affiché du CLI doit compiler tel quel).
const generatedDir = join(here, '../examples/cli-generated');
for (const file of Object.values(files)) {
  const target = join(generatedDir, file.path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, file.code);
}
console.log(`Écrit : ${generatedDir}`);
