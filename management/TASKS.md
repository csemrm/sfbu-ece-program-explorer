# TASKS.md

SFBU ECE Program Explorer

Development Task Tracker

Current Version: 1.0

---

## Current Sprint

Sprint 1 – Project Foundation

Status: 🟡 In Progress

---

## High Priority

### Offering-Aware Planner

Closes the gap between the admin offerings tool (v1.2.0) and the public planner
(v1.1.0): admins curate which courses run in which term, but the planner never
reads that data, so a student can plan a course into a semester it isn't offered
in and still see a green "Eligible" verdict.

Design decisions: `eligible` keeps meaning "prerequisites satisfied" (unchanged
contract); offering status is a separate `offered` signal combined into
`registrable`. Terms without a `termId` stay offering-agnostic (`offered: null`),
so the existing "sketch an abstract sequence" flow and saved localStorage plans
keep working.

- [x] Seed: `COURSE_OFFERINGS` from the real SFBU registration list (`docs/Fall 2026.md`) — 8 in-catalog courses; Spring 2027 left unseeded rather than fabricated
- [x] Backend: a term with zero offerings reports `offered: null` (not curated), never `false` — an empty schedule must not claim the whole catalog is unavailable
- [x] Frontend: unpublished-schedule terms labelled in the selector, with an explanatory note when selected
- [x] Frontend: two-column `/plan` — completed courses left, next-semester offerings right, pending prerequisites highlighted (`OfferingPlanner`, `OfferedCourseRow`)

### Planner: degree scope, browsable catalog, printable plan

Follow-on UX pass. `/plan` becomes three columns behind a degree selector.

- [x] Frontend: completed courses are a browsable checklist grouped by subject (`CompletedCourseList`) — the type-ahead required knowing a course code before you could mark it; the search box now filters the list instead of being the only way in
- [x] Frontend: degree selector (BSCS / MSCS / MSEE) scopes both catalog columns. Program course sets are derived from `GET /programs/:id/roadmap` (`lib/programScope.ts`) — there is no "courses in this program" endpoint and the roadmap already carries them, so no backend route was added
- [x] Frontend: scoping the offerings can empty that column — Fall 2026 runs graduate CS only, so BSCS and MSEE match 0 of 8 — the gap is stated in words with a "show all N anyway" escape hatch rather than rendering a blank panel
- [x] Frontend: third column (`PlanSummaryColumn`) — courses ready to register stacked over the chosen plan, with credits and blocked-prerequisite warnings
- [x] Frontend: plan downloadable as PDF via a print-only sheet (`.plan-print` in `globals.css` + `window.print()`); no PDF library added, keeping the client bundle unchanged
- [x] Fix: persist the "show all offerings" escape hatch. It was component state while `selectedIds` was persisted, so a plan built through it evaluated to nothing after a reload — "Your plan" read empty and the PDF button vanished while the selections were still in storage. Found by testing the merged v1.5.0 build in a browser.
- [ ] A program whose roadmap has no courses is treated as "do not scope". Correct for a data gap, but indistinguishable from a genuinely empty program — revisit if a real program ever has zero roadmap courses
- [ ] The print sheet is not covered by an automated visual check; only its DOM content is asserted
- [x] Catalog gap, partly closed: CS521 and CS522 **are** in the catalog (Software Project Management; Software Quality Assurance and Test Automation) and are now seeded. CS547, CS582, CS583 and CS587 appear on the Fall 2026 registration list but genuinely have no catalog entry — still outstanding below.
- [ ] Catalog gap: CS547, CS582, CS583, CS587 are on the official Fall 2026 list but have no entry in the 2025-2026 catalog (need title, credits, prerequisites, requirement-group placement, knowledge areas — none of which the registration list carries)
### Catalog reconciliation (closed)

The mistitling was not limited to graduate CS: **59 of 66 seeded courses carried
the wrong title**. Only MATH201 and MATH202 matched. The codes and requirement-group
membership were correct throughout — the seed had the right skeleton with labels
from a generic CS curriculum rather than SFBU's catalog.

