import { createApiClient } from "@serverpatterns/core";

export const shop = createApiClient({
  baseUrl: process.env.SHOP_API_URL ?? "https://api.exemple.com",
  defaultHeaders: { Authorization: `Bearer ${process.env.SHOP_API_TOKEN ?? ""}` },
});
