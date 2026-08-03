SFBU ECE Program Explorer

Version: 2.0

Purpose

This file contains permanent project instructions for Claude Code.

This document describes the project’s architecture, coding philosophy, development workflow, and operational rules.

Do not store sprint information, temporary tasks, or implementation progress here.

Those belong in:

* management/PROJECT_ROADMAP.md
* management/TASKS.md
* management/CHANGELOG.md

⸻

Project Overview

The SFBU ECE Program Explorer is a web-based curriculum visualization platform for the Electrical and Computer Engineering Department at San Francisco Bay University.

The application converts the official university catalog into an interactive educational experience.

Supported users include:

* Prospective Students
* Current Students
* Faculty
* Academic Advisors (presentation mode)
* Curriculum Administrators

The application is educational and informational.

It is not a Student Information System.

⸻

Supported Programs

Current programs:

* Bachelor of Science in Computer Science (BSCS)
* Master of Science in Computer Science (MSCS)
* Master of Science in Data Science (MSDS)
* Master of Science in Electrical Engineering (MSEE)

All four are School of Engineering programs.

The architecture should allow future programs without major redesign.

⸻

Primary Goal

Build an interactive platform that helps users understand:

* Program structure
* Curriculum pathways
* Course relationships
* Prerequisite chains
* Knowledge areas
* Degree requirement groups

The application should provide a significantly better experience than navigating static PDF catalogs.

⸻

Project Scope

The project visualizes academic information.

Version 1 does not include:

* Student login
* Student profiles
* Student records
* Grades
* GPA
* Degree audit
* Enrollment
* Registration
* Financial Aid
* FERPA data
* SIS integration

Authentication is required only for the Administration Dashboard.

⸻

Documentation Hierarchy

Claude should consider the following documents authoritative.

Priority order:

1. CLAUDE.md
2. docs/
3. management/
4. epics/
5. Source Code

When documentation conflicts occur:

SRS

↓

Architecture

↓

Database/API

↓

Current Epic

Current Epics may refine implementation details but should never override business requirements defined in the SRS.

⸻

Startup Workflow

Whenever beginning work:

1. Read:

* management/PROJECT_ROADMAP.md
* management/TASKS.md
* management/CHANGELOG.md

2. Read all documents inside:

docs/

3. Read the current Epic.
4. Determine:

* Current milestone
* Remaining tasks
* Dependencies
* Files affected

5. Present an implementation plan before making code changes.

⸻

Data Source

The university catalog is the authoritative source.

Catalog information is transformed into structured data.

Primary entities include:

* Programs
* Catalog Years
* Requirement Groups
* Courses
* Knowledge Areas
* Prerequisites
* Corequisites
* Curriculum Roadmaps

⸻

Technology Stack

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Visualization

* React Flow
* D3.js
* Recharts

Backend

* NestJS

Database

* PostgreSQL

Deployment

* Docker
* Docker Compose
* Nginx

⸻

Architecture Principles

Always follow:

* Layered Architecture
* REST API
* Component-based Frontend
* Separation of Concerns
* Modular Design
* Strong Typing
* Reusable Components

Avoid:

* Tight coupling
* Large monolithic components
* Duplicate logic

⸻

UI Philosophy

The interface should feel like an interactive educational platform.

Prioritize:

* Visual Learning
* Exploration
* Simplicity
* Accessibility
* Responsiveness

Avoid administrative-style interfaces for public users.

⸻

Coding Standards

Always:

* Use TypeScript.
* Prefer functional React components.
* Prefer composition over inheritance.
* Keep functions focused.
* Reuse existing components.
* Follow ESLint and Prettier.

Component guideline:

Prefer components under approximately 300 lines when practical.

⸻

Implementation Rules

Before coding:

* Understand requirements.
* Review existing implementation.
* Reuse components whenever possible.

During implementation:

* Modify only relevant files.
* Avoid unrelated refactoring.
* Preserve architecture.
* Maintain documentation consistency.

Never implement student-related features unless explicitly requested.

⸻

Documentation Policy

Whenever architecture changes:

Update:

* docs/02-Architecture.md

Whenever database changes:

Update:

* docs/03-Database.md

Whenever API changes:

Update:

* docs/04-API.md

Whenever UI changes:

Update:

* docs/05-UIUX.md

Whenever requirements change:

Update:

* docs/SRS.md

Always update:

* management/TASKS.md
* management/CHANGELOG.md

⸻

AI Workflow

For every implementation:

1. Understand the task.
2. Review documentation.
3. Explain the implementation plan.
4. Implement only the requested feature.
5. Verify the implementation.
6. Summarize modified files.
7. Recommend the next logical task.

Do not modify unrelated code.

⸻

Performance Goals

* Fast page loads
* Efficient graph rendering
* Lazy loading where appropriate
* Optimized API responses
* Small frontend bundle

⸻

Accessibility

Follow WCAG 2.1 AA.

Support:

* Keyboard navigation
* Screen readers
* Responsive layouts
* Sufficient color contrast

⸻

Definition of Done

A task is complete only when:

* Requirements are satisfied.
* Code builds successfully.
* Tests pass (when applicable).
* Documentation is updated.
* TASKS.md is updated.
* CHANGELOG.md is updated.
* No unrelated code was modified.
* Code follows project standards.

