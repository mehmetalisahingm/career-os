import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { applicationNotes, applications, interviews, reminders, statusHistory } from "@/db/schema";

export async function getApplicationDetail(ownerId: string, applicationId: string) {
  return db.query.applications.findFirst({
    where: and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)),
    with: { company: true },
  });
}

export async function getApplicationNotes(ownerId: string, applicationId: string) {
  return db
    .select({
      id: applicationNotes.id,
      body: applicationNotes.body,
      createdAt: applicationNotes.createdAt,
      authorId: applicationNotes.authorId,
    })
    .from(applicationNotes)
    .innerJoin(applications, eq(applicationNotes.applicationId, applications.id))
    .where(and(eq(applicationNotes.applicationId, applicationId), eq(applications.ownerId, ownerId)))
    .orderBy(desc(applicationNotes.createdAt));
}

export async function getApplicationReminders(ownerId: string, applicationId: string) {
  return db
    .select({
      id: reminders.id,
      label: reminders.label,
      dueAt: reminders.dueAt,
      completed: reminders.completed,
      createdAt: reminders.createdAt,
    })
    .from(reminders)
    .innerJoin(applications, eq(reminders.applicationId, applications.id))
    .where(and(eq(reminders.applicationId, applicationId), eq(applications.ownerId, ownerId)))
    .orderBy(asc(reminders.dueAt));
}

export async function getApplicationInterviews(ownerId: string, applicationId: string) {
  return db
    .select({
      id: interviews.id,
      stageName: interviews.stageName,
      scheduledAt: interviews.scheduledAt,
      completedAt: interviews.completedAt,
      outcome: interviews.outcome,
      notes: interviews.notes,
      createdAt: interviews.createdAt,
    })
    .from(interviews)
    .innerJoin(applications, eq(interviews.applicationId, applications.id))
    .where(and(eq(interviews.applicationId, applicationId), eq(applications.ownerId, ownerId)))
    .orderBy(asc(interviews.createdAt));
}

export async function getApplicationStatusHistory(ownerId: string, applicationId: string) {
  return db
    .select({
      id: statusHistory.id,
      fromStatus: statusHistory.fromStatus,
      toStatus: statusHistory.toStatus,
      changedAt: statusHistory.changedAt,
      changedBy: statusHistory.changedBy,
    })
    .from(statusHistory)
    .innerJoin(applications, eq(statusHistory.applicationId, applications.id))
    .where(and(eq(statusHistory.applicationId, applicationId), eq(applications.ownerId, ownerId)))
    .orderBy(desc(statusHistory.changedAt));
}
