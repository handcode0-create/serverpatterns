"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { withServerAction } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";
import { incrementVote } from "@/lib/db";

export const vote = withServerAction({
  inputSchema: z.object({ id: z.string().min(1) }),
  action: async ({ id }) => {
    const updated = await incrementVote(id);
    if (!updated) {
      return err(new ServerPatternsError("NOT_FOUND", "Suggestion introuvable"));
    }
    revalidatePath("/feedback");
    return ok(updated);
  },
});
