import { db } from "@/db";
import { auditLogs } from "@/db/schema";

interface AuditLogInput {
  actorUserId?: string | null;
  entityType: string;
  entityId?: string | null;
  action: string;
  metadata?: Record<string, unknown> | null;
}

export async function writeAuditLog(input: AuditLogInput) {
  await db.insert(auditLogs).values({
    actorUserId: input.actorUserId ?? null,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    action: input.action,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
  });
}
