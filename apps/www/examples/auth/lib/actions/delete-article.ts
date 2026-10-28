"use server";

import { z } from "zod";
import { withAuth } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const deleteArticle = withAuth({
  getSession,
  requiredRoles: ["admin", "editor"], // il suffit d'avoir l'un des rôles
  inputSchema: z.object({ articleId: z.string().min(1) }),
  action: async (input, session) => {
    const deleted = await db.articles.remove(input.articleId, session.userId);
    if (!deleted) {
      return err(new ServerPatternsError("NOT_FOUND", "Article introuvable"));
    }
    return ok({ articleId: input.articleId });
  },
});
