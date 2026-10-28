// Tests des primitives @serverpatterns/core — exécutés sur le build (dist/).
// Lancer : npm run build && npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createHmac } from "node:crypto";
import {
  ok,
  err,
  isOk,
  isErr,
  mapResult,
  unwrap,
  ServerPatternsError,
  createApiClient,
  parsePaginationParams,
  paginateInMemory,
  createPaginatedResult,
  verifyHmacSignature,
  verifyTimestampedHmacSignature,
  createRateLimiter,
  createInMemoryRateLimitStore,
  withCache,
} from "../dist/index.js";

/** Démarre un serveur HTTP local éphémère et renvoie son URL de base. */
async function startServer(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  return { baseUrl: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) };
}

// --- Result -----------------------------------------------------------------

test("Result : ok/err, gardes et helpers", () => {
  const success = ok(2);
  const failure = err(new ServerPatternsError("NOT_FOUND", "absent"));
  assert.ok(isOk(success) && !isErr(success));
  assert.ok(isErr(failure) && !isOk(failure));
  assert.deepEqual(mapResult(success, (n) => n * 10), { success: true, data: 20 });
  assert.equal(mapResult(failure, () => 1), failure);
  assert.equal(unwrap(success), 2);
  assert.throws(() => unwrap(failure), ServerPatternsError);
});

// --- createApiClient --------------------------------------------------------

test("createApiClient : succès JSON, headers dynamiques et query", async (t) => {
  const srv = await startServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ url: req.url, auth: req.headers.authorization ?? null, ct: req.headers["content-type"] ?? null }));
  });
  t.after(srv.close);
  const client = createApiClient({ baseUrl: srv.baseUrl, defaultHeaders: async () => ({ Authorization: "Bearer t" }) });
  const result = await client.get("/users", { query: { page: 2, skip: undefined } });
  assert.ok(isOk(result));
  assert.equal(result.data.url, "/users?page=2");
  assert.equal(result.data.auth, "Bearer t");
  assert.equal(result.data.ct, null, "pas de Content-Type sur un GET sans corps");
});

test("createApiClient : 204 et 200 vide renvoient ok(undefined)", async (t) => {
  const srv = await startServer((req, res) => {
    res.writeHead(req.url === "/204" ? 204 : 200);
    res.end();
  });
  t.after(srv.close);
  const client = createApiClient({ baseUrl: srv.baseUrl });
  assert.deepEqual(await client.delete("/204"), { success: true, data: undefined });
  assert.deepEqual(await client.get("/empty"), { success: true, data: undefined });
});

test("createApiClient : réponse 200 non-JSON → SERVER_ERROR (pas une erreur réseau), sans status", async (t) => {
  const srv = await startServer((_req, res) => {
    res.writeHead(200, { "content-type": "text/html" });
    res.end("<html>maintenance</html>");
  });
  t.after(srv.close);
  const result = await createApiClient({ baseUrl: srv.baseUrl }).get("/");
  assert.ok(isErr(result));
  assert.equal(result.error.code, "SERVER_ERROR");
  assert.equal(result.error.status, undefined);
  assert.match(String(result.error.details), /maintenance/);
});

test("createApiClient : erreurs HTTP → code mappé, status et corps conservés", async (t) => {
  const statusByPath = { "/400": 400, "/401": 401, "/403": 403, "/404": 404, "/422": 422, "/500": 500 };
  const srv = await startServer((req, res) => {
    res.writeHead(statusByPath[req.url], { "content-type": "application/json" });
    res.end(JSON.stringify({ detail: `erreur ${req.url}` }));
  });
  t.after(srv.close);
  const client = createApiClient({ baseUrl: srv.baseUrl });
  const expected = {
    "/400": "VALIDATION_ERROR",
    "/401": "UNAUTHORIZED",
    "/403": "UNAUTHORIZED",
    "/404": "NOT_FOUND",
    "/422": "VALIDATION_ERROR",
    "/500": "SERVER_ERROR",
  };
  for (const [path, code] of Object.entries(expected)) {
    const result = await client.post(path, { a: 1 });
    assert.ok(isErr(result), path);
    assert.equal(result.error.code, code, path);
    assert.equal(result.error.status, statusByPath[path], path);
    assert.deepEqual(result.error.details, { detail: `erreur ${path}` }, path);
  }
});

