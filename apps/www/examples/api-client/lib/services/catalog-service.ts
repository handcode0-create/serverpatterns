import { isOk } from "@serverpatterns/core";
import { catalog } from "@/lib/clients/catalog";

export interface Product {
  id: string;
  name: string;
  price: number;
}

export async function findProduct(id: string): Promise<Product | null> {
  const result = await catalog.get<Product>(`/products/${encodeURIComponent(id)}`, {
    query: { currency: "XOF" },
  });

  if (isOk(result)) return result.data;

  switch (result.error.code) {
    case "NOT_FOUND":
      return null;
    case "NETWORK_ERROR": // timeout, API injoignable, requête annulée
    default:
      // status : code HTTP reçu ; details : corps de la réponse d'erreur
      console.error(result.error.message, result.error.status, result.error.details);
      return null;
  }
}
