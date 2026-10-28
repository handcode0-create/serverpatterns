export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/** Commandes d'installation de paquets, par gestionnaire. */
export function installCommands(packages: string): Record<PackageManager, string> {
  return {
    npm: `npm install ${packages}`,
    pnpm: `pnpm add ${packages}`,
    yarn: `yarn add ${packages}`,
    bun: `bun add ${packages}`,
  };
}

/** Commandes pour exécuter le CLI sans l'installer, par gestionnaire. */
export function cliCommands(args: string): Record<PackageManager, string> {
  return {
    npm: `npx @serverpatterns/cli ${args}`,
    pnpm: `pnpm dlx @serverpatterns/cli ${args}`,
    yarn: `yarn dlx @serverpatterns/cli ${args}`,
    bun: `bunx @serverpatterns/cli ${args}`,
  };
}
