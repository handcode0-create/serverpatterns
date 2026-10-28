// Ta couche d'accès aux données. Stub pour l'exemple.
export const db = {
  users: {
    async rename(userId: string, username: string): Promise<{ id: string; username: string } | null> {
      return userId ? { id: userId, username } : null;
    },
  },
};
