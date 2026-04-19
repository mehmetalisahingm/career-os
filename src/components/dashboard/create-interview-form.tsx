"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CreateInterviewForm({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [stageName, setStageName] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submit() {
    setError(null);

    const response = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, stageName, scheduledAt, notes }),
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Interview round eklenemedi.");
      return;
    }

    setStageName("");
    setScheduledAt("");
    setNotes("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-base font-semibold text-white">Interview round ekle</p>
        <p className="mt-1 text-sm text-slate-400">HR call, technical interview, case study, final round gibi.</p>
      </div>

      <input
        value={stageName}
        onChange={(event) => setStageName(event.target.value)}
        type="text"
        placeholder="Technical Interview"
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      <input
        value={scheduledAt}
        onChange={(event) => setScheduledAt(event.target.value)}
        type="datetime-local"
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none"
      />

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={4}
        placeholder="Hazırlık notları veya interview detayları"
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={isPending || stageName.trim().length === 0}
        className="rounded-xl bg-teal-300 px-4 py-3 font-medium text-slate-950 disabled:opacity-60"
      >
        {isPending ? "Kaydediliyor..." : "Round ekle"}
      </button>
    </div>
  );
}
