import { z } from "zod";
import { createGetHandler, createPostHandler } from "@serverpatterns/next";
import { parsePaginationParams } from "@serverpatterns/core";
import { listUsers, createUsers } from "../../../lib/api/users";

const listQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

/** GET /api/users?page=1&pageSize=20 */
export const GET = createGetHandler({
  querySchema: listQuerySchema,
  handler: async (query) => listUsers(parsePaginationParams(query)),
});

/** Doit correspondre à UsersInput (lib/api) — TypeScript te signalera tout écart. */
const createSchema = z.object({
  // TODO: décris les champs attendus, ex: name: z.string().min(1),
});

/** POST /api/users */
export const POST = createPostHandler({
  bodySchema: createSchema,
  handler: async (body) => createUsers(body),
});
