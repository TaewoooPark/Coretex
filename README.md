# CORETEX

CORETEX is a node-based collaborative document management MVP. It represents project work as Traceable Work Nodes connected by a directed acyclic decision genealogy graph.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS brutalist monochrome UI
- React Flow graph canvas
- Zustand local UI state
- TanStack Query server-state cache
- TipTap document editor
- Prisma schema for the PostgreSQL production model
- In-memory demo store for the runnable MVP

## Run

```bash
npm install
npm run dev -- --port 3000
```

Demo URLs:

- `http://localhost:3000/auth/sign-in`
- `http://localhost:3000/app`
- `http://localhost:3000/app/w/workspace_demo/p/project_demo/flow`
- `http://localhost:3000/app/w/workspace_demo/p/project_demo/archive`

## Verify

```bash
npm run test
npx tsc --noEmit
npm run build
npx prisma validate
npm run prisma:generate
npm run seed
npm audit --json
```

`npm run build` uses `next build --webpack` because Next 16 Turbopack build attempts an internal port bind that is blocked in this sandbox.

The default `.env` points Prisma at a conventional local PostgreSQL URL. The runnable MVP does not require that database unless you run `prisma:migrate` or replace the in-memory demo store with Prisma-backed services.
`prisma/migrations/0001_init/migration.sql` is generated from the Prisma schema for PostgreSQL environments where a database is available.

## Implemented MVP Surface

- Demo auth sign-in/sign-out route with cookie-backed demo user
- Workspace list and guarded workspace creation
- Project list and project creation with default Brief/Idea nodes and SUPPORTS edge
- Project graph API with type/status/tag/depth/focus filters
- Context node create, update, soft delete
- Directed edge create and soft delete with cycle rejection
- React Flow canvas with custom brutalist node cards and edge creation dialog
- Node inspector with summary, document, chat, versions, genealogy, and AI tabs
- TipTap document editing, immutable document versions, old-version preview, restore as new version
- Project and node-scoped chat
- Manual message-node linking
- Fallback AI extraction for hashtags, title mentions, edge suggestions, and decision candidates
- AI suggestion accept/reject flow
- Command search across nodes, messages, tags, and decisions
- Time-travel graph queries and read-only UI mode
- Project archive generation and read-only archive report
- Usage guards for FREE workspace, project, and node limits
- Unit and integration tests for graph, time-travel, usage, fallback AI, permissions, and core API behavior

## MVP Boundaries

The repository includes the full Prisma PostgreSQL schema, but the runnable demo uses `lib/mock-db.ts` so the app works without external services. Real NextAuth, PostgreSQL persistence, pgvector, external integrations, Stripe, SSO, and real-time collaborative editing remain post-MVP integration work.
