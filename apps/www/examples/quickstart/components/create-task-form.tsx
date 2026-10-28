"use client";

import { useState, useTransition } from "react";
import { createTaskAction } from "@/lib/actions/create-task";

export function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const result = await createTaskAction({ title });
      if (result.success) {
        setMessage(`Tâche créée : ${result.data.title}`);
        setTitle("");
      } else {
        // result.error.code vaut par exemple "VALIDATION_ERROR"
        setMessage(result.error.message);
      }
    });
  }

  return (
    <div>
      <input value={title} onChange={(event) => setTitle(event.target.value)} />
      <button onClick={submit} disabled={isPending}>
        Créer la tâche
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
