import { z } from "zod";
import { createGetHandler } from "@serverpatterns/next";
import { ok, parsePaginationParams, createPaginatedResult } from "@serverpatterns/core";
import { db } from "@/lib/db";

// GET /api/orders?page=3&pageSize=25
export const GET = createGetHandler({
  querySchema: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
  }),
  handler: async (query) => {
    // page invalide → 1, pageSize plafonné à maxPageSize
    const params = parsePaginationParams(query, { defaultPageSize: 25, maxPageSize: 100 });

    const [orders, total] = await Promise.all([
      db.orders.findMany({ skip: (params.page - 1) * params.pageSize, take: params.pageSize }),
      db.orders.count(),
    ]);

    return ok(createPaginatedResult(orders, total, params));
  },
});
