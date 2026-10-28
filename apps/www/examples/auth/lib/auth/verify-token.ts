// Ta vérification de jeton (signature, expiration). Stub pour l'exemple.
export async function verifySessionToken(token: string): Promise<{ sub: string; roles?: string[] } | null> {
  return token ? null : null;
}
