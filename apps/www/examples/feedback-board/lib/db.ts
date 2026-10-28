import { promises as fs } from "node:fs";
import path from "node:path";

export interface Suggestion {
  id: string;
  title: string;
  votes: number;
}

const FILE_PATH = path.join(process.cwd(), "data/suggestions.json");

// Renvoie la suggestion mise à jour, ou null si l'id n'existe pas.
export async function incrementVote(id: string): Promise<Suggestion | null> {
  const content = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
  const suggestions = JSON.parse(content) as Suggestion[];

  const item = suggestions.find((suggestion) => suggestion.id === id);
  if (!item) return null;

  item.votes = Number(item.votes ?? 0) + 1;
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(suggestions, null, 2), "utf-8");
  return item;
}
