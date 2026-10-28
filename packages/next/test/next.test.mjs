// Tests des adaptateurs @serverpatterns/next — exécutés sur le build (dist/).
// Lancer : npm run build && npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { NextRequest } from "next/server.js";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import {
  createGetHandler,
  createPostHandler,
  createPatchHandler,
  createDeleteHandler,
  withServerAction,
  withAuth,
} from "../dist/index.js";

const req = (url, init) => new NextRequest(new URL(url, "http://localhost"), init);
const json = async (response) => ({ status: response.status, body: await response.json() });

test("GET : query validée, réponse { success, data }", async () => {
  const GET = createGetHandler({
    querySchema: z.object({ q: z.string() }),
    handler: async ({ q }) => ok({ q }),
  });
  assert.deepEqual(await json(await GET(req("/api?q=abc"))), { status: 200, body: { success: true, data: { q: "abc" } } });
});

test("GET : erreur Zod lisible et 400", async () => {
  const GET = createGetHandler({ querySchema: z.object({ q: z.string() }), handler: async () => ok(1) });
  const { status, body } = await json(await GET(req("/api")));
  assert.equal(status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.match(body.error.message, /^q: /);
});

test("params de route : objet (Next 14) et Promise (Next 15+)", async () => {
  const GET = createGetHandler({ handler: async (_q, _r, params) => ok(params) });
  assert.deepEqual((await json(await GET(req("/api/users/7"), { params: { id: "7" } }))).body.data, { id: "7" });
  assert.deepEqual((await json(await GET(req("/api/users/8"), { params: Promise.resolve({ id: "8" }) }))).body.data, { id: "8" });
  assert.deepEqual((await json(await GET(req("/api/users")))).body.data, {}, "route statique : params vide");
});

test("codes d'erreur → statuts HTTP ; status de l'API distante prioritaire", async () => {
  const cases = [
    [new ServerPatternsError("NOT_FOUND", "x"), 404],
    [new ServerPatternsError("UNAUTHORIZED", "x"), 401],
    [new ServerPatternsError("NETWORK_ERROR", "x"), 502],
    [new ServerPatternsError("SERVER_ERROR", "x", { status: 503 }), 503],
  ];
  for (const [error, status] of cases) {
    const GET = createGetHandler({ handler: async () => err(error) });
    const response = await json(await GET(req("/api")));
    assert.equal(response.status, status);
    assert.deepEqual(Object.keys(response.body.error).sort(), ["code", "message"], "jamais de details/cause exposés");
  }
});

test("POST : JSON invalide, corps vide et validation", async () => {
  const POST = createPostHandler({ bodySchema: z.object({ name: z.string() }), handler: async (b) => ok(b) });
  const post = (body) => POST(req("/api", { method: "POST", body, headers: { "content-type": "application/json" } }));
  assert.equal((await json(await post("{bad"))).status, 400);
  assert.equal((await json(await post(""))).status, 400);
  assert.match((await json(await post('{"name":1}'))).body.error.message, /^name: /);
  assert.deepEqual((await json(await post('{"name":"a"}'))).body, { success: true, data: { name: "a" } });
});

test("PATCH : reçoit le corps validé et l'id du segment [id]", async () => {
  const PATCH = createPatchHandler({
    bodySchema: z.object({ qty: z.number() }),
    handler: async (body, _r, params) => ok({ ...body, id: params.id }),
  });
  const response = await PATCH(req("/api/x/9", { method: "PATCH", body: '{"qty":3}' }), { params: Promise.resolve({ id: "9" }) });
  assert.deepEqual((await json(response)).body.data, { qty: 3, id: "9" });
});

test("DELETE : sans corps (même avec bodySchema) et avec corps", async () => {
  const DELETE = createDeleteHandler({
    bodySchema: z.object({ reason: z.string() }).optional(),
    handler: async (body, _r, params) => ok({ id: params.id, body: body ?? null }),
  });
  const noBody = await json(await DELETE(req("/api/x/1", { method: "DELETE" }), { params: { id: "1" } }));
  assert.deepEqual(noBody.body.data, { id: "1", body: null });
  const withBody = await json(await DELETE(req("/api/x/2", { method: "DELETE", body: '{"reason":"doublon"}' }), { params: { id: "2" } }));
  assert.deepEqual(withBody.body.data, { id: "2", body: { reason: "doublon" } });
});

test("withServerAction : succès, validation, erreur métier et exception", async () => {
  const action = withServerAction({
    inputSchema: z.object({ n: z.number() }),
    action: async ({ n }) => {
      if (n === 0) return err(new ServerPatternsError("NOT_FOUND", "zéro"));
      if (n < 0) throw new Error("secret interne");
      return ok(n * 2);
    },
  });
  assert.deepEqual(await action({ n: 2 }), { success: true, data: 4 });
  assert.match((await action({ n: "x" })).error.message, /^n: .*number/i);
  assert.deepEqual(await action({ n: 0 }), { success: false, error: { code: "NOT_FOUND", message: "zéro" } });
  const thrown = await action({ n: -1 });
  assert.equal(thrown.error.code, "UNKNOWN_ERROR");
  assert.doesNotMatch(thrown.error.message, /secret interne/, "le message d'une exception ne fuit pas");
});

test("withAuth : sans session, rôle insuffisant, rôle OK", async () => {
  const make = (session) =>
    withAuth({
      getSession: async () => session,
      requiredRoles: ["admin"],
      inputSchema: z.object({ sku: z.string() }),
      action: async (input, s) => ok({ ...input, by: s.userId }),
    });
  assert.equal((await make(null)({ sku: "A" })).error.message, "Authentification requise");
  assert.equal((await make({ userId: "u", roles: ["viewer"] })({ sku: "A" })).error.message, "Rôle insuffisant pour cette action");
  assert.deepEqual(await make({ userId: "u", roles: ["admin"] })({ sku: "A" }), { success: true, data: { sku: "A", by: "u" } });
});
