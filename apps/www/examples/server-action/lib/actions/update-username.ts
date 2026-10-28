"use server";

import { z } from "zod";
import { withServerAction } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import { db } from "@/lib/db";

export const updateUsername = withServerAction({
  inputSchema: z.object({
    userId: z.string().min(1),
    username: z.string().min(3).max(20),
  }),
  action: async (input) => {
    const user = await db.users.rename(input.userId, input.username);
    if (!user) {
      return err(new ServerPatternsError("NOT_FOUND", "Utilisateur introuvable"));
    }
    return ok({ username: user.username });
  },
});
