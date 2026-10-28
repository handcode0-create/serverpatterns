// Ta couche d'accès aux données. Stub pour l'exemple.
export const db = {
  articles: {
    async remove(id: string, deletedBy: string): Promise<boolean> {
      return Boolean(id && deletedBy);
    },
  },
};
