import { ok, err, ServerPatternsError, type Result } from "@serverpatterns/core";
import { db, type Product } from "@/lib/db";

export async function getProduct(id: string): Promise<Result<Product, ServerPatternsError>> {
  try {
    const product = await db.products.findById(id);
    if (!product) {
      return err(new ServerPatternsError("NOT_FOUND", "Produit introuvable", { status: 404 }));
    }
    return ok(product);
  } catch (cause) {
    return err(new ServerPatternsError("SERVER_ERROR", "Lecture du produit impossible", { cause }));
  }
}
