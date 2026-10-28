"use server";

import { z } from "zod";
import { withServerAction } from "@serverpatterns/next";
import { createTask } from "@/lib/services/tasks";

export const createTaskAction = withServerAction({
  inputSchema: z.object({
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères."),
  }),
  action: async (input) => createTask(input.title),
});
