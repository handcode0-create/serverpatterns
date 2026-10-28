// Ta couche d'accès aux données (Prisma, Drizzle, Supabase…). Stub pour l'exemple.
export interface Product {
  id: string;
  name: string;
  price: number;
}

export const db = {
  products: {
    async findById(id: string): Promise<Product | null> {
      return id ? null : null;
    },
  },
};
