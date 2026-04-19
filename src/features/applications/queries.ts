import { and, count, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { applications, companies } from "@/db/schema";

export async function getCompaniesByOwner(ownerId: string) {
  return db.query.companies.findMany({
    where: eq(companies.ownerId, ownerId),
    orderBy: (table, { asc }) => [asc(table.name)],
  });
}

export async function getApplicationsByOwner(ownerId: string) {
  return db
    .select({
      id: applications.id,
      title: applications.title,
      status: applications.status,
      source: applications.source,
      jobType: applications.jobType,
      workMode: applications.workMode,
      listingUrl: applications.listingUrl,
      followUpAt: applications.followUpAt,
      appliedAt: applications.appliedAt,
      createdAt: applications.createdAt,
      companyName: companies.name,
      location: companies.location,
    })
    .from(applications)
    .innerJoin(companies, eq(applications.companyId, companies.id))
    .where(and(eq(applications.ownerId, ownerId), eq(applications.archived, false)))
    .orderBy(desc(applications.createdAt));
}

export async function getDashboardMetrics(ownerId: string) {
  const [totals] = await db
    .select({
      total: count(applications.id),
      interviewing: sql<number>`count(*) filter (where ${applications.status} in ('screening', 'interview'))`,
      offers: sql<number>`count(*) filter (where ${applications.status} = 'offer')`,
      followUps: sql<number>`count(*) filter (where ${applications.followUpAt} is not null and ${applications.followUpAt} <= now())`,
    })
    .from(applications)
    .where(and(eq(applications.ownerId, ownerId), eq(applications.archived, false)));

  return {
    total: Number(totals?.total ?? 0),
    interviewing: Number(totals?.interviewing ?? 0),
    offers: Number(totals?.offers ?? 0),
    followUps: Number(totals?.followUps ?? 0),
  };
}

export async function getOrphanCompanies(ownerId: string) {
  return db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .leftJoin(applications, eq(applications.companyId, companies.id))
    .where(and(eq(companies.ownerId, ownerId), isNull(applications.id)));
}
