import { mkdir, writeFile, access, readFile } from "node:fs/promises";
import { dirname, posix } from "node:path";

/**
 * Emplacements réels des dossiers dans le projet Next.js de l'utilisateur.
 * create-next-app propose un dossier `src/` : dans ce cas l'App Router vit
 * dans `src/app`, et Next IGNORE `src/app` si un dossier `app/` existe à la
 * racine. Le CLI ne doit donc jamais écrire dans `app/` quand le projet
 * utilise `src/app`.
 */
export interface ProjectLayout {
  /** "app" ou "src/app" */
  appDir: string;
  /** "lib" ou "src/lib" */
  libDir: string;
  usesSrcDir: boolean;
}

/** Détecte si le projet utilise `app/` à la racine ou `src/app/`. */
export async function detectProjectLayout(): Promise<ProjectLayout> {
  if (await fileExists("app")) {
    return { appDir: "app", libDir: "lib", usesSrcDir: false };
  }
  if ((await fileExists("src/app")) || (await fileExists("src"))) {
    return { appDir: "src/app", libDir: "src/lib", usesSrcDir: true };
  }
  return { appDir: "app", libDir: "lib", usesSrcDir: false };
}

/** Vrai si le package.json du dossier courant déclare la dépendance `next`. */
export async function isNextProject(): Promise<boolean> {
  try {
    const pkg = JSON.parse(await readFile("package.json", "utf-8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return Boolean(pkg.dependencies?.next ?? pkg.devDependencies?.next);
  } catch {
    return false;
  }
}

/**
 * Chemin d'import relatif d'un fichier vers un autre (sans extension .ts),
 * ex: de "app/api/users/route.ts" vers "lib/api/users.ts" → "../../../lib/api/users".
 * Relatif plutôt que "@/..." : fonctionne même si l'alias n'est pas configuré.
 */
export function relativeImport(fromFile: string, toFile: string): string {
  const target = toFile.replace(/\.tsx?$/, "");
  const rel = posix.relative(posix.dirname(fromFile), target);
  return rel.startsWith(".") ? rel : `./${rel}`;
}

/** Nom de ressource/action valide : commence par une lettre, puis lettres, chiffres, "-" ou "_". */
export function validateName(value: string | undefined): string | undefined {
  const trimmed = (value ?? "").trim();
  if (trimmed.length === 0) return "Le nom ne peut pas être vide.";
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(trimmed)) {
    return "Utilise uniquement des lettres, chiffres, - ou _ (et commence par une lettre).";
  }
  return undefined;
}

/** Nom de champ valide en tant qu'identifiant TypeScript. */
export function validateFieldName(value: string | undefined): string | undefined {
  const trimmed = (value ?? "").trim();
  if (trimmed.length === 0) return undefined; // vide = fin de la saisie
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(trimmed)) {
    return "Nom de champ invalide (ex: productId, quantity, is_active).";
  }
  return undefined;
}

/** Vérifie si un fichier existe déjà. */
export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Écrit un fichier en créant les dossiers parents si nécessaire.
 * N'écrase jamais un fichier existant sans que l'appelant l'ait vérifié
 * explicitement au préalable (voir commandes add-api / add-action).
 */
export async function writeGeneratedFile(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf-8");
}

/** Convertit "create-order", "create_order" ou "CreateOrder" en "createOrder" (camelCase). */
export function toCamelCase(input: string): string {
  return toKebabCase(input)
    .split("-")
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

/** Convertit "create-order" en "CreateOrder" (PascalCase). */
export function toPascalCase(input: string): string {
  const camel = toCamelCase(input);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/** Convertit en "kebab-case" pour les noms de fichiers. */
export function toKebabCase(input: string): string {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
