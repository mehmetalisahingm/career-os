"use client";

import { useMemo, useState } from "react";

import { ApplicationFilters } from "@/components/dashboard/application-filters";
import { ApplicationKanban } from "@/components/dashboard/application-kanban";
import { ApplicationList } from "@/components/dashboard/application-list";
import type { ApplicationListItem } from "@/features/applications/types";

export function DashboardClient({ applications }: { applications: ApplicationListItem[] }) {
  const [filtered, setFiltered] = useState(applications);
  const [view, setView] = useState<"list" | "kanban">("list");

  const totalShown = useMemo(() => filtered.length, [filtered]);

  return (
    <div className="space-y-4">
      <ApplicationFilters applications={applications} onFilteredChange={setFiltered} />

      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-300">Gösterilen kayıt: {totalShown}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-xl px-4 py-2 text-sm ${view === "list" ? "bg-teal-300 text-slate-950" : "border border-white/10 bg-white/5 text-white"}`}
          >
            Liste
          </button>
          <button
            type="button"
            onClick={() => setView("kanban")}
            className={`rounded-xl px-4 py-2 text-sm ${view === "kanban" ? "bg-teal-300 text-slate-950" : "border border-white/10 bg-white/5 text-white"}`}
          >
            Kanban
          </button>
        </div>
      </div>

      {view === "list" ? <ApplicationList applications={filtered} /> : <ApplicationKanban applications={filtered} />}
    </div>
  );
}