⸻

Project Vision

The SFBU ECE Program Explorer will become the primary interactive interface for understanding Electrical and Computer Engineering curricula, replacing static catalog browsing with an engaging visual learning experience.


# Startup
## Session Workflow

When beginning a new coding session:

- Read `start.md`.

When ending a coding session:

- Follow `end.md`.

These files define the session workflow and may evolve over time.

Always read in this order:

1. CLAUDE.md

2. docs/README.md

3. management/PROJECT_ROADMAP.md

4. management/TASKS.md

5. management/CHANGELOG.md

6. epics/README.md

7. Current Epic

Do not read every Epic unless required.

⸻

# Development Reference

This is a monorepo with two independently-installed npm workspaces: `frontend/` (Next.js) and `backend/` (NestJS). The root `package.json` holds orchestration scripts, Prettier, Husky, and semantic-release; it does **not** hoist dependencies. Run `npm install` separately inside `frontend/` and `backend/`.

## Commands

Run from the repository root unless noted.

Dev servers (each needs its own terminal):

* `npm run dev:frontend` — Next.js on http://localhost:3000
* `npm run dev:backend` — NestJS on http://localhost:3001/api/v1 (watch mode)

Docker (full stack incl. Postgres + Nginx):

* `docker compose up -d` — frontend :3000, backend API :3001, health at `/api/v1/health`
* `docker compose up postgres -d` — database only (the usual local-dev DB)

Build / lint / format:

* `npm run build:frontend` / `npm run build:backend`
* `npm run lint` (both), or `npm run lint:frontend` / `npm run lint:backend`
* `npm run format` / `npm run format:check` — Prettier across the repo

Tests:

* Backend: `npm run test:backend`, or from `backend/`: `npm test`. Unit specs are `*.spec.ts` under `src/`. E2E: `cd backend && npm run test:e2e`.
* Frontend: `cd frontend && npm test` (Jest + Testing Library). Single test: `cd frontend && npx jest <path-or-name>`; watch: `npm run test:watch`. Accessibility assertions use `jest-axe`.

Database (run from `backend/`, requires Postgres reachable via `DATABASE_URL`):

* `npm run migration:run` / `npm run migration:revert`
* `npm run migration:generate -- src/database/migrations/<Name>` — generate from entity diffs
* `npm run seed` — seeds catalog data + the admin user from `ADMIN_SEED_*` env vars

Commits are Prettier-formatted via a Husky `lint-staged` pre-commit hook. Releases run through **semantic-release** (Conventional Commits → version + changelog), so commit messages drive versioning.

## Architecture

**Backend (NestJS + TypeORM + PostgreSQL).** `src/main.ts` sets a global `api/v1` prefix, a global `ValidationPipe` (whitelist + transform, so DTOs are the contract), an `AllExceptionsFilter`, cookie parsing, CORS, and Swagger at `/api/docs`. `AppModule` composes one feature module per domain under `src/modules/`. Two parallel surfaces exist:

* **Public read modules** — `programs`, `courses`, `requirement-groups`, `knowledge-areas`, `catalog-years`, `search`. Read-only curriculum data, no auth.
* **Admin write modules** — everything under `src/modules/admin/*` (programs, courses, requirement-groups, knowledge-areas, catalog-years, dashboard, audit-log), gated by JWT. `auth` issues the token; guards/strategies/decorators live in `src/modules/auth/`. Mutations are recorded via the audit-log entity.

TypeORM entities live in `src/database/entities/` (registered explicitly — not glob-autoloaded — in both `data-source.ts` and the database module). The catalog domain model is: `Program` → `CatalogYear` → `RequirementGroup` → `ProgramRequirement`, with `Course` linked to `KnowledgeArea` via the `CourseKnowledgeArea` join, and course dependencies modeled as `Prerequisite` / `Corequisite` self-relations. `synchronize` is **off** — schema changes go through migrations in `src/database/migrations/`.

**Frontend (Next.js App Router, React 19).** Routes use **route groups**: `app/(public)/` is the unauthenticated explorer (programs, courses, compare, course/program detail pages), `app/(admin-shell)/admin/` is the CRUD dashboard with an `(protected)` subgroup. `middleware.ts` guards `/admin/*` (except `/admin/login`) by checking the `admin_token` cookie and redirecting to login with a `next` param.

All backend calls go through two typed clients: `lib/api.ts` (public) and `lib/admin-api.ts` (admin). `api.ts` picks its base URL by execution context — server components use `API_BASE_URL` (internal Docker host `backend:3001`), the browser uses `NEXT_PUBLIC_API_URL` (through Nginx). Keep interface types in these files in sync with backend DTOs. Visualization is React Flow (`@xyflow/react`) — see `components/graph/` (prerequisite graph, `lib/graphLayout.ts`) and `components/roadmap/` (curriculum roadmap). Feature components are grouped by domain under `components/`; shared primitives in `components/ui/`. `next.config.ts` uses `output: 'standalone'` for the Docker image.

**Environment.** Copy `.env.example` → `.env`. Key vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD`, and the frontend `API_BASE_URL` (server-side) vs `NEXT_PUBLIC_API_URL` (client-side) split described above.