import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const applicationStatusEnum = pgEnum("application_status", [
  "wishlist",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "archived",
]);

export const jobTypeEnum = pgEnum("job_type", [
  "internship",
  "full_time",
  "part_time",
  "contract",
  "freelance",
]);

export const workModeEnum = pgEnum("work_mode", ["remote", "hybrid", "onsite"]);

export const applicationSourceEnum = pgEnum("application_source", [
  "linkedin",
  "company_site",
  "referral",
  "github",
  "kariyer_net",
  "other",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: varchar("role", { length: 32 }).notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.identifier, table.token],
    }),
  })
);

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    websiteUrl: text("website_url"),
    location: varchar("location", { length: 160 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    ownerNameIdx: uniqueIndex("companies_owner_name_idx").on(table.ownerId, table.name),
  })
);

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  status: applicationStatusEnum("status").notNull().default("wishlist"),
  source: applicationSourceEnum("source").notNull().default("other"),
  jobType: jobTypeEnum("job_type").notNull().default("internship"),
  workMode: workModeEnum("work_mode"),
  listingUrl: text("listing_url"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  currency: varchar("currency", { length: 12 }).default("TRY"),
  followUpAt: timestamp("follow_up_at", { withTimezone: true }),
  appliedAt: timestamp("applied_at", { withTimezone: true }),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applicationNotes = pgTable("application_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  stageName: varchar("stage_name", { length: 120 }).notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  outcome: varchar("outcome", { length: 64 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
  label: varchar("label", { length: 160 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const statusHistory = pgTable("status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  fromStatus: applicationStatusEnum("from_status"),
  toStatus: applicationStatusEnum("to_status").notNull(),
  changedBy: uuid("changed_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  entityType: varchar("entity_type", { length: 80 }).notNull(),
  entityId: uuid("entity_id"),
  action: varchar("action", { length: 80 }).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, { fields: [companies.ownerId], references: [users.id] }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  owner: one(users, { fields: [applications.ownerId], references: [users.id] }),
  company: one(companies, { fields: [applications.companyId], references: [companies.id] }),
  notes: many(applicationNotes),
  reminders: many(reminders),
  interviews: many(interviews),
  history: many(statusHistory),
}));

export const applicationNotesRelations = relations(applicationNotes, ({ one }) => ({
  application: one(applications, {
    fields: [applicationNotes.applicationId],
    references: [applications.id],
  }),
  author: one(users, { fields: [applicationNotes.authorId], references: [users.id] }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  application: one(applications, { fields: [reminders.applicationId], references: [applications.id] }),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, { fields: [interviews.applicationId], references: [applications.id] }),
}));

export const statusHistoryRelations = relations(statusHistory, ({ one }) => ({
  application: one(applications, { fields: [statusHistory.applicationId], references: [applications.id] }),
  changedByUser: one(users, { fields: [statusHistory.changedBy], references: [users.id] }),
}));
