import Link from "next/link";

interface Props {
  id: string;
  title: string;
  status: string;
  companyName: string;
  listingUrl?: string | null;
}

export function ApplicationDetailHeader({ id, title, status, companyName, listingUrl }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <Link href="/dashboard" className="text-sm text-slate-400 underline underline-offset-4">
        ← Dashboard’a dön
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {status}
        </span>
      </div>

      <p className="mt-3 text-slate-300">{companyName}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-white/10 px-3 py-2 text-slate-300">Application ID: {id}</span>
        {listingUrl ? (
          <a href={listingUrl} target="_blank" rel="noreferrer" className="rounded-full border border-teal-300/20 px-3 py-2 text-teal-300">
            İlan linkini aç
          </a>
        ) : null}
      </div>
    </div>
  );
}
