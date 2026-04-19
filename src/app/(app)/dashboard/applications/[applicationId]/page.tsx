import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { ApplicationDetailHeader } from "@/components/dashboard/application-detail-header";
import { CreateInterviewForm } from "@/components/dashboard/create-interview-form";
import { CreateNoteForm } from "@/components/dashboard/create-note-form";
import { CreateReminderForm } from "@/components/dashboard/create-reminder-form";
import {
  getApplicationDetail,
  getApplicationInterviews,
  getApplicationNotes,
  getApplicationReminders,
  getApplicationStatusHistory,
} from "@/features/applications/detail-queries";

interface PageProps {
  params: Promise<{ applicationId: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { applicationId } = await params;

  const [application, notes, reminders, interviews, history] = await Promise.all([
    getApplicationDetail(session.user.id, applicationId),
    getApplicationNotes(session.user.id, applicationId),
    getApplicationReminders(session.user.id, applicationId),
    getApplicationInterviews(session.user.id, applicationId),
    getApplicationStatusHistory(session.user.id, applicationId),
  ]);

  if (!application || !application.company) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <ApplicationDetailHeader
        id={application.id}
        title={application.title}
        status={application.status}
        companyName={application.company.name}
        listingUrl={application.listingUrl}
      />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <CreateNoteForm applicationId={application.id} />
          <CreateReminderForm applicationId={application.id} />
          <CreateInterviewForm applicationId={application.id} />
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Notlar</h2>
            <div className="mt-4 space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-400">Henüz not yok.</p>
              ) : (
                notes.map((note) => (
                  <article key={note.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{note.body}</p>
                    <p className="mt-3 text-xs text-slate-500">{new Date(note.createdAt).toLocaleString("tr-TR")}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Reminders</h2>
            <div className="mt-4 space-y-3">
              {reminders.length === 0 ? (
                <p className="text-sm text-slate-400">Henüz reminder yok.</p>
              ) : (
                reminders.map((reminder) => (
                  <article key={reminder.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-sm font-medium text-white">{reminder.label}</p>
                    <p className="mt-2 text-sm text-slate-400">{new Date(reminder.dueAt).toLocaleString("tr-TR")}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Interview rounds</h2>
            <div className="mt-4 space-y-3">
              {interviews.length === 0 ? (
                <p className="text-sm text-slate-400">Henüz interview round yok.</p>
              ) : (
                interviews.map((interview) => (
                  <article key={interview.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-sm font-medium text-white">{interview.stageName}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      {interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleString("tr-TR") : "Tarih belirtilmedi"}
                    </p>
                    {interview.notes ? <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{interview.notes}</p> : null}
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Status history</h2>
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-slate-400">Henüz status history yok.</p>
              ) : (
                history.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
                    <span className="font-medium text-white">{item.fromStatus ?? "initial"}</span> → <span className="font-medium text-teal-300">{item.toStatus}</span>
                    <p className="mt-2 text-xs text-slate-500">{new Date(item.changedAt).toLocaleString("tr-TR")}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
