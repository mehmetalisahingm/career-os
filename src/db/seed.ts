import "dotenv/config";

import { db, sql } from "@/db";
import { applications, companies, users, statusHistory } from "@/db/schema";
import { hashPassword } from "@/lib/password";

async function main() {
  const passwordHash = await hashPassword("Password123!");

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, "demo@careeros.local"),
  });

  const demoUser =
    existingUser ??
    (
      await db
        .insert(users)
        .values({
          name: "Demo User",
          email: "demo@careeros.local",
          passwordHash,
        })
        .returning()
    )[0];

  const existingInsider = await db.query.companies.findFirst({
    where: (table, { and, eq }) => and(eq(table.ownerId, demoUser.id), eq(table.name, "Insider")),
  });
  const existingGetir = await db.query.companies.findFirst({
    where: (table, { and, eq }) => and(eq(table.ownerId, demoUser.id), eq(table.name, "Getir")),
  });

  const insider =
    existingInsider ??
    (
      await db
        .insert(companies)
        .values({ ownerId: demoUser.id, name: "Insider", websiteUrl: "https://useinsider.com", location: "Istanbul" })
        .returning()
    )[0];

  const getir =
    existingGetir ??
    (
      await db
        .insert(companies)
        .values({ ownerId: demoUser.id, name: "Getir", websiteUrl: "https://getir.com", location: "Hybrid" })
        .returning()
    )[0];

  const hasApps = await db.query.applications.findFirst({
    where: (table, { eq }) => eq(table.ownerId, demoUser.id),
  });

  if (!hasApps) {
    const insertedApps = await db
      .insert(applications)
      .values([
        {
          ownerId: demoUser.id,
          companyId: insider.id,
          title: "Frontend Intern",
          status: "interview",
          source: "linkedin",
          jobType: "internship",
          workMode: "hybrid",
          appliedAt: new Date(),
        },
        {
          ownerId: demoUser.id,
          companyId: getir.id,
          title: "Software Engineer Intern",
          status: "applied",
          source: "company_site",
          jobType: "internship",
          workMode: "remote",
          followUpAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      ])
      .returning({ id: applications.id, status: applications.status });

    if (insertedApps.length > 0) {
      await db.insert(statusHistory).values(
        insertedApps.map((item) => ({
          applicationId: item.id,
          fromStatus: null,
          toStatus: item.status,
          changedBy: demoUser.id,
        }))
      );
    }
  }

  console.log("✅ Seed tamamlandı");
  console.log("Demo kullanıcı: demo@careeros.local / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end({ timeout: 5 });
  });
