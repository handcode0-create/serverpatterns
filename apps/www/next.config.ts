import path from 'node:path';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Le site vit dans apps/www d'un monorepo : la racine du dépôt est deux niveaux au-dessus.
  // Indiquer la racine évite l'avertissement « multiple lockfiles » au build.
  outputFileTracingRoot: path.join(process.cwd(), '../..'),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, {dev}) => {
    // HMR désactivé dans AI Studio via DISABLE_HMR (évite le scintillement pendant les éditions).
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
