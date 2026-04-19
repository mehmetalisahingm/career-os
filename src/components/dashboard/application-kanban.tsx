import Link from "next/link";
import type { ApplicationListItem } from "@/features/applications/types";

interface Props {
  applications: ApplicationListItem[];
}

const COLUMNS = [
  { key: "wishlist", label: "Wishlist" },
  { key: "applied", label: "Applied" },
  { key: "screening", label: "Screening" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
] as const;

export function ApplicationKanban({ applications }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-6">
      {COLUMNS.map((column) => {
        const items = applications.filter((item) => item.status === column.key);

        return (
          <section key={column.key} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{column.label}</h3>
              <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-400">{items.length}</span>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-xs text-slate-500">
                  Kayıt yok
                </div>
              ) : (
                items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/applications/${item.id}`}
                    className="block rounded-2xl border border-white/10 bg-slate-950/35 p-3 transition hover:bg-slate-950/50"
                  >
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.companyName}</p>
                    <p className="mt-2 text-[11px] text-teal-300">{item.source}</p>
                  </Link>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
