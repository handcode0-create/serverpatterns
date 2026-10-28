import { z } from "zod";
import { createGetHandler, createPatchHandler, createDeleteHandler } from "@serverpatterns/next";
import { mapResult } from "@serverpatterns/core";
import { getUsers, updateUsers, deleteUsers } from "../../../../lib/api/users";

/** GET /api/users/:id */
export const GET = createGetHandler({
  handler: async (_query, _request, params) => getUsers(String(params.id)),
});

/** Champs modifiables — tous optionnels pour une mise à jour partielle. */
const updateSchema = z.object({
  // TODO: décris les champs modifiables, ex: name: z.string().min(1).optional(),
});

/** PATCH /api/users/:id */
export const PATCH = createPatchHandler({
  bodySchema: updateSchema,
  handler: async (body, _request, params) => updateUsers(String(params.id), body),
});

/** DELETE /api/users/:id */
export const DELETE = createDeleteHandler({
  handler: async (_body, _request, params) => {
    const id = String(params.id);
    return mapResult(await deleteUsers(id), () => ({ id }));
  },
});
