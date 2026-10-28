"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { withServerAction } from "@serverpatterns/next";
import { ok, err, ServerPatternsError } from "@serverpatterns/core";

interface Suggestion {
  id: string;
  title: string;
  votes: number;
}

const FILE_PATH = path.join(process.cwd(), "data/suggestions.json");

export const vote = withServerAction({
  inputSchema: z.object({ id: z.string().min(1, "ID requis") }),
  action: async ({ id }) => {
    try {
      // Fichier absent au premier lancement : on part d'une liste vide
      const content = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
      const suggestions = JSON.parse(content) as Suggestion[];

      const item = suggestions.find((suggestion) => suggestion.id === id);
      if (!item) {
        return err(new ServerPatternsError("NOT_FOUND", "Suggestion introuvable"));
      }

      item.votes = Number(item.votes ?? 0) + 1;

      await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
      await fs.writeFile(FILE_PATH, JSON.stringify(suggestions, null, 2), "utf-8");

      revalidatePath("/feedback");
      return ok(item);
    } catch (cause) {
      return err(new ServerPatternsError("SERVER_ERROR", "Impossible d'enregistrer le vote", { cause }));
    }
  },
});
