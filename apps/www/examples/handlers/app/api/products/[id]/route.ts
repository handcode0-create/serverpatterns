import { z } from "zod";
import { createGetHandler, createPatchHandler, createDeleteHandler } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import { db } from "@/lib/db";

const notFound = () => err(new ServerPatternsError("NOT_FOUND", "Produit introuvable"));

// GET /api/products/:id : params.id vient du segment [id]
export const GET = createGetHandler({
  handler: async (_query, _request, params) => {
    const product = await db.products.findById(String(params.id));
    return product ? ok(product) : notFound();
  },
});

// PATCH /api/products/:id
export const PATCH = createPatchHandler({
  bodySchema: z.object({
    name: z.string().min(1).optional(),
    price: z.number().int().positive().optional(),
  }),
  handler: async (body, _request, params) => {
    const updated = await db.products.update(String(params.id), body);
    return updated ? ok(updated) : notFound();
  },
});

// DELETE /api/products/:id : pas de corps attendu
export const DELETE = createDeleteHandler({
  handler: async (_body, _request, params) => {
    await db.products.remove(String(params.id));
    return ok({ id: String(params.id) });
  },
});
