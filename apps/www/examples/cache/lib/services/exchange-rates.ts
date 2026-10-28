import { createApiClient, withCache } from "@serverpatterns/core";

interface Rates {
  base: string;
  rates: Record<string, number>;
}

const ratesApi = createApiClient({
  baseUrl: process.env.RATES_API_URL ?? "https://api.exemple.com",
});

// Taux de change mis en cache 10 minutes, par devise de base.
// Un Result en erreur n'est jamais mis en cache : l'appel suivant réessaie.
export const getRates = withCache(
  (base: string) => ratesApi.get<Rates>("/latest", { query: { base } }),
  { ttlMs: 10 * 60 * 1000 }
);

// const result = await getRates("XOF");
