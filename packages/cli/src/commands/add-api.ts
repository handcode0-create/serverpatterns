import * as p from "@clack/prompts";
import pc from "picocolors";
import { confirm } from "../utils/prompts.js";
import {
  detectProjectLayout,
  fileExists,
  relativeImport,
  validateName,
  writeGeneratedFile,
  toCamelCase,
  toKebabCase,
  toPascalCase,
} from "../utils/fs.js";
import {
  apiClientTemplate,
  collectionRouteTemplate,
  itemRouteTemplate,
  type ApiTemplateOptions,
} from "../templates/api-route.ts.template.js";

export async function runAddApi(nameArg?: string): Promise<void> {
  p.intro(pc.bgMagenta(pc.black(" serverpatterns add api ")));

  if (nameArg !== undefined && validateName(nameArg)) {
    p.log.error(`Nom "${nameArg}" invalide : ${validateName(nameArg)}`);
    process.exitCode = 1;
    return;
  }

  let name = nameArg;
  if (!name) {
    const answer = await p.text({
      message: "Nom de la ressource (ex: users, orders) ?",
      validate: validateName,
    });
    if (p.isCancel(answer)) {
      p.cancel("Annulé.");
      process.exit(0);
    }
    name = answer;
  }

  const methods = await p.multiselect({
    message: "Quelles méthodes générer pour cette ressource ?",
    options: [
      { value: "get", label: "Récupérer un élément (GET /api/<nom>/:id)" },
      { value: "list", label: "Lister, paginé (GET /api/<nom>)" },
      { value: "create", label: "Créer (POST /api/<nom>)" },
      { value: "update", label: "Mettre à jour partiellement (PATCH /api/<nom>/:id)" },
      { value: "delete", label: "Supprimer (DELETE /api/<nom>/:id)" },
    ],
    initialValues: ["get"],
    required: true,
  });

  if (p.isCancel(methods)) {
    p.cancel("Annulé.");
    process.exit(0);
  }

  const needsAuth = await confirm({
    message: "Ce client a-t-il besoin d'un token Bearer (JWT) dans ses headers ?",
    initialValue: false,
  });

  if (p.isCancel(needsAuth)) {
    p.cancel("Annulé.");
    process.exit(0);
  }

  let auth: ApiTemplateOptions["auth"] = { type: "none" };

  if (needsAuth) {
    const source = await p.select({
      message: "D'où vient le token ?",
      options: [
        { value: "cookie", label: "Cookie de session (cookies() de next/headers)" },
        { value: "env", label: "Variable d'environnement statique (token serveur-à-serveur)" },
      ],
    });

    if (p.isCancel(source)) {
      p.cancel("Annulé.");
      process.exit(0);
    }

    if (source === "cookie") {
      const cookieName = await p.text({
        message: "Nom du cookie contenant le token ?",
        placeholder: "token",
        defaultValue: "token",
      });
      if (p.isCancel(cookieName)) {
        p.cancel("Annulé.");
        process.exit(0);
      }
      auth = { type: "cookie", cookieName: cookieName || "token" };
    } else {
      const envVar = await p.text({
        message: "Nom de la variable d'environnement contenant le token ?",
        placeholder: "API_TOKEN",
        defaultValue: "API_TOKEN",
      });
      if (p.isCancel(envVar)) {
        p.cancel("Annulé.");
        process.exit(0);
      }
      auth = { type: "env", envVar: envVar || "API_TOKEN" };
    }
  }

  const layout = await detectProjectLayout();
  const kebab = toKebabCase(name);

  const clientPath = `${layout.libDir}/api/${kebab}.ts`;
  const collectionRoutePath = `${layout.appDir}/api/${kebab}/route.ts`;
  const itemRoutePath = `${layout.appDir}/api/${kebab}/[id]/route.ts`;

  const templateOptions: ApiTemplateOptions = {
    names: { kebab, camel: toCamelCase(name), pascal: toPascalCase(name) },
    methods: methods as ApiTemplateOptions["methods"],
    auth,
    clientImportFromCollectionRoute: relativeImport(collectionRoutePath, clientPath),
    clientImportFromItemRoute: relativeImport(itemRoutePath, clientPath),
  };

  const files: Array<{ path: string; content: string }> = [
    { path: clientPath, content: apiClientTemplate(templateOptions) },
  ];
  const collectionRoute = collectionRouteTemplate(templateOptions);
  if (collectionRoute) files.push({ path: collectionRoutePath, content: collectionRoute });
  const itemRoute = itemRouteTemplate(templateOptions);
  if (itemRoute) files.push({ path: itemRoutePath, content: itemRoute });

  const existing: string[] = [];
  for (const file of files) {
    if (await fileExists(file.path)) existing.push(file.path);
  }

  if (existing.length > 0) {
    const overwrite = await confirm({
      message: `Déjà présent : ${existing.join(", ")}. Écraser ?`,
      initialValue: false,
    });
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("Génération annulée pour éviter d'écraser un fichier existant.");
      return;
    }
  }

  const spinner = p.spinner();
  spinner.start(`Génération du client API et des Route Handlers pour "${name}"`);

  for (const file of files) {
    await writeGeneratedFile(file.path, file.content);
  }

  spinner.stop("Fichiers générés.");

  p.note(`${pc.dim("Créés :")}\n${files.map((f) => `  ${f.path}`).join("\n")}`, "Résultat");

  p.outro(
    pc.green(
      `Ressource "${name}" prête. Définis API_BASE_URL dans ton .env et complète les TODO générés.`
    )
  );
}
