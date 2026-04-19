# CareerOS

CareerOS is a product-minded job application tracker built for students and junior developers.
It brings companies, applications, interviews, reminders, notes, and status history into a single dashboard instead of scattering the search process across spreadsheets and bookmarks.

## Highlights

- Email and password authentication with Auth.js
- PostgreSQL + Drizzle data layer
- Application pipeline with status transitions
- Company management and application linking
- Interview, reminder, and note tracking
- List and kanban views for the same dataset
- Ownership-aware queries and service-layer access control
- Basic audit logging and rate-limiting foundations

## Tech Stack

- Next.js 16 App Router
- TypeScript
- PostgreSQL
- Drizzle ORM
- Auth.js
- Zod
- Tailwind CSS
- Vitest
- Playwright

## Product Scope

This project is intentionally closer to a real product than a CRUD demo.
The focus is not just storing records, but supporting an actual application workflow:

- track where each application came from
- monitor follow-up dates
- keep notes per application
- attach interview rounds
- filter and review the pipeline in multiple views

## Security Notes

- Passwords are hashed with Argon2id
- Auth is handled with Auth.js credentials flow
- Access is scoped per user in the application layer
- SQL access stays parameterized through Drizzle
- Security headers are set in Next.js config
- Registration flow has basic rate limiting

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d db
```

4. Apply the schema and seed demo data:

```bash
npx drizzle-kit push --force
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If port `5432` is already in use on your machine, change `POSTGRES_PORT` and `DATABASE_URL` together in `.env`.

## Demo Account

```text
Email: demo@careeros.local
Password: Password123!
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:push
npm run db:seed
npm test -- --run
```

## Current Limitations

- Rate limiting is in-memory; production should move it to Redis or Upstash.
- The credentials flow is intentionally simple and does not yet cover password reset or email verification.
- Ownership checks are enforced in the app layer; database-level RLS is a natural next hardening step.

## Why This Repo Matters

CareerOS is meant to read like a serious junior-to-mid full-stack portfolio project:

- a clear user problem
- a non-trivial data model
- authentication and authorization concerns
- practical local setup
- test coverage for core validation logic
