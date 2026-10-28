// Ta couche d'accès aux données. Stub pour l'exemple.
import type { PaginationParams } from "@serverpatterns/core";

export interface Product {
  id: string;
  name: string;
  price: number;
}

type ProductInput = Omit<Product, "id">;

export const db = {
  products: {
    async list(params: PaginationParams): Promise<Product[]> {
      return params.page > 0 ? [] : [];
    },
    async count(): Promise<number> {
      return 0;
    },
    async create(input: ProductInput): Promise<Product> {
      return { id: "p_1", ...input };
    },
    async findById(id: string): Promise<Product | null> {
      return id ? null : null;
    },
    async update(id: string, input: Partial<ProductInput>): Promise<Product | null> {
      return id && input ? null : null;
    },
    async remove(id: string): Promise<void> {
      void id;
    },
  },
};
