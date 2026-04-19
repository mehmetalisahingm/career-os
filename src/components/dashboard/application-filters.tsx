"use client";

import { useEffect, useMemo, useState } from "react";
import type { ApplicationListItem } from "@/features/applications/types";

interface Props {
  applications: ApplicationListItem[];
  onFilteredChange: (items: ApplicationListItem[]) => void;
}

const ALL_STATUSES = ["wishlist", "applied", "screening", "interview", "offer", "rejected"] as const;

export function ApplicationFilters({ applications, onFilteredChange }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [source, setSource] = useState<string>("all");

  const sources = useMemo(() => {
    return Array.from(new Set(applications.map((item) => item.source))).sort();
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((item) => {
      const queryOk =
        query.trim().length === 0 ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.companyName.toLowerCase().includes(query.toLowerCase());

      const statusOk = status === "all" || item.status === status;
      const sourceOk = source === "all" || item.source === source;

      return queryOk && statusOk && sourceOk;
    });
  }, [applications, query, status, source]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        type="text"
        placeholder="Rol veya şirket ara"
        className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />

      <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none">
        <option value="all">Tüm status’ler</option>
        {ALL_STATUSES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={source} onChange={(event) => setSource(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none">
        <option value="all">Tüm kaynaklar</option>
        {sources.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