test("createApiClient : le timeout s'applique même quand l'appelant fournit un signal", async (t) => {
  const srv = await startServer(() => {}); // ne répond jamais
  t.after(srv.close);
  const client = createApiClient({ baseUrl: srv.baseUrl, timeoutMs: 150 });
  const controller = new AbortController();
  const start = Date.now();
  const result = await client.get("/", { signal: controller.signal });
  assert.ok(Date.now() - start < 2000, "doit expirer rapidement");
  assert.equal(result.error.code, "NETWORK_ERROR");
  assert.match(result.error.message, /timeout/);
});

test("createApiClient : l'annulation par l'appelant est signalée comme telle", async (t) => {
  const srv = await startServer(() => {});
  t.after(srv.close);
  const client = createApiClient({ baseUrl: srv.baseUrl, timeoutMs: 5000 });
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 50);
  const result = await client.get("/", { signal: controller.signal });
  assert.equal(result.error.code, "NETWORK_ERROR");
  assert.match(result.error.message, /annulée/);
});

test("createApiClient : baseUrl relative côté serveur → Result en erreur, pas d'exception", async () => {
  const result = await createApiClient({ baseUrl: "/api" }).get("/users");
  assert.ok(isErr(result));
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.match(result.error.message, /absolue/);
});

test("createApiClient : baseUrl relative résolue contre l'origine dans le navigateur", async (t) => {
  const srv = await startServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ url: req.url }));
  });
  t.after(srv.close);
  globalThis.location = { origin: srv.baseUrl };
  t.after(() => delete globalThis.location);
  const result = await createApiClient({ baseUrl: "/api" }).get("/users/1");
  assert.ok(isOk(result));
  assert.equal(result.data.url, "/api/users/1");
});

test("createApiClient : serveur injoignable → NETWORK_ERROR", async () => {
  const result = await createApiClient({ baseUrl: "http://127.0.0.1:1" }).get("/");
  assert.equal(result.error.code, "NETWORK_ERROR");
});

// --- Pagination -------------------------------------------------------------

test("pagination : parse sûr, bornes et méta", () => {
  assert.deepEqual(parsePaginationParams({}), { page: 1, pageSize: 20 });
  assert.deepEqual(parsePaginationParams({ page: "-3", pageSize: "abc" }), { page: 1, pageSize: 20 });
  assert.deepEqual(parsePaginationParams({ page: "2.7", pageSize: "5000" }, { maxPageSize: 50 }), { page: 2, pageSize: 50 });
  const items = Array.from({ length: 45 }, (_, i) => i);
  const page3 = paginateInMemory(items, { page: 3, pageSize: 20 });
  assert.deepEqual(page3.items, [40, 41, 42, 43, 44]);
  assert.equal(page3.totalPages, 3);
  assert.equal(page3.hasNextPage, false);
  assert.equal(page3.hasPreviousPage, true);
  assert.equal(createPaginatedResult([], 0, { page: 1, pageSize: 10 }).totalPages, 1);
});

// --- Webhooks ---------------------------------------------------------------

const secret = "whsec_test";
const rawBody = '{"id":"evt_1","amount":"5000"}';
const hmac = (msg) => createHmac("sha256", secret).update(msg).digest("hex");
const now = () => Math.floor(Date.now() / 1000);

test("webhook : verifyHmacSignature valide / invalide / header manquant", () => {
  assert.equal(verifyHmacSignature({ rawBody, signatureHeader: hmac(rawBody), secret }).valid, true);
  assert.equal(verifyHmacSignature({ rawBody, signatureHeader: hmac("autre"), secret }).valid, false);
  assert.equal(verifyHmacSignature({ rawBody, signatureHeader: "zz-pas-hex", secret }).valid, false);
  assert.equal(verifyHmacSignature({ rawBody, signatureHeader: null, secret }).valid, false);
  assert.equal(
    verifyHmacSignature({
      rawBody,
      signatureHeader: `sha256=${hmac(rawBody)}`,
      secret,
      extractSignature: (h) => h.replace(/^sha256=/, ""),
    }).valid,
    true
  );
});

