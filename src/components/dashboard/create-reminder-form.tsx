"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CreateReminderForm({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submit() {
    setError(null);

    const response = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, label, dueAt }),
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Reminder eklenemedi.");
      return;
    }

    setLabel("");
    setDueAt("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-base font-semibold text-white">Reminder ekle</p>
        <p className="mt-1 text-sm text-slate-400">Takip maili, recruiter’a dönüş, mülakat sonrası follow-up.</p>
      </div>

      <input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        type="text"
        placeholder="Recruiter’a follow-up mail gönder"
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      <input
        value={dueAt}
        onChange={(event) => setDueAt(event.target.value)}
        type="datetime-local"
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={isPending || label.trim().length === 0 || dueAt.trim().length === 0}
        className="rounded-xl bg-teal-300 px-4 py-3 font-medium text-slate-950 disabled:opacity-60"
      >
        {isPending ? "Kaydediliyor..." : "Reminder oluştur"}
      </button>
    </div>
  );
}
