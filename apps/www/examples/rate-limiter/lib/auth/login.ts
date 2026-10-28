// Ta vérification d'identifiants. Stub pour l'exemple.
export async function checkCredentials(email: string, password: string): Promise<{ userId: string } | null> {
  return email && password ? null : null;
}
