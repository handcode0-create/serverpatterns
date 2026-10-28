import { createApiClient } from "@serverpatterns/core";

// Une instance par API externe, créée une fois et réutilisée côté serveur.
export const catalog = createApiClient({
  baseUrl: process.env.CATALOG_API_URL ?? "https://api.exemple.com",
  timeoutMs: 8000,
  // Fonction appelée à chaque requête : peut aussi être async (ex: lire un cookie).
  defaultHeaders: (): Record<string, string> => {
    const token = process.env.CATALOG_API_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
