import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-transparent text-white">
      <header className="border-b border-white/10 bg-slate-950/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
              CareerOS
            </Link>
            <p className="text-xs text-slate-400">Personal job search CRM</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white">{session.user.name ?? "Kullanıcı"}</p>
              <p className="text-xs text-slate-400">{session.user.email}</p>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Çıkış yap
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
