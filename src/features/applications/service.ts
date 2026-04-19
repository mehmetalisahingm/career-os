import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { applicationNotes, applications, companies, interviews, reminders, statusHistory } from "@/db/schema";
import { writeAuditLog } from "@/lib/audit";
import type { CreateInterviewInput, CreateNoteInput, CreateReminderInput } from "@/features/applications/detail-validation";
import type {
  CreateApplicationInput,
  CreateCompanyInput,
  UpdateApplicationStatusInput,
} from "@/features/applications/validation";

export async function createCompany(ownerId: string, input: CreateCompanyInput) {
  const existing = await db.query.companies.findFirst({
    where: and(eq(companies.ownerId, ownerId), eq(companies.name, input.name)),
  });

  if (existing) {
    throw new Error("Bu şirket zaten kayıtlı.");
  }

  const [company] = await db
    .insert(companies)
    .values({
      ownerId,
      name: input.name,
      websiteUrl: input.websiteUrl,
      location: input.location,
    })
    .returning();

  await writeAuditLog({
    actorUserId: ownerId,
    entityType: "company",
    entityId: company.id,
    action: "company.created",
    metadata: { name: company.name },
  });

  return company;
}

export async function createApplication(ownerId: string, input: CreateApplicationInput) {
  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, input.companyId), eq(companies.ownerId, ownerId)),
    columns: { id: true },
  });

  if (!company) {
    throw new Error("Geçersiz şirket seçimi.");
  }

  const [application] = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(applications)
      .values({
        ownerId,
        companyId: input.companyId,
        title: input.title,
        status: input.status,
        source: input.source,
        jobType: input.jobType,
        workMode: input.workMode,
        listingUrl: input.listingUrl,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: input.currency,
        followUpAt: input.followUpAt,
        appliedAt: input.appliedAt,
      })
      .returning();

    await tx.insert(statusHistory).values({
      applicationId: created.id,
      fromStatus: null,
      toStatus: created.status,
      changedBy: ownerId,
    });

    return [created];
  });

  await writeAuditLog({
    actorUserId: ownerId,
    entityType: "application",
    entityId: application.id,
    action: "application.created",
    metadata: { title: application.title, status: application.status },
  });

  return application;
}

export async function updateApplicationStatus(
  ownerId: string,
  applicationId: string,
  input: UpdateApplicationStatusInput
) {
  const existing = await db.query.applications.findFirst({
    where: and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)),
  });

  if (!existing) {
    throw new Error("Başvuru bulunamadı.");
  }

  if (existing.status === input.status) {
    return existing;
  }

  const [updated] = await db.transaction(async (tx) => {
    const [row] = await tx
      .update(applications)
      .set({ status: input.status, updatedAt: new Date() })
      .where(and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)))
      .returning();

    await tx.insert(statusHistory).values({
      applicationId,
      fromStatus: existing.status,
      toStatus: input.status,
      changedBy: ownerId,
    });

    return [row];
  });

  await writeAuditLog({
    actorUserId: ownerId,
    entityType: "application",
    entityId: applicationId,
    action: "application.status_changed",
    metadata: { fromStatus: existing.status, toStatus: input.status },
  });

  return updated;
}

export async function archiveApplication(ownerId: string, applicationId: string) {
  const [archived] = await db
    .update(applications)
    .set({ archived: true, updatedAt: new Date() })
    .where(and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)))
    .returning({ id: applications.id, archived: applications.archived });

  if (!archived) {
    throw new Error("Başvuru bulunamadı veya bu işlem için yetkin yok.");
  }

  await writeAuditLog({
    actorUserId: ownerId,
    entityType: "application",
    entityId: applicationId,
    action: "application.archived",
    metadata: null,
  });

  return archived;
}

async function assertApplicationOwnership(ownerId: string, applicationId: string) {
  const application = await db.query.applications.findFirst({
    where: and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)),
    columns: { id: true },
  });

  if (!application) {
    throw new Error("Başvuru bulunamadı veya bu işlem için yetkin yok.");
  }
}

export async function createNote(ownerId: string, input: CreateNoteInput) {
  await assertApplicationOwnership(ownerId, input.applicationId);

  const [note] = await db
    .insert(applicationNotes)
    .values({
      applicationId: input.applicationId,
      authorId: ownerId,
      body: input.body,
    })
    .returning();

  await writeAuditLog({
    actorUserId: ownerId,
    entityType: "application_note",
    entityId: note.id,
    action: "application.note_created",
    metadata: { applicationId: input.applicationId },
  });

  return note;
}

export async function createReminder(ownerId: string, input: CreateReminderInput) {
  await assertApplicationOwnership(ownerId, input.applicationId);

  const [reminder] = await db
    .insert(reminders)
    .values({
      applicationId: input.applicationId,
      label: input.label,
      dueAt: input.dueAt,
    })
    .returning();

  await writeAuditLog({
    actorUserId: ownerId,
    entityType: "reminder",
    entityId: reminder.id,
    action: "application.reminder_created",
    metadata: { applicationId: input.applicationId },
  });

  return reminder;
}

export async function createInterview(ownerId: string, input: CreateInterviewInput) {
  await assertApplicationOwnership(ownerId, input.applicationId);

  const [interview] = await db
    .insert(interviews)
    .values({
      applicationId: input.applicationId,
      stageName: input.stageName,
      scheduledAt: input.scheduledAt,
      notes: input.notes,
    })
    .returning();

  await writeAuditLog({
    actorUserId: ownerId,
    entityType: "interview",
    entityId: interview.id,
    action: "application.interview_created",
    metadata: { applicationId: input.applicationId, stageName: input.stageName },
  });

  return interview;
}
