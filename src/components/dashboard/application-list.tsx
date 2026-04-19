"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ApplicationListItem } from "@/features/applications/types";

interface Props {
  applications: ApplicationListItem[];
}

const STATUS_OPTIONS = ["wishlist", "applied", "screening", "interview", "offer", "rejected"] as const;

function badgeClass(status: ApplicationListItem["status"]) {
  switch (status) {
    case "offer":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/20";
    case "interview":
    case "screening":
      return "bg-sky-500/15 text-sky-300 border-sky-400/20";
    case "rejected":
      return "bg-rose-500/15 text-rose-300 border-rose-400/20";
    case "applied":
      return "bg-amber-500/15 text-amber-300 border-amber-400/20";
    default:
      return "bg-white/5 text-slate-300 border-white/10";
  }
}

export function ApplicationList({ applications }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(applicationId: string, status: ApplicationListItem["status"]) {
    setError(null);

    const response = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Durum güncellenemedi.");
      return;
    }

    startTransition(() => router.refresh());
  }

  async function archive(applicationId: string) {
    setError(null);

    const response = await fetch(`/api/applications/${applicationId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Başvuru arşivlenemedi.");
      return;
    }

    startTransition(() => router.refresh());
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
        Henüz başvuru yok. Yukarıdan bir şirket ekleyip ilk başvurunu oluştur.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      {applications.map((application) => (
        <article key={application.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-white">
                  <Link href={`/dashboard/applications/${application.id}`}>{application.title}</Link>
                </h3>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${badgeClass(application.status)}`}>
                  {application.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                {application.companyName}
                {application.location ? ` • ${application.location}` : ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="rounded-full border border-white/10 px-3 py-1">{application.jobType}</span>
                <span className="rounded-full border border-white/10 px-3 py-1">{application.source}</span>
                {application.workMode ? <span className="rounded-full border border-white/10 px-3 py-1">{application.workMode}</span> : null}
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-400">
                <p>Applied: {application.appliedAt ? new Date(application.appliedAt).toLocaleString("tr-TR") : "—"}</p>
                <p>Follow-up: {application.followUpAt ? new Date(application.followUpAt).toLocaleString("tr-TR") : "—"}</p>
                {application.listingUrl ? (
                  <a href={application.listingUrl} target="_blank" rel="noreferrer" className="inline-flex text-teal-300 underline underline-offset-4">
                    İlan linki
                  </a>
                ) : null}
              </div>
            </div>

            <div className="flex min-w-[220px] flex-col gap-3">
              <select
                defaultValue={application.status}
                disabled={isPending}
                onChange={(event) => changeStatus(application.id, event.target.value as ApplicationListItem["status"])}
                className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={isPending}
                onClick={() => archive(application.id)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                Arşivle
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
