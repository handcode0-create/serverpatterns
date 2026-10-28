import { z } from "zod";
import { createPostHandler } from "@serverpatterns/next";
import { createTask } from "@/lib/services/tasks";

export const POST = createPostHandler({
  bodySchema: z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères."),
  }),
  handler: async (body) => createTask(body.title),
});
