import { z } from "zod";
import { createGetHandler, createPostHandler } from "@serverpatterns/next";
import {
  ok,
  err,
  ServerPatternsError,
  parsePaginationParams,
  createPaginatedResult,
} from "@serverpatterns/core";
import { db } from "@/lib/db";

// GET /api/products?page=2&pageSize=20
export const GET = createGetHandler({
  querySchema: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
  }),
  handler: async (query) => {
    const params = parsePaginationParams(query, { maxPageSize: 50 });
    const [items, total] = await Promise.all([db.products.list(params), db.products.count()]);
    return ok(createPaginatedResult(items, total, params));
  },
});

// POST /api/products
export const POST = createPostHandler({
  bodySchema: z.object({
    name: z.string().min(1),
    price: z.number().int().positive(),
  }),
  handler: async (body) => {
    try {
      return ok(await db.products.create(body));
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Création du produit impossible", { cause }));
    }
  },
});
