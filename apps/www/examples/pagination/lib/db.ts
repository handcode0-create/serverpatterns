// Ta couche d'accès aux données. Stub pour l'exemple.
export interface Order {
  id: string;
  total: number;
}

export const db = {
  orders: {
    async findMany(options: { skip: number; take: number }): Promise<Order[]> {
      return options.take > 0 ? [] : [];
    },
    async count(): Promise<number> {
      return 0;
    },
  },
};
