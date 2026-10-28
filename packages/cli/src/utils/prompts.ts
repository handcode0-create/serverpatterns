import * as p from "@clack/prompts";

/** p.confirm avec des libellés en français (Oui / Non) au lieu de Yes / No. */
export function confirm(options: Parameters<typeof p.confirm>[0]) {
  return p.confirm({ active: "Oui", inactive: "Non", ...options });
}
