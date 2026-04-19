"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface CompanyOption {
  id: string;
  name: string;
}

interface Props {
  companies: CompanyOption[];
}

const STATUS_OPTIONS = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const SOURCE_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "company_site", label: "Company site" },
  { value: "referral", label: "Referral" },
  { value: "github", label: "GitHub" },
  { value: "kariyer_net", label: "Kariyer.net" },
  { value: "other", label: "Other" },
];

const JOB_TYPE_OPTIONS = [
  { value: "internship", label: "Internship" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const WORK_MODE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
];

export function CreateApplicationForm({ companies }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError(null);

    const payload = {
      companyId: String(formData.get("companyId") ?? ""),
      title: String(formData.get("title") ?? ""),
      source: String(formData.get("source") ?? "other"),
      jobType: String(formData.get("jobType") ?? "internship"),
      workMode: String(formData.get("workMode") ?? "") || undefined,
      listingUrl: String(formData.get("listingUrl") ?? ""),
      salaryMin: String(formData.get("salaryMin") ?? ""),
      salaryMax: String(formData.get("salaryMax") ?? ""),
      currency: String(formData.get("currency") ?? "TRY"),
      followUpAt: String(formData.get("followUpAt") ?? ""),
      appliedAt: String(formData.get("appliedAt") ?? ""),
      status: String(formData.get("status") ?? "wishlist"),
    };

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Başvuru oluşturulamadı.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-base font-semibold text-white">Başvuru oluştur</p>
        <p className="mt-1 text-sm text-slate-400">Kaynak, statü ve takip tarihiyle süreci başlat.</p>
      </div>

      <select
        name="companyId"
        required
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none"
        defaultValue=""
      >
        <option value="" disabled>
          Şirket seç
        </option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>

      <input
        name="title"
        type="text"
        required
        placeholder="Frontend Intern"
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <select name="source" defaultValue="linkedin" className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none">
          {SOURCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select name="jobType" defaultValue="internship" className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none">
          {JOB_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <select name="workMode" defaultValue="remote" className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none">
          {WORK_MODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select name="status" defaultValue="wishlist" className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none">
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <input
        name="listingUrl"
        type="url"
        placeholder="İlan linki"
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <input
          name="salaryMin"
          type="number"
          min={0}
          placeholder="Min maaş"
          className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
        <input
          name="salaryMax"
          type="number"
          min={0}
          placeholder="Max maaş"
          className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
        <input
          name="currency"
          type="text"
          defaultValue="TRY"
          className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          Başvuru tarihi
          <input name="appliedAt" type="datetime-local" className="block w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none" />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          Follow-up tarihi
          <input name="followUpAt" type="datetime-local" className="block w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none" />
        </label>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending || companies.length === 0}
        className="w-full rounded-xl bg-teal-300 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {companies.length === 0
          ? "Önce şirket eklemelisin"
          : isPending
            ? "Kaydediliyor..."
            : "Başvuru oluştur"}
      </button>
    </form>
  );
}
