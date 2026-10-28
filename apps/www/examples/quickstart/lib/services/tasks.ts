import { ok, err, ServerPatternsError, type Result } from "@serverpatterns/core";

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

// Stockage en mémoire pour l'exemple : remplace-le par ta base de données.
const tasks = new Map<string, Task>();

export async function createTask(title: string): Promise<Result<Task, ServerPatternsError>> {
  const duplicate = [...tasks.values()].some((task) => task.title === title);
  if (duplicate) {
    return err(new ServerPatternsError("VALIDATION_ERROR", "Une tâche porte déjà ce titre."));
  }

  const task: Task = { id: crypto.randomUUID(), title, done: false };
  tasks.set(task.id, task);
  return ok(task);
}
