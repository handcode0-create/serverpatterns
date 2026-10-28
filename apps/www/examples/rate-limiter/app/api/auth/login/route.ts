import { z } from "zod";
import { createPostHandler } from "@serverpatterns/next";
import { createRateLimiter, ok, err, ServerPatternsError } from "@serverpatterns/core";
import { checkCredentials } from "@/lib/auth/login";

// 5 tentatives par tranche de 15 minutes et par adresse IP
const loginLimiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

export const POST = createPostHandler({
  bodySchema: z.object({ email: z.string().email(), password: z.string().min(1) }),
  handler: async (body, request) => {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";

    const limit = await loginLimiter.check(`login:${ip}`);
    if (!limit.allowed) {
      // Pas de code d'erreur dédié : on fixe le statut HTTP 429 explicitement.
      return err(
        new ServerPatternsError("VALIDATION_ERROR", "Trop de tentatives, réessaie plus tard.", { status: 429 })
      );
    }

    const user = await checkCredentials(body.email, body.password);
    if (!user) {
      return err(new ServerPatternsError("UNAUTHORIZED", "Identifiants incorrects"));
    }
    return ok(user);
  },
});
