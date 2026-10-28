import { execSync } from "node:child_process";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { detectProjectLayout, fileExists, isNextProject, writeGeneratedFile } from "../utils/fs.js";

/** Devine le gestionnaire de paquets à partir du lockfile présent. */
async function detectPackageManager(): Promise<"npm" | "pnpm" | "yarn"> {
  if (await fileExists("pnpm-lock.yaml")) return "pnpm";
  if (await fileExists("yarn.lock")) return "yarn";
  return "npm";
}

export async function runInit(): Promise<void> {
  p.intro(pc.bgMagenta(pc.black(" serverpatterns init ")));

  if (!(await isNextProject())) {
    p.log.warn(
      "Aucune dépendance \"next\" trouvée dans package.json. Lance cette commande à la racine d'un projet Next.js (App Router)."
    );
    const proceed = await p.confirm({ message: "Continuer quand même ?", initialValue: false });
    if (p.isCancel(proceed) || !proceed) {
      p.cancel("Init annulé.");
      return;
    }
  }

  const layout = await detectProjectLayout();
  const apiDir = `${layout.libDir}/api`;
  const actionsDir = `${layout.libDir}/actions`;

  const alreadyInitialized = (await fileExists(apiDir)) && (await fileExists(actionsDir));
  if (alreadyInitialized) {
    p.log.warn(`${apiDir} et ${actionsDir} existent déjà — rien à faire.`);
    p.outro("Projet déjà initialisé.");
    return;
  }

  const packageManager = await p.select({
    message: "Quel gestionnaire de paquets utilises-tu ?",
    initialValue: await detectPackageManager(),
    options: [
      { value: "npm", label: "npm" },
      { value: "pnpm", label: "pnpm" },
      { value: "yarn", label: "yarn" },
    ],
  });

  if (p.isCancel(packageManager)) {
    p.cancel("Init annulé.");
    process.exit(0);
  }

  const confirmInstall = await p.confirm({
    message: `Installer @serverpatterns/core, @serverpatterns/next et zod avec ${packageManager} ?`,
  });

  if (p.isCancel(confirmInstall)) {
    p.cancel("Init annulé.");
    process.exit(0);
  }

  if (confirmInstall) {
    const spinner = p.spinner();
    spinner.start("Installation des dépendances");
    try {
      const installCmd =
        packageManager === "npm"
          ? "npm install @serverpatterns/core @serverpatterns/next zod"
          : packageManager === "pnpm"
            ? "pnpm add @serverpatterns/core @serverpatterns/next zod"
            : "yarn add @serverpatterns/core @serverpatterns/next zod";
      execSync(installCmd, { stdio: "ignore" });
      spinner.stop("Dépendances installées.");
    } catch (error) {
      spinner.stop("Échec de l'installation automatique.");
      p.log.warn(
        `Installe manuellement : @serverpatterns/core @serverpatterns/next zod (${
          error instanceof Error ? error.message : String(error)
        })`
      );
    }
  }

  const spinner = p.spinner();
  spinner.start(`Création de la structure ${apiDir} et ${actionsDir}`);
  if (!(await fileExists(`${apiDir}/.gitkeep`))) {
    await writeGeneratedFile(
      `${apiDir}/.gitkeep`,
      "# Clients API générés par ServerPatterns (serverpatterns add api <nom>)\n"
    );
  }
  if (!(await fileExists(`${actionsDir}/.gitkeep`))) {
    await writeGeneratedFile(
      `${actionsDir}/.gitkeep`,
      "# Server Actions générées par ServerPatterns (serverpatterns add action <nom>)\n"
    );
  }
  spinner.stop(`Structure créée : ${apiDir}/, ${actionsDir}/`);

  p.note(
    `${pc.dim("Prochaines étapes :")}\n` +
      `  serverpatterns add api <nom>      ${pc.dim("→ génère un client API + Route Handler")}\n` +
      `  serverpatterns add action <nom>   ${pc.dim("→ génère une Server Action typée")}`,
    "Suite"
  );

  p.outro(pc.green("ServerPatterns initialisé avec succès."));
}
