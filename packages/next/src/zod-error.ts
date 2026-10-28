import type { z } from "zod";

/**
 * Transforme une erreur Zod en message lisible, une ligne par champ :
 * "quantity: Expected number, received string; email: Invalid email".
 * Usage interne aux handlers et Server Actions (au lieu du JSON brut de Zod).
 */
export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path.length > 0 ? `${path}: ${issue.message}` : issue.message;
    })
    .join("; ");
}