test("webhook : format Wave (t + corps, sans séparateur)", () => {
  const t = now();
  const header = `t=${t},v1=${hmac(`${t}${rawBody}`)}`;
  assert.equal(verifyTimestampedHmacSignature({ rawBody, signatureHeader: header, secret }).valid, true);
  assert.equal(verifyTimestampedHmacSignature({ rawBody: rawBody + " ", signatureHeader: header, secret }).valid, false);
});

test("webhook : format Stripe (t.corps) avec payloadSeparator", () => {
  const t = now();
  const header = `t=${t},v1=${hmac(`${t}.${rawBody}`)}`;
  assert.equal(verifyTimestampedHmacSignature({ rawBody, signatureHeader: header, secret }).valid, false, "sans séparateur, la signature Stripe ne doit pas passer");
  assert.equal(verifyTimestampedHmacSignature({ rawBody, signatureHeader: header, secret, payloadSeparator: "." }).valid, true);
});

test("webhook : plusieurs v1 (rotation de secret) — valide si l'une correspond", () => {
  const t = now();
  const header = `t=${t},v1=${hmac("ancien-secret")},v1=${hmac(`${t}${rawBody}`)}`;
  assert.equal(verifyTimestampedHmacSignature({ rawBody, signatureHeader: header, secret }).valid, true);
});

test("webhook : timestamp expiré ou header mal formé", () => {
  const old = now() - 3600;
  const header = `t=${old},v1=${hmac(`${old}${rawBody}`)}`;
  assert.equal(verifyTimestampedHmacSignature({ rawBody, signatureHeader: header, secret }).reason, "Timestamp expiré ou invalide");
  assert.equal(verifyTimestampedHmacSignature({ rawBody, signatureHeader: "n'importe quoi", secret }).valid, false);
});

// --- Rate limiting ----------------------------------------------------------

test("rate limit : bloque au-delà de la limite puis se réinitialise", async () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 80 });
  assert.equal((await limiter.check("ip")).allowed, true);
  const second = await limiter.check("ip");
  assert.equal(second.allowed, true);
  assert.equal(second.remaining, 0);
  assert.equal((await limiter.check("ip")).allowed, false);
  assert.equal((await limiter.check("autre-ip")).allowed, true, "les clés sont indépendantes");
  await new Promise((r) => setTimeout(r, 100));
  assert.equal((await limiter.check("ip")).allowed, true);
});

test("rate limit : le store en mémoire purge les fenêtres expirées", async () => {
  const store = createInMemoryRateLimitStore();
  for (let i = 0; i < 500; i++) await store.increment(`k${i}`, 20);
  await new Promise((r) => setTimeout(r, 30));
  // Après expiration, un nouvel appel déclenche la purge : un compteur repart à 1.
  assert.equal((await store.increment("k0", 20)).count, 1);
});

// --- Cache ------------------------------------------------------------------

test("cache : met en cache les succès, jamais les Result en erreur", async () => {
  let calls = 0;
  const fn = withCache(
    async () => {
      calls++;
      return calls === 1 ? err(new ServerPatternsError("NETWORK_ERROR", "coupure")) : ok(`v${calls}`);
    },
    { ttlMs: 60_000 }
  );
  assert.equal((await fn()).success, false);
  assert.deepEqual(await fn(), { success: true, data: "v2" }, "l'erreur n'a pas été resservie");
  assert.deepEqual(await fn(), { success: true, data: "v2" }, "le succès est servi depuis le cache");
  assert.equal(calls, 2);
});

test("cache : TTL, clés par argument et shouldCache personnalisé", async () => {
  let calls = 0;
  const fn = withCache(async (id) => `${id}-${++calls}`, { ttlMs: 50 });
  assert.equal(await fn("a"), "a-1");
  assert.equal(await fn("a"), "a-1");
  assert.equal(await fn("b"), "b-2");
  await new Promise((r) => setTimeout(r, 70));
  assert.equal(await fn("a"), "a-3");

  let n = 0;
  const never = withCache(async () => ++n, { ttlMs: 60_000, shouldCache: () => false });
  await never();
  assert.equal(await never(), 2);
});
