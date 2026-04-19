"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CreateNoteForm({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submit() {
    setError(null);

    const response = await fetch("/api/application-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, body }),
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Not eklenemedi.");
      return;
    }

    setBody("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-base font-semibold text-white">Not ekle</p>
        <p className="mt-1 text-sm text-slate-400">Mülakatta konuşulanlar, maaş beklentisi, referans detayları.</p>
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        placeholder="Notlarını buraya yaz..."
        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={isPending || body.trim().length === 0}
        className="rounded-xl bg-teal-300 px-4 py-3 font-medium text-slate-950 disabled:opacity-60"
      >
        {isPending ? "Kaydediliyor..." : "Notu kaydet"}
      </button>
    </div>
  );
}