- [x] All 81 course titles, credit hours and descriptions transcribed from `docs/sfbu-2025-2026-university-catalog-10.27.pdf` (71 catalog-backed titles verified to match exactly; the 10 APP courses come from the GE tables, which carry no prose description)
- [x] Prerequisites and corequisites rebuilt from the catalog's own stated links, replacing chains inferred from the wrong identities
- [x] Knowledge-area mappings re-derived from the corrected identities
- [x] BSCS General Education populated with the 10 Agility Praxis Pathway courses (APP101–APP302); the group previously held only an unenumerated 30-credit placeholder
- [x] MSCS gains CS501 in Foundation (the catalog's alternative to CS455G — it was wrongly noted against CS500) and the three cluster-course groups: Cloud Computing and Big Data, Mobile Application Technologies, QA Engineering
- [x] MSEE concentration groups renamed to the catalog's wording (Cluster — Internet of Things (IoT) and Embedded Systems / Multicore Computing / Modern IC Technologies)
- [x] `CatalogReconciliation1719446404000` migration clears the derived relationship tables so a reseed rebuilds them; seeding alone could not, being insert-only
- [x] Seed bug: placeholder requirements (`course_id IS NULL`) matched only on course id, so every reseed inserted another copy
- [x] Seed bug: existing requirement groups were never updated, so inserting a group mid-program left the others on stale `sortOrder` and the sequence interleaved
- [x] `catalog-data.spec.ts` — 12 referential-integrity checks (dangling codes, duplicate mappings, prerequisite cycles, group ordering). The seeder logs and skips what it cannot resolve, which is how 59 wrong titles survived to v1.5.1 unnoticed

Follow-ups this surfaced:

- [ ] **Disjunctive prerequisites are unmodeled.** The catalog states 8 as alternatives ("CS250 or CS360"); `Prerequisite` is a hard AND, so recording both would wrongly block a student who took either. They are omitted, which makes CS480, CS480L and CS556 look prerequisite-free. Needs a schema change to express "or".
- [ ] **Source-catalog defect:** CS200 "Discrete Logic" is printed with a Linux/shell description duplicating CS230 — no mention of logic anywhere in it. The title is seeded and the description replaced with a flagged placeholder; needs departmental confirmation.
- [ ] The catalog's own numbering typo — Calculus I is headed `MATH20`, not `MATH201`, in the Mathematics section — is worked around in the extraction. Worth reporting upstream.
- [ ] The catalog documents an MSDS program (DS500–DS595) and BSBA/MBA business programs that this app does not model. Out of scope per CLAUDE.md, but the course codes now visibly exist in the source.
- [ ] Decide the fate of `SemesterPlanner` / `TermCard` — the multi-semester planner they implement is no longer rendered by any route now that `/plan` is the two-column screen. Still tested; kept rather than deleted pending that decision.
- [ ] Model `Open For Registration` and section counts (on the official list, not in the schema — a seeded offering currently means "runs this term", not "registration is open")
- [ ] Spring 2027 offerings once a real schedule is published
- [x] Seed: idempotent offering upsert in seed.ts (resolves terms by name, warns and skips unknown terms/courses)
- [x] Backend: public `GET /terms` + `GET /terms/:id` (academic terms + offered courses) — offerings were admin-only
- [x] Backend: `PlannerTermDto.termId` (optional) + `offered` / `registrable` on evaluated courses
- [x] Backend: `EvaluatedTermDto.termId` / `termName`, `allOffered` on the evaluation response
- [x] Backend: offering-aware suggestions (`offeredInTerms`, offerable ranked first)
- [x] Backend: unknown `termId` rejected with 400 rather than passing vacuously
- [x] Backend: TermsService (7) + PlannerService offering tests (10); all 8 pre-existing planner tests pass unchanged
- [x] Frontend: typed `api.terms.{list,get}` client
- [x] Frontend: per-term academic-term selector on `TermCard` (hidden when no terms are curated)
- [x] Frontend: three-state verdict on `CourseVerdictRow` — amber "Not offered" distinct from red prereq failure
- [x] Frontend: localStorage v1 → v2 migration so saved plans survive the term-binding schema change
- [x] Frontend: planner component tests + jest-axe (CourseVerdictRow 10, TermCard 8)
- [x] Docs: 03 Database (offering seed), 04 API (terms endpoint + planner contract), 05 UI/UX (selector, verdict states)

---

### Knowledge Area Explorer (Milestone 9)

- [x] Seed: `KNOWLEDGE_AREAS` (14 domains) + `COURSE_KNOWLEDGE_AREAS` (77 joins over 60 courses) in catalog-data.ts
- [x] Seed: idempotent knowledge-area + join upsert in seed.ts (warns and skips unknown codes/names)
- [x] Backend: `GET /knowledge-areas` returns courseCount / undergraduateCount / graduateCount
- [x] Backend: `GET /knowledge-areas/:id` returns the area with its courses
- [x] Backend: `GET /programs/:id/knowledge-areas` — area distribution for the latest catalog year
- [x] Backend: KnowledgeAreasService unit tests (7) + ProgramsService.findKnowledgeAreas tests (6)
- [x] Frontend: typed `api.knowledgeAreas.{list,get}` + `api.programs.knowledgeAreas` clients
- [x] Frontend: `/knowledge-areas` list page with UG/grad split bars
- [x] Frontend: `/knowledge-areas/[id]` detail page (hero, stats, courses grouped by level)
- [x] Frontend: "Knowledge Areas" added to public navigation
- [x] Frontend: KnowledgeAreaCard component tests + jest-axe (11)
- [x] Docs: 03 Database (seed strategy), 04 API (3 endpoints), 05 UI/UX (pages + nav)
- [ ] Knowledge-area chips on the course detail page (needs a per-course areas endpoint)

---

### Admin Course Offerings (two-column eligibility tool)

- [x] Backend: AcademicTerm + CourseOffering entities + migration (seeds two starter terms)
- [x] Backend: admin `/admin/offerings` CRUD (terms + offerings), JWT-guarded, audit-logged
- [x] Backend: AdminOfferingsController unit tests (mapping, dedupe conflicts, not-found)
- [x] Frontend: `/admin/offerings` two-column page (this semester vs. next semester) with live eligibility via planner.evaluate
- [x] Frontend: admin-api offerings client + "Course Offerings" sidebar link
- [x] Migration applied to dev DB; docs (03 DB, 04 API, 05 UI/UX) updated

---

### Semester Planner (prerequisite eligibility)

- [x] Backend: stateless `POST /planner/evaluate` module (multi-term prereq/coreq evaluation + suggestions)
- [x] Backend: PlannerService unit tests (eligibility, ordering conflicts, corequisites, suggestions)
- [x] Frontend: typed `api.planner.evaluate` client + `post` helper
- [x] Frontend: `/plan` page — completed picker, ordered semester cards, live verdicts, suggestions, localStorage persistence
- [x] Add "Plan" to public navigation
- [x] Docs: API (04) and UI/UX (05) updated

---

### Project Setup

- [x] Initialize Git repository
- [x] Create Next.js frontend
- [x] Create NestJS backend
- [x] Configure PostgreSQL migrations
- [x] Configure Docker Compose
- [x] Configure ESLint and Prettier
- [x] Configure Husky pre-commit hooks

---

### Documentation

- [x] Software Requirements Specification (SRS)
- [x] Architecture document
- [x] CLAUDE.md
- [x] PROJECT_ROADMAP.md
- [x] Database design document
- [x] API specification
- [x] UI style guide

---

### Database

- [x] Design ER diagram (→ Epic 002)
- [x] Create database schema (→ Epic 002)
- [x] Create migrations (→ Epic 002)
- [x] Create seed data (→ Epic 002)
- [x] Import initial catalog (→ Epic 002)

---

### Backend

#### Programs Module

- [x] Program entity
- [x] Program repository
- [x] Program service
- [x] Program controller
- [x] CRUD API

---

#### Courses Module

- [x] Course entity
- [x] Course repository
- [x] Course service
- [x] Course controller

---

#### Knowledge Areas

- [x] Entity
- [x] Service
- [x] API

---

#### Requirement Groups

- [x] Entity
- [x] Service
- [x] API

---

#### Search

- [x] Search API
- [x] Full-text search
- [x] Filtering

---

### Frontend

#### Layout

- [x] Navigation bar
- [x] Footer
- [x] Theme
- [x] Responsive layout

---

#### Home Page

- [x] Hero section
- [x] Program cards
- [ ] Search box (Epic 005)
- [ ] Featured visualizations (Epic 006/007)

---

#### Program Explorer

- [x] Program list
- [x] Program detail page
- [x] Requirement summary
- [ ] Learning outcomes (future)

---

#### Course Explorer

- [x] Search (keyword, by code/title via URL params)
- [x] Filters (level: undergraduate/graduate)
- [x] Course list page with pagination (18/page)
- [x] Course detail page (hero, info table, prereqs/coreqs)
- [x] PrerequisiteList with linked course chips
- [ ] Related courses (future)

---

#### Curriculum Roadmap

- [x] Phase-by-phase timeline (requirement-group columns)
- [x] Course cards with level badge, credits, link to detail
- [x] Zoom (CSS zoom 50–150% via range slider)
- [x] Collapse/expand per column
- [x] Credit totals per phase
- [x] GET /programs/:id/roadmap backend endpoint
- [x] Fix required credits total (specialization deduplication — count one track, not all 3)
- [x] Visual distinction for specialization columns (amber header, ring, "choose one" label, info banner)

---

#### Prerequisite Graph

- [x] React Flow integration (@xyflow/react ^12.11.1)
- [x] CourseNode: custom node with level-colored border, code/title/credits
- [x] Edge rendering: solid=prerequisite, dashed=corequisite
- [x] Node click highlights connected edges blue
- [x] DetailsPanel: course details + link to course detail page
- [x] MiniMap, zoom/pan Controls, Background
- [x] Topological-sort layout utility (graphLayout.ts)
- [x] GET /programs/:id/graph backend endpoint
- [x] /programs/:id/graph frontend page

---

#### Program Comparison (Milestone 10 — v1.0.0)

- [x] Comparison page (/programs/compare)
- [x] Credit comparison (total credits, credit bars, UG/grad breakdown)
- [x] Requirement comparison (requirement phases per program side-by-side)
- [x] Program CTAs (Requirements, Roadmap, Graph per program)
- [x] Knowledge area comparison (Knowledge Area Coverage table; uses GET /programs/:id/knowledge-areas)

---

#### Admin (Epic 008 — Complete)

- [x] JWT auth: login, logout, me (httpOnly cookie)
- [x] AdminUser + AuditLog entities + migration
- [x] RolesGuard + RBAC (system_admin, curriculum_admin, content_editor)
- [x] Admin seed (ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD env vars)
- [x] Dashboard stats endpoint + recent activity
- [x] Admin CRUD: programs, courses (incl. prereq/coreq), requirement groups, knowledge areas, catalog years
- [x] Audit log endpoint with pagination
- [x] Next.js route groups: (public) + (admin-shell) dual root layouts
- [x] Next.js middleware: protects /admin/* routes
- [x] Admin login page (dark theme, cookie auth)
- [x] Admin protected layout: sidebar + header with role badge
- [x] Admin pages: dashboard, programs, courses, requirement groups, knowledge areas, catalog years, audit log
- [x] Reusable: DataTable, ConfirmDialog, ProgramForm, CourseForm components

#### Post-Epic 008 Fixes (v0.8.1)

- [x] Global 404 page (app/not-found.tsx) with html/body root
- [x] Error boundaries: (public)/error.tsx + (admin-shell)/error.tsx
- [x] Error handling on all list pages: try/catch around API calls, red banner on failure
- [x] Fix "Coming in Epic 006/007" static badges → clickable links on course detail page
- [x] Unique constraint migration: programs.abbreviation + requirement_groups.(catalog_year_id, name)
- [x] ConflictException (409) on duplicate: all 5 admin controllers catch PG error 23505
- [x] Create/edit UI for Knowledge Areas (KaForm, EditKaClient, new/edit pages)
- [x] Create/edit UI for Requirement Groups (RgForm, NewRgClient, EditRgClient, new/edit pages)
- [x] Create UI for Catalog Years (CyForm, NewCyClient, new page)
- [x] Relationship display: Catalog Year table shows program abbreviation+name (AdminCyClient)
- [x] Relationship display: Requirement Group table shows catalog year academicYear (AdminRgClient)
- [x] Fix server→client function serialization error: extract AdminCyClient as 'use client' component
- [x] Fix Docker volume mounts: add frontend/components, frontend/lib, frontend/middleware.ts

#### Public UI Professional Polish (v0.8.4)

- [x] Home page: stats/trust bar (programs, courses, catalog year, accreditation); gold eyebrow labels
- [x] Programs list: white page-header band with gold eyebrow + breadcrumb; bottom CTA to courses
- [x] Courses list: white page-header band with gold eyebrow + count; filtered-results indicator
- [x] Course detail: navy gradient hero + dot pattern + gold bar (replaces gray-800); navy info table thead; gold section eyebrows; SVG icons in "Explore Further" (replaces emoji)
- [x] CourseFilters: blue focus ring → sfbu-navy CSS var ring
- [x] PrerequisiteList: blue chip hover → navy-tinted; empty state in card; uppercase tracking headers
- [x] CoursePagination: "Next →" button navy bg; consistent disabled states
- [x] AdminSidebar collapse toggle: chevron button + icon-only mode + localStorage persistence

---

#### Admin UI Modernization + Dark Mode Fix (v0.8.2)

- [x] Fix dark mode toggle: `@custom-variant dark` → `@variant dark` in globals.css (overrides built-in media-query variant)
- [x] SFBU brand colors in CSS vars (--sfbu-navy #1C3766, --sfbu-gold #C5972B)
- [x] ThemeProvider (localStorage persistence) + ThemeToggle (sun/moon button) in admin header
- [x] Fix invisible input text: explicit `text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-800` on all form inputs/selects
- [x] AdminSidebar: SFBU navy background, gold accent bar, brand badge, SVG icons
- [x] Admin login page: SFBU navy background, gold avatar, branded card
- [x] Dashboard: stat cards with navy/gold/green icon badges, dark mode throughout
- [x] DataTable: full dark mode (thead, tbody, rows, text, actions)
- [x] All 5 forms: dark mode labels, inputs, errors, cancel button
- [x] All list pages: heading dark mode + card dark mode + action button uses var(--sfbu-navy)
- [x] All new/edit pages: heading dark:text-white
- [x] Audit log page: full dark mode (heading, card, table, pagination)
- [x] Catalog years edit page: breadcrumb dark mode

---

### Testing — Milestone 13 (v0.9.1)

- [x] Backend unit tests: pagination utility, ProgramsService, CoursesService, AuthService (29 tests)
- [x] Frontend test setup: Jest + next/jest + @testing-library/react + jest.setup.ts
- [x] Frontend unit tests: URL building logic, search param construction (8 tests)
- [x] CI: frontend unit test step added before build
- [ ] Integration tests (backend ↔ database — requires test DB)
- [x] API tests (Supertest e2e — isolated NestJS modules, no DB; 21 tests covering programs + courses + health)
- [x] Frontend component tests (React Testing Library — CourseCard, ProgramCard, Breadcrumb, CoursePagination; 38 tests)
- [x] Accessibility tests (jest-axe — CourseCard, ProgramCard, Breadcrumb all pass axe)

---

### Deployment — Epic 009 (v0.9.0)

- [x] Docker configuration (dev compose + Dockerfiles)
- [x] Environment variables (.env.example)
- [x] Production Docker Compose (docker-compose.prod.yml — target:production, health checks, internal network)
- [x] Production Nginx (docker/nginx.prod.conf — HTTPS, security headers, rate limiting)
- [x] Deploy script (scripts/deploy.sh — pull → build → migrate → start → smoke test)
- [x] Backup script (scripts/backup.sh — timestamped pg_dump, 30-file retention)
- [x] Restore script (scripts/restore.sh — drop + restore from .sql.gz)
- [x] Health check / smoke test (scripts/healthcheck.sh)
- [x] Self-signed cert generator (scripts/gen-self-signed-cert.sh — staging only)
- [x] CI Docker build validation (docker job in ci.yml — builds prod images)
- [x] .gitignore: docker/ssl/, backups/, .env.prod excluded
- [x] Deployment documentation (docs/08-DeploymentGuide.md — full rewrite with real commands)

---

## Completed

- [x] Initialize Git repository
- [x] Create project documentation (SRS, Architecture, DB, API, UI/UX, Coding Standards, Testing Strategy, Deployment Guide, Catalog Data Model, Developer Guide)
- [x] Create all 9 epics (001–009)
- [x] Create PROJECT_ROADMAP.md (14 milestones)
- [x] Create CLAUDE.md
- [x] Scaffold Next.js frontend (Next.js 16, TypeScript, Tailwind CSS, App Router)
- [x] Scaffold NestJS backend (NestJS 11, TypeScript)
- [x] Add health endpoint (`GET /api/v1/health`)
- [x] Install TypeORM, PostgreSQL, config, validation packages
- [x] Create docker-compose.yml
- [x] Create backend/Dockerfile and frontend/Dockerfile
- [x] Create docker/nginx.conf
- [x] Create .env.example
- [x] Create .gitignore
- [x] Configure Prettier (.prettierrc)
- [x] Configure Husky pre-commit hook
- [x] Set up GitHub Actions CI (.github/workflows/ci.yml)
- [x] Populate README.md
- [x] Fix doc inconsistencies (ORM, CLAUDE.md path, broken refs)
- [x] Create 10 TypeORM entities (Program, CatalogYear, RequirementGroup, Course, KnowledgeArea, CourseKnowledgeArea, ProgramRequirement, Prerequisite, Corequisite, CatalogImport)
- [x] Configure DatabaseModule with TypeORM (database.config.ts, database.module.ts)
- [x] Create AppDataSource for TypeORM CLI migrations
- [x] Create InitialSchema migration (all 10 tables, FK constraints, indexes, enums)
- [x] Create seed data from 2025-2026 SFBU catalog (3 programs, 70+ courses, prerequisites, corequisites, requirement groups)
- [x] Build typed API client (frontend/lib/api.ts) with server/client URL switching (SSR + browser)
- [x] Build Nav, Breadcrumb shared UI components
- [x] Build ProgramCard, ProgramHero, RequirementSummary, ProgramNavigation components
- [x] Build Programs list page (/programs) — server component with live API data
- [x] Build Program detail page (/programs/[id]) — requirements table, catalog years
- [x] Rewrite home page with hero section, live program grid, features section
- [x] Configure docker-compose.yml with API_BASE_URL for SSR internal routing

---

## Blocked

(None)

---

## Notes

- Version 1 does not include student accounts, transcripts, GPA, or advising workflows.
- The application is a public-facing curriculum visualization platform built from the university catalog.
- Next milestone: Epic 009 — Deployment.
