"use server";

import { z } from "zod";
import { withAuth, ok, err } from "@serverpatterns/next";
import { ServerPatternsError } from "@serverpatterns/core";
import { getSession } from "../auth/session"; // TODO: branche ce fichier sur ton système d'auth réel (NextAuth, Clerk, etc.)

const inputSchema = z.object({
  sku: z.string(),
  quantity: z.number(),
});

/**
 * Action protégée — rôles autorisés : admin, stock_manager.
 * "getSession" doit être fourni par toi : ServerPatterns ne prend pas position
 * sur ton système d'authentification, juste sur la façon de le brancher.
 */
export const updateStock = withAuth({
  getSession,
  requiredRoles: ["admin", "stock_manager"],
  inputSchema,
  action: async (input, session) => {
    try {
      // TODO: implémente la logique métier de "update-stock" (session.userId disponible)
      return ok(input);
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Échec de l'action update-stock", { cause }));
    }
  },
});
