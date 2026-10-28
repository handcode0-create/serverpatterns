import { z } from "zod";
import { createPostHandler } from "@serverpatterns/next";
import { shop } from "@/lib/api/shop";

export const POST = createPostHandler({
  bodySchema: z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  }),
  handler: async (body) => shop.post<{ id: string }>("/orders", body),
});
