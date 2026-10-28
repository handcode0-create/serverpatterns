#!/usr/bin/env node
import * as p from "@clack/prompts";
import pc from "picocolors";
import { createRequire } from "node:module";
import { runInit } from "./commands/init.js";
import { runAddApi } from "./commands/add-api.js";
import { runAddAction } from "./commands/add-action.js";

const HELP = `
${pc.bold("serverpatterns")} — CLI de génération ServerPatterns

${pc.dim("Usage")}
  serverpatterns <commande> [options]

${pc.dim("Commandes")}
  init                 Installe les dépendances et pose la structure lib/api, lib/actions
  add api <nom>        Génère un client API + Route Handler pour une ressource
  add action <nom>     Génère le squelette d'une Server Action typée
  help                 Affiche cette aide
  --version            Affiche la version du CLI

${pc.dim("Exemples")}
  serverpatterns init
  serverpatterns add api users
  serverpatterns add action create-order
`;

async function main() {
  const [, , command, sub, ...rest] = process.argv;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    console.log(HELP);
    return;
  }

  if (command === "--version" || command === "-v" || command === "version") {
    const pkg = createRequire(import.meta.url)("../package.json") as { version: string };
    console.log(pkg.version);
    return;
  }

  switch (command) {
    case "init": {
      await runInit();
      return;
    }
    case "add": {
      if (sub === "api") {
        const name = rest[0];
        await runAddApi(name);
        return;
      }
      if (sub === "action") {
        const name = rest[0];
        await runAddAction(name);
        return;
      }
      p.log.error(`Sous-commande "add ${sub ?? ""}" inconnue. Utilise "add api <nom>" ou "add action <nom>".`);
      process.exitCode = 1;
      return;
    }
    default: {
      p.log.error(`Commande "${command}" inconnue.`);
      console.log(HELP);
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  p.log.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
