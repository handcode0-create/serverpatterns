import { cookies } from "next/headers";
import type { AuthSession } from "@serverpatterns/next";
import { verifySessionToken } from "@/lib/auth/verify-token";

// Adapte ton système d'auth (NextAuth, Clerk, Supabase Auth, JWT maison…)
// à la forme minimale { userId, roles } attendue par withAuth.
export async function getSession(): Promise<AuthSession | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  return { userId: payload.sub, roles: payload.roles ?? [] };
}
