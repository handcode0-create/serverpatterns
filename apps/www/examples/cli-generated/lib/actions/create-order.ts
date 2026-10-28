"use server";

import { z } from "zod";
import { withServerAction, ok, err } from "@serverpatterns/next";
import { ServerPatternsError } from "@serverpatterns/core";

const inputSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  note: z.string().optional(),
});

export const createOrder = withServerAction({
  inputSchema,
  action: async (input) => {
    try {
      // TODO: implémente la logique métier de "create-order"
      return ok(input);
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Échec de l'action create-order", { cause }));
    }
  },
});
