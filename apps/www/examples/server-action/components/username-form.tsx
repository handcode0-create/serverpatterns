"use client";

import { useState } from "react";
import { updateUsername } from "@/lib/actions/update-username";

export function UsernameForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null);

  async function save(formData: FormData) {
    const result = await updateUsername({ userId, username: String(formData.get("username")) });
    // Jamais d'exception : le résultat est toujours { success, data } ou { success, error }
    setError(result.success ? null : result.error.message);
  }

  return (
    <form action={save}>
      <input name="username" />
      <button type="submit">Enregistrer</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
