// Tests du générateur @serverpatterns/cli — exécutés sur le build (dist/).
// Lancer : npm run build && npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  relativeImport,
  detectProjectLayout,
  validateName,
  validateFieldName,
} from "../dist/utils/fs.js";
import { apiClientTemplate, collectionRouteTemplate, itemRouteTemplate } from "../dist/templates/api-route.ts.template.js";
import { serverActionTemplate, sessionStubTemplate } from "../dist/templates/server-action.ts.template.js";

test("conversions de noms", () => {
  for (const input of ["order-items", "order_items", "OrderItems", "orderItems", " order items "]) {
    assert.equal(toKebabCase(input), "order-items", input);
    assert.equal(toCamelCase(input), "orderItems", input);
    assert.equal(toPascalCase(input), "OrderItems", input);
  }
  assert.equal(toKebabCase("users"), "users");
  assert.equal(toCamelCase("create-order"), "createOrder");
});

test("validation des noms", () => {
  assert.equal(validateName("users"), undefined);
  assert.equal(validateName("order-items_2"), undefined);
  assert.ok(validateName(""));
  assert.ok(validateName("12abc"));
  assert.ok(validateName("users/admin"));
  assert.equal(validateFieldName(""), undefined, "vide = fin de saisie");
  assert.equal(validateFieldName("productId"), undefined);
  assert.ok(validateFieldName("1bad"));
  assert.ok(validateFieldName("product-id"));
});

test("imports relatifs entre fichiers générés", () => {
  assert.equal(relativeImport("app/api/users/route.ts", "lib/api/users.ts"), "../../../lib/api/users");
  assert.equal(relativeImport("src/app/api/users/[id]/route.ts", "src/lib/api/users.ts"), "../../../../lib/api/users");
  assert.equal(relativeImport("lib/actions/a.ts", "lib/auth/session.ts"), "../auth/session");
  assert.equal(relativeImport("lib/a.ts", "lib/b.ts"), "./b");
});

test("détection de la structure du projet (app/ vs src/app/)", async () => {
  const cwd = process.cwd();
  const root = await mkdtemp(join(tmpdir(), "sp-layout-"));
  try {
    process.chdir(root);
    assert.deepEqual(await detectProjectLayout(), { appDir: "app", libDir: "lib", usesSrcDir: false });
    await mkdir("src/app", { recursive: true });
    assert.deepEqual(await detectProjectLayout(), { appDir: "src/app", libDir: "src/lib", usesSrcDir: true });
    await mkdir("app");
    assert.equal((await detectProjectLayout()).appDir, "app", "app/ à la racine est prioritaire, comme dans Next");
  } finally {
    process.chdir(cwd);
  }
});

const baseOptions = {
  names: { kebab: "order-items", camel: "orderItems", pascal: "OrderItems" },
  auth: { type: "none" },
  clientImportFromCollectionRoute: "../../../lib/api/order-items",
  clientImportFromItemRoute: "../../../../lib/api/order-items",
};

test("client API : noms cohérents, URL en kebab-case, uniquement les méthodes choisies", () => {
  const code = apiClientTemplate({ ...baseOptions, methods: ["get", "delete"] });
  assert.match(code, /export const orderItemsClient = createApiClient/);
  assert.match(code, /`\/order-items\/\$\{encodeURIComponent\(id\)\}`/);
  assert.match(code, /export async function getOrderItems\(/);
  assert.match(code, /export async function deleteOrderItems\(/);
  assert.doesNotMatch(code, /listOrderItems|createOrderItems|PaginationParams|OrderItemsInput/);
});

test("client API : auth cookie / env", () => {
  const cookie = apiClientTemplate({ ...baseOptions, methods: ["get"], auth: { type: "cookie", cookieName: "sid" } });
  assert.match(cookie, /import \{ cookies \} from "next\/headers"/);
  assert.match(cookie, /\.get\("sid"\)/);
  const env = apiClientTemplate({ ...baseOptions, methods: ["get"], auth: { type: "env", envVar: "MY_TOKEN" } });
  assert.match(env, /process\.env\.MY_TOKEN/);
  assert.match(env, /\(\): Record<string, string> =>/);
  assert.doesNotMatch(env, /next\/headers/);
});

test("routes : collection (list/create) et élément [id] (get/update/delete) séparées", () => {
  const all = { ...baseOptions, methods: ["get", "list", "create", "update", "delete"] };
  const collection = collectionRouteTemplate(all);
  const item = itemRouteTemplate(all);
  assert.match(collection, /export const GET = createGetHandler/);
  assert.match(collection, /export const POST = createPostHandler/);
  assert.doesNotMatch(collection, /PATCH|DELETE/);
  assert.match(item, /export const GET = createGetHandler/);
  assert.match(item, /export const PATCH = createPatchHandler/);
  assert.match(item, /export const DELETE = createDeleteHandler/);
  assert.match(item, /params\.id/);
  assert.match(collection, /from "\.\.\/\.\.\/\.\.\/lib\/api\/order-items"/);
  assert.match(item, /from "\.\.\/\.\.\/\.\.\/\.\.\/lib\/api\/order-items"/);
  for (const code of [collection, item]) assert.doesNotMatch(code, /@\//, "aucun alias @/ requis");
});

test("routes : null quand aucune méthode du groupe n'est choisie", () => {
  assert.equal(collectionRouteTemplate({ ...baseOptions, methods: ["get"] }), null);
  assert.equal(itemRouteTemplate({ ...baseOptions, methods: ["list"] }), null);
});

test("server action : withServerAction sans rôles, withAuth + import de session avec rôles", () => {
  const fields = [
    { name: "sku", zodType: "string", optional: false },
    { name: "qty", zodType: "number", optional: true },
  ];
  const plain = serverActionTemplate({ actionName: "a", camelName: "a", fields, requiredRoles: [], sessionImport: "../auth/session" });
  assert.match(plain, /^"use server";/);
  assert.match(plain, /withServerAction/);
  assert.match(plain, /qty: z\.number\(\)\.optional\(\),/);
  assert.doesNotMatch(plain, /getSession/);

  const guarded = serverActionTemplate({ actionName: "a", camelName: "a", fields, requiredRoles: ["admin"], sessionImport: "../auth/session" });
  assert.match(guarded, /import \{ getSession \} from "\.\.\/auth\/session"/);
  assert.match(guarded, /requiredRoles: \["admin"\]/);
  assert.match(sessionStubTemplate(), /export async function getSession\(\): Promise<AuthSession \| null>/);
});
