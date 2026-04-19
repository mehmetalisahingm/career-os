"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CreateCompanyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      location: String(formData.get("location") ?? ""),
    };

    const response = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Şirket oluşturulamadı.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-base font-semibold text-white">Şirket ekle</p>
        <p className="mt-1 text-sm text-slate-400">Önce şirket oluştur, sonra başvuruyu ona bağla.</p>
      </div>

      <input
        name="name"
        type="text"
        required
        placeholder="Örn. Insider"
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      <input
        name="websiteUrl"
        type="url"
        placeholder="https://company.com"
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      <input
        name="location"
        type="text"
        placeholder="İstanbul / Remote"
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-teal-300 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:opacity-70"
      >
        {isPending ? "Ekleniyor..." : "Şirket oluştur"}
      </button>
    </form>
  );
}
