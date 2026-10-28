import * as p from "@clack/prompts";
import pc from "picocolors";
import { confirm } from "../utils/prompts.js";
import {
  detectProjectLayout,
  fileExists,
  relativeImport,
  validateFieldName,
  validateName,
  writeGeneratedFile,
  toCamelCase,
  toKebabCase,
} from "../utils/fs.js";
import {
  serverActionTemplate,
  sessionStubTemplate,
  type ActionField,
} from "../templates/server-action.ts.template.js";

async function promptFields(): Promise<ActionField[]> {
  const fields: ActionField[] = [];

  p.log.info("Ajoute les champs attendus par l'action (laisse le nom vide pour terminer).");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rawFieldName = await p.text({
      message: `Nom du champ ${fields.length + 1} (vide pour terminer) :`,
      placeholder: "(vide pour terminer)",
      validate: (value) =>
        validateFieldName(value) ??
        (fields.some((f) => f.name === (value ?? "").trim()) ? "Ce champ existe déjà." : undefined),
    });

    if (p.isCancel(rawFieldName)) {
      p.cancel("Annulé.");
      process.exit(0);
    }

    const fieldName = (rawFieldName ?? "").trim();
    if (fieldName.length === 0) {
      break;
    }

    const zodType = await p.select({
      message: `Type de "${fieldName}" ?`,
      options: [
        { value: "string", label: "string" },
        { value: "number", label: "number" },
        { value: "boolean", label: "boolean" },
      ],
    });

    if (p.isCancel(zodType)) {
      p.cancel("Annulé.");
      process.exit(0);
    }

    const optional = await confirm({
      message: `"${fieldName}" est-il optionnel ?`,
      initialValue: false,
    });

    if (p.isCancel(optional)) {
      p.cancel("Annulé.");
      process.exit(0);
    }

    fields.push({ name: fieldName, zodType: zodType as ActionField["zodType"], optional });
  }

  return fields;
}

export async function runAddAction(nameArg?: string): Promise<void> {
  p.intro(pc.bgMagenta(pc.black(" serverpatterns add action ")));

  if (nameArg !== undefined && validateName(nameArg)) {
    p.log.error(`Nom "${nameArg}" invalide : ${validateName(nameArg)}`);
    process.exitCode = 1;
    return;
  }

  let name = nameArg;
  if (!name) {
    const answer = await p.text({
      message: "Nom de l'action (ex: create-order, update-profile) ?",
      validate: validateName,
    });
    if (p.isCancel(answer)) {
      p.cancel("Annulé.");
      process.exit(0);
    }
    name = answer;
  }

  const fields = await promptFields();

  const needsAuth = await confirm({
    message: "Cette action doit-elle être restreinte à certains rôles (RBAC) ?",
    initialValue: false,
  });

  if (p.isCancel(needsAuth)) {
    p.cancel("Annulé.");
    process.exit(0);
  }

  let requiredRoles: string[] = [];

  if (needsAuth) {
    const rolesInput = await p.text({
      message: "Rôles autorisés, séparés par une virgule (ex: admin, stock_manager) :",
      validate: (value) => (value.trim().length === 0 ? "Indique au moins un rôle." : undefined),
    });

    if (p.isCancel(rolesInput)) {
      p.cancel("Annulé.");
      process.exit(0);
    }

    requiredRoles = rolesInput
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  const camelName = toCamelCase(name);
  const layout = await detectProjectLayout();
  const actionPath = `${layout.libDir}/actions/${toKebabCase(name)}.ts`;
  const sessionPath = `${layout.libDir}/auth/session.ts`;
  const needsSessionStub = requiredRoles.length > 0 && !(await fileExists(sessionPath));

  if (await fileExists(actionPath)) {
    const overwrite = await confirm({
      message: `${actionPath} existe déjà. Écraser ?`,
      initialValue: false,
    });
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("Génération annulée pour éviter d'écraser un fichier existant.");
      return;
    }
  }

  const spinner = p.spinner();
  spinner.start(`Génération de la Server Action "${name}"`);

  await writeGeneratedFile(
    actionPath,
    serverActionTemplate({
      actionName: name,
      camelName,
      fields,
      requiredRoles,
      sessionImport: relativeImport(actionPath, sessionPath),
    })
  );
  // N'écrase jamais un session.ts existant : il contient l'auth réelle du projet.
  if (needsSessionStub) {
    await writeGeneratedFile(sessionPath, sessionStubTemplate());
  }

  spinner.stop("Fichiers générés.");

  p.note(
    `${pc.dim("Créé :")}\n  ${actionPath}${needsSessionStub ? `\n  ${sessionPath}` : ""}${
      requiredRoles.length > 0 ? `\n${pc.dim("Rôles requis :")} ${requiredRoles.join(", ")}` : ""
    }`,
    "Résultat"
  );

  p.outro(
    pc.green(
      `Action "${name}" prête.${
        requiredRoles.length > 0
          ? ` Branche ${sessionPath} sur ton vrai système d'auth (d'ici là, l'action répond UNAUTHORIZED).`
          : " N'oublie pas de compléter la logique métier."
      }`
    )
  );
}
