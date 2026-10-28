import { mapResult, unwrap } from "@serverpatterns/core";
import { getProduct } from "@/lib/services/products";

export async function getProductLabel(id: string) {
  const result = await getProduct(id);
  // mapResult transforme la donnée d'un succès et laisse l'erreur intacte
  return mapResult(result, (product) => `${product.name} (${product.price} FCFA)`);
}

// unwrap renvoie la donnée ou lève l'erreur : à réserver aux scripts et aux tests.
export async function seedCheck() {
  const product = unwrap(await getProduct("p_1"));
  console.log(product.name);
}
