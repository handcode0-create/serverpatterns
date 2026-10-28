import { createApiClient, type PaginationParams, type PaginatedResult } from "@serverpatterns/core";
import { cookies } from "next/headers";

/**
 * Client API pour la ressource "users".
 * Définis API_BASE_URL dans ton .env (ex: API_BASE_URL=https://api.monservice.com).
 */
export const usersClient = createApiClient({
  baseUrl: process.env.API_BASE_URL ?? "https://api.example.com",
  defaultHeaders: async () => {
    // cookies() est synchrone en Next 14 et asynchrone en Next 15+ : "await" couvre les deux.
    const token = (await cookies()).get("token")?.value;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  },
});

export interface Users {
  id: string;
  // TODO: complète les champs réels de la ressource
}

/** Données envoyées à la création / mise à jour (tout sauf l'id). */
export type UsersInput = Omit<Users, "id">;

/** Récupère un élément "users" par son id. */
export async function getUsers(id: string) {
  return usersClient.get<Users>(`/users/${encodeURIComponent(id)}`);
}

/**
 * Liste les éléments "users", paginés.
 * Suppose que l'API distante renvoie un PaginatedResult — adapte si son format diffère.
 */
export async function listUsers(params: PaginationParams) {
  return usersClient.get<PaginatedResult<Users>>("/users", {
    query: { page: params.page, pageSize: params.pageSize },
  });
}

/** Crée un nouvel élément "users". */
export async function createUsers(input: UsersInput) {
  return usersClient.post<Users>("/users", input);
}

/** Met à jour partiellement un élément "users". */
export async function updateUsers(id: string, input: Partial<UsersInput>) {
  return usersClient.patch<Users>(`/users/${encodeURIComponent(id)}`, input);
}

/** Supprime un élément "users". */
export async function deleteUsers(id: string) {
  return usersClient.delete<unknown>(`/users/${encodeURIComponent(id)}`);
}
