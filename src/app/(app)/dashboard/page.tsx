import { auth } from "@/auth";
import { CreateApplicationForm } from "@/components/dashboard/create-application-form";
import { CreateCompanyForm } from "@/components/dashboard/create-company-form";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getApplicationsByOwner, getCompaniesByOwner, getDashboardMetrics } from "@/features/applications/queries";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const [metrics, companies, applications] = await Promise.all([
    getDashboardMetrics(session.user.id),
    getCompaniesByOwner(session.user.id),
    getApplicationsByOwner(session.user.id),
  ]);

  const metricCards = [
    { label: "Toplam başvuru", value: metrics.total.toString() },
    { label: "Mülakat sürecinde", value: metrics.interviewing.toString() },
    { label: "Teklif", value: metrics.offers.toString() },
    { label: "Takip bekleyen", value: metrics.followUps.toString() },
  ];

  return (
    <main className="space-y-8">
      <section>
        <p className="text-sm text-teal-300">Dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Başvuru merkezine hoş geldin, {session.user.name?.split(" ")[0] ?? "dostum"}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Şirketlerini ekle, başvurularını kaydet, filtrele, kanban görünümünde süreci izle ve detay
          sayfasında tüm notlarını tut.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <CreateCompanyForm />
          <CreateApplicationForm companies={companies.map((company) => ({ id: company.id, name: company.name }))} />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Başvurular</h2>
            <p className="mt-2 text-sm text-slate-400">
              Liste ve kanban arasında geçiş yap, arama/filtre uygula, detay sayfasından süreci zenginleştir.
            </p>
          </div>

          <DashboardClient applications={applications} />
        </div>
      </section>
    </main>
  );
}
