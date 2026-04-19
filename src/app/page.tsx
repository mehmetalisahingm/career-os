import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/80">
          CareerOS • Product-minded full-stack portfolio project
        </span>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">
          Başvurularını, görüşmelerini ve follow-up sürecini tek yerden yönet.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          CareerOS, öğrenciler ve junior geliştiriciler için hazırlanmış kişisel bir job-search CRM’idir.
          Şirketleri, başvuruları, durum geçişlerini ve hatırlatmaları tek panelde toplar.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-teal-300 px-5 py-3 font-medium text-slate-950 transition hover:opacity-90"
          >
            Hesap oluştur
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Giriş yap
          </Link>
        </div>
      </div>
    </main>
  );
}
