/**
 * Forme minimale d'un schéma de validation attendue par les handlers et les
 * Server Actions : un objet avec `safeParse`. Zod 3 et Zod 4 la respectent
 * tous les deux. Typer structurellement (au lieu de `z.ZodType`) évite les
 * conflits de types quand le projet utilise une autre version majeure de Zod
 * que celle avec laquelle ServerPatterns a été compilé.
 */
export interface SchemaLike<T> {
  safeParse(data: unknown): SafeParseResultLike<T>;
}

/** Problème de validation : chemin du champ + message (format commun à Zod 3 et 4). */
export interface ValidationIssueLike {
  readonly path: ReadonlyArray<PropertyKey>;
  readonly message: string;
}

export type SafeParseResultLike<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: ReadonlyArray<ValidationIssueLike> } };

/**
 * Transforme une erreur de validation en message lisible, une ligne par champ :
 * "quantity: Expected number, received string; email: Invalid email".
 * Usage interne aux handlers et Server Actions (au lieu du JSON brut de Zod).
 */
export function formatZodError(error: { issues: ReadonlyArray<ValidationIssueLike> }): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.map(String).join(".");
      return path.length > 0 ? `${path}: ${issue.message}` : issue.message;
    })
    .join("; ");
}
