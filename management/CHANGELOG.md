# CHANGELOG

## [Unreleased]

---

## [0.9.2] — 2026-06-27

### Milestone 13 — API E2E Tests + Frontend Component + Accessibility Tests

#### Added

**Backend E2E (21 tests, 3 suites — all passing, isolated modules, no DB required):**
- `test/app.e2e-spec.ts` — `GET /api/v1/health` → 200, `status: ok`, timestamp string
- `test/programs.e2e-spec.ts` — `GET /api/v1/programs` paginated; query param passthrough; invalid page → 400; `GET /api/v1/programs/:id` → 200; non-UUID → 400; NotFoundException → 404; `/requirements` + `/roadmap` + `/graph` endpoints
- `test/courses.e2e-spec.ts` — `GET /api/v1/courses` paginated; `q` and `level` param passthrough; invalid page → 400; `GET /api/v1/courses/:id` → 200; non-UUID → 400; NotFoundException → 404; `GET /api/v1/courses/:id/prerequisites` → 200; non-UUID → 400; not-found → 404

**Frontend component tests (38 tests, 4 suites — all passing, RTL + jest-axe):**
- `__tests__/components/CourseCard.test.tsx` — code, title, UG/Grad badge, credits, description, null description, link href, axe pass
- `__tests__/components/ProgramCard.test.tsx` — name, abbreviation badge, degree label (all 3 programs), credit totals (120/36/36), description, null description, link href, CTA text, axe pass
- `__tests__/components/Breadcrumb.test.tsx` — single crumb, linked crumb, multi-crumb, aria-current on last crumb, no aria-current on linked crumbs, nav landmark, axe pass
- `__tests__/components/CoursePagination.test.tsx` — returns null when totalPages ≤ 1, page info text, plural/singular label, disabled spans on first/last page, link hrefs with page numbers, search param preservation in both directions

**CI:**
- `.github/workflows/ci.yml` — added e2e test step after unit tests in backend job (`npm run test:e2e`; isolated — no DB required)

---

## [0.9.1] — 2026-06-27

### Milestone 13 — Unit Tests

#### Added

**Backend (29 tests, 5 suites — all passing):**
- `src/common/dto/pagination.spec.ts` — `paginate()` result shape, `totalPages` ceil math, data passthrough
- `src/modules/programs/programs.service.spec.ts` — `findAll()` with/without abbreviation filter; `findOne()` happy path + `NotFoundException`; `findRequirements()` with catalog years + requirement groups + empty + not-found
- `src/modules/courses/courses.service.spec.ts` — `findAll()` no filters / `q` ILIKE / `level` / both; `findOne()` happy path + `NotFoundException`; `findPrerequisites()` with prereqs, coreqs, empty, not-found
- `src/modules/auth/auth.service.spec.ts` — `validateCredentials()` user-not-found / wrong-password / valid-credentials / query shape; `signToken()` return type + payload; `findById()` found + null

**Frontend (8 tests, 2 suites — all passing):**
- `jest.config.js` + `jest.setup.ts` — Jest setup with `next/jest` transformer, `jsdom`, `@testing-library/jest-dom`
- `__tests__/pagination.test.ts` — `pageHref()` URL building, param preservation, page overwrite
- `__tests__/api-url.test.ts` — server vs client base URL selection, search param building

**CI:**
- `.github/workflows/ci.yml` — added frontend unit test step before build in the frontend job

---

## [0.9.0] — 2026-06-27

### Epic 009 — Production Deployment Infrastructure

#### Added

- `docker-compose.prod.yml` — Production Docker Compose: `target: production` builds, no source mounts, no pgAdmin, health checks on all services, internal bridge network isolating PostgreSQL
- `docker/nginx.prod.conf` — Production Nginx: HTTP→HTTPS redirect, TLS 1.2/1.3, HSTS, security headers (X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options), rate limiting on `/api` (30 req/min, burst 20), immutable cache on `/_next/static`
- `scripts/deploy.sh` — Full deploy: pull → build prod images → wait for DB → run migrations → start services → smoke test
- `scripts/backup.sh` — Timestamped `pg_dump` to `backups/`, auto-retains last 30 files
- `scripts/restore.sh` — Drop + recreate DB + restore from `.sql.gz`, with confirmation prompt
- `scripts/healthcheck.sh` — Smoke tests all public endpoints (frontend, programs, courses, API, admin)
- `scripts/gen-self-signed-cert.sh` — Self-signed SSL cert generator for staging/testing

#### Changed

- `.github/workflows/ci.yml` — Added `docker` job: builds production images for both frontend and backend after lint/test/build pass, catching Dockerfile regressions in CI
- `.gitignore` — Added `docker/ssl/`, `backups/`, `.env.prod` to prevent committing secrets/certs/backup files
- `docs/08-DeploymentGuide.md` — Full rewrite: quick-start, production deploy steps, env var reference table, backup/restore commands, CI/CD description, nginx config notes, rollback procedure, security checklist, system requirements

---

## [0.8.4] — 2026-06-27

### Public UI — Professional Polish + Blue Purge

#### Changed

**Frontend — Public Pages:**
- `app/(public)/page.tsx` — Stats/trust bar (3 programs, 70+ courses, 2026 catalog, WASC accredited); gold eyebrow labels; refined hero CTA buttons
- `app/(public)/programs/page.tsx` — White `bg-white border-b` page header band with gold eyebrow "ECE Department"; breadcrumb inside band; bottom CTA card linking to course catalog
- `app/(public)/courses/page.tsx` — Same white page header band pattern; gold eyebrow; filtered-results indicator; content area `py-8`
- `app/(public)/courses/[id]/page.tsx` — Hero: navy gradient + dot pattern + gold accent bar (was `from-gray-800 to-gray-950`); level badge: navy-tinted for UG, purple for grad; course info table: SFBU navy thead; section eyebrows: gold; "Explore Further" cards: SVG icons in navy/gold badges, `group-hover:text-sfbu-navy`, no emoji

**Frontend — Course Components:**
- `components/courses/PrerequisiteList.tsx` — `hover:border-blue-300 hover:bg-blue-50` → navy-tinted; empty state wrapped in card; section headers use uppercase tracking style
- `components/courses/CourseFilters.tsx` — `focus:ring-blue-500` → CSS var `--sfbu-navy` ring; search icon inline
- `components/courses/CoursePagination.tsx` — "Next →" button: navy bg; prev/next styling consistent with brand

---

## [0.8.3] — 2026-06-27

### Public UI Branding — SFBU Navy + Gold Theme

#### Changed

**Frontend — Public UI:**
- `components/ui/Nav.tsx` — Navy background, gold accent bar, gold SF badge, white links with active-state highlight; now `'use client'` to support active path detection via `usePathname`
- `app/(public)/layout.tsx` — Footer: SFBU navy background, white text hierarchy
- `app/(public)/page.tsx` — Hero: SFBU navy gradient, dot pattern, gold "Browse Programs" CTA; "View all →" link uses navy; Features section: SVG icons with navy/gold/green icon badges, subtitle added
- `components/programs/ProgramCard.tsx` — BSCS card: navy-tinted background/border; BSCS badge: navy bg white text; "Explore program →" link: `text-sfbu-navy`; hover lift animation added
- `components/programs/ProgramHero.tsx` — BSCS: SFBU navy gradient; MSCS: purple; MSEE: emerald; dot pattern overlay; gold accent bar on BSCS hero
- `components/programs/RequirementSummary.tsx` — Table header row: SFBU navy background, white text; total credits: navy color
- `components/programs/ProgramNavigation.tsx` — Navy/gold icon badges instead of emoji; `group-hover:text-sfbu-navy` on headings
- `components/ui/Breadcrumb.tsx` — Link hover: `hover:text-sfbu-navy` instead of blue
- `components/courses/CourseCard.tsx` — Hover border: navy-tinted; UG badge: navy-tinted; title hover: `text-sfbu-navy`

---

## [0.8.2] — 2026-06-27

### Admin UI Dark Mode Fix + Full Dark Mode Coverage

#### Fixed

**Frontend:**
- `app/globals.css` — `@custom-variant dark` → `@variant dark`; `@custom-variant` creates new variants, `@variant` overrides the built-in media-query dark variant enabling class-based toggle
- `app/(admin-shell)/admin/(protected)/programs/page.tsx` — Headings + card + button dark mode
- `app/(admin-shell)/admin/(protected)/courses/page.tsx` — Headings + card + button dark mode
- `app/(admin-shell)/admin/(protected)/knowledge-areas/page.tsx` — Headings + card + button dark mode
- `app/(admin-shell)/admin/(protected)/requirement-groups/page.tsx` — Headings + card + button dark mode
- `app/(admin-shell)/admin/(protected)/catalog-years/page.tsx` — Headings + card + button dark mode
- `app/(admin-shell)/admin/(protected)/audit-log/page.tsx` — Full dark mode: heading, card, table (thead/tbody/rows/cells), pagination
- All `new/page.tsx` and `[id]/edit/page.tsx` pages — Added `dark:text-white` to headings; catalog-years edit breadcrumb gets dark variants

#### Changed

**Frontend:**
- "New X" action buttons across all list pages: replaced `bg-slate-900 hover:bg-slate-800` with `style={{ backgroundColor: 'var(--sfbu-navy)' }} hover:opacity-90` for brand consistency

---

## [0.8.1] — 2026-06-27

### Post-Epic 008 Fixes & Improvements

#### Added

**Frontend — Error Handling:**
- `app/not-found.tsx` — Global 404 page (includes `<html>/<body>` — required when no root `app/layout.tsx` exists)
- `app/(public)/error.tsx` — Client error boundary for public section (500, uncaught exceptions)
- `app/(admin-shell)/error.tsx` — Client error boundary for admin section
- All list pages (public + admin) — try/catch around API calls; red error banner on fetch failure instead of crash

**Frontend — Admin CRUD (missing pages added):**
- `components/admin/forms/KaForm.tsx` + `EditKaClient.tsx` — Knowledge area create/edit form
- `app/(admin-shell)/admin/(protected)/knowledge-areas/new/page.tsx` — Create knowledge area
- `app/(admin-shell)/admin/(protected)/knowledge-areas/[id]/edit/page.tsx` — Edit knowledge area
- `components/admin/forms/RgForm.tsx` + `NewRgClient.tsx` + `EditRgClient.tsx` — Requirement group forms
- `app/(admin-shell)/admin/(protected)/requirement-groups/new/page.tsx` — Create requirement group
- `app/(admin-shell)/admin/(protected)/requirement-groups/[id]/edit/page.tsx` — Edit requirement group
- `components/admin/forms/CyForm.tsx` + `NewCyClient.tsx` — Catalog year create form
- `app/(admin-shell)/admin/(protected)/catalog-years/new/page.tsx` — Create catalog year
- `components/admin/tables/AdminCyClient.tsx` — Client table for catalog years (extract from server page to fix function-serialization error)

**Backend — Duplicate Prevention:**
- `migrations/1719446402000-UniqueConstraints.ts` — Adds `UQ_programs_abbreviation` and `UQ_rg_catalog_year_name` constraints
- `ConflictException` handling in all 5 admin controllers: programs, courses, knowledge areas, requirement groups, catalog years — catches PG error code `23505`, returns 409 with human-readable message

#### Changed

**Frontend:**
- `app/(public)/courses/[id]/page.tsx` — Replaced static "Coming in Epic 006/007" badges with clickable `<Link>` to `/programs`
- `components/admin/tables/AdminCyClient.tsx` — Accepts `programs` prop; shows program abbreviation + name instead of raw UUID
- `components/admin/tables/AdminRgClient.tsx` — Accepts `catalogYears` prop; shows `academicYear` in new "Catalog Year" column instead of UUID
- `app/(admin-shell)/admin/(protected)/catalog-years/page.tsx` — Fetches programs in parallel via `Promise.all`; passes to AdminCyClient
- `app/(admin-shell)/admin/(protected)/requirement-groups/page.tsx` — Fetches catalogYears in parallel; passes to AdminRgClient; adds "+ New Requirement Group" button
- `app/(admin-shell)/admin/(protected)/knowledge-areas/page.tsx` — Adds "+ New Knowledge Area" button
- `components/admin/tables/AdminKaClient.tsx` — Added `editHref` for edit navigation
- `components/admin/tables/AdminRgClient.tsx` — Added `editHref` for edit navigation
- `docker-compose.yml` — Added missing volume mounts: `frontend/components`, `frontend/lib`, `frontend/middleware.ts` (fix for module-not-found on new component files)

**Backend:**
- `entities/program.entity.ts` — Added `@Unique(['abbreviation'])` decorator
- `entities/requirement-group.entity.ts` — Added `@Index(['catalogYearId', 'name'], { unique: true })`

#### Technical Notes

- Next.js App Router: functions (render callbacks) cannot be passed from server components to `'use client'` components — extract column definitions into a client component (`AdminCyClient`)
- Docker volume mount gap: new files in `frontend/components/` not found in container until `docker-compose.yml` added that mount and container rebuilt
- Global `not-found.tsx` at `app/` level requires its own `<html>/<body>` when no `app/layout.tsx` exists (route groups each have their own root layout)

---

## [0.8.0] — 2026-06-27

### Epic 008 — Administration Dashboard

#### Added

**Backend:**
- `entities/admin-user.entity.ts` — AdminUser entity (email, passwordHash, AdminRole enum, isActive)
- `entities/audit-log.entity.ts` — AuditLog entity (adminUserId, action, entityType, entityId, payload JSON)
- `migrations/1719446401000-AdminTables.ts` — Creates admin_users + audit_logs tables with indexes
- `modules/auth/` — JWT auth module: login/logout/me controller, AuthService (bcryptjs), JwtStrategy (cookie + Bearer), JwtAuthGuard, RolesGuard, @Roles() decorator, LoginDto
- `modules/admin/admin-audit.service.ts` — Shared service for writing audit log entries
- `modules/admin/dashboard/` — `GET /admin/dashboard` (stats: programs/courses/catalogYears counts + recent activity)
- `modules/admin/programs/` — CRUD `GET|POST /admin/programs`, `GET|PUT|DELETE /admin/programs/:id`
- `modules/admin/courses/` — CRUD + prereq/coreq management endpoints
- `modules/admin/requirement-groups/` — CRUD endpoints
- `modules/admin/knowledge-areas/` — CRUD endpoints
- `modules/admin/catalog-years/` — `GET|POST /admin/catalog-years`
- `modules/admin/audit-log/` — `GET /admin/audit-log` with pagination

**Changed (Backend):**
- `package.json` — Added `@nestjs/jwt`, `@nestjs/passport`, `bcryptjs`, `cookie-parser`, `passport`, `passport-jwt` (and `@types/*` dev deps). Uses `bcryptjs` (pure JS) instead of native `bcrypt` to support Docker Linux containers
- `main.ts` — Added `cookieParser()` middleware (default import required with `esModuleInterop`)
- `app.module.ts` — Imported AuthModule + AdminModule
- `database.config.ts` + `data-source.ts` — Added AdminUser + AuditLog to entities arrays
- `seeds/seed.ts` — Seeds initial admin user from `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` env vars with bcrypt hash

**Frontend:**
- `app/(public)/` — Moved all public pages into route group; relative imports updated (+1 `../` per level)
- `app/(admin-shell)/layout.tsx` — Separate root layout for admin area (html+body only, no Nav/footer)
- `app/(admin-shell)/admin/login/page.tsx` — Dark-themed login page with JWT cookie auth
- `app/(admin-shell)/admin/(protected)/layout.tsx` — Auth-checking server layout: reads admin_token cookie, calls /me, redirects on failure; renders AdminSidebar + header with role badge
- `app/(admin-shell)/admin/(protected)/dashboard/page.tsx` — Stats cards + recent activity table
- `app/(admin-shell)/admin/(protected)/programs/` — List, create, edit pages
- `app/(admin-shell)/admin/(protected)/courses/` — List, create, edit pages
- `app/(admin-shell)/admin/(protected)/requirement-groups/page.tsx`
- `app/(admin-shell)/admin/(protected)/knowledge-areas/page.tsx`
- `app/(admin-shell)/admin/(protected)/catalog-years/page.tsx`
- `app/(admin-shell)/admin/(protected)/audit-log/page.tsx` — Paginated audit log
- `middleware.ts` — Next.js middleware: redirects unauthenticated /admin/* to /admin/login
- `lib/admin-api.ts` — `adminFetch` helper, all AdminUser/DashboardStats/AuditEntry/Paginated types; server-side `adminApi` object; client-side `loginAdmin`/`logoutAdmin`
- `components/admin/AdminSidebar.tsx` — Collapsible sidebar with active-state links and sign-out
- `components/admin/DataTable.tsx` — Generic reusable table with edit/delete actions
- `components/admin/ConfirmDialog.tsx` — Modal confirm for destructive actions
- `components/admin/forms/ProgramForm.tsx` + `EditProgramClient.tsx`
- `components/admin/forms/CourseForm.tsx` + `EditCourseClient.tsx`
- `components/admin/tables/AdminProgramsTable.tsx` + `AdminCoursesTable.tsx`
- `components/admin/tables/AdminRgClient.tsx` + `AdminKaClient.tsx`
- `.env.example` — Added `ADMIN_SEED_EMAIL` + `ADMIN_SEED_PASSWORD`

#### Technical Notes

- `bcryptjs` required over `bcrypt` — native addon compiled on macOS fails with `ERR_DLOPEN_FAILED` in Docker Linux containers
- `cookieParser` must use default import (`import cookieParser from 'cookie-parser'`) when `esModuleInterop: true`; namespace import makes it non-callable (TS2349)
- Express `Request`/`Response` types in `@Res()`/`@Req()` params cause TS1272 with `isolatedModules` + `emitDecoratorMetadata`; fixed by using `any`
- Next.js route groups create real filesystem directories — all relative imports need one extra `../` per added group level
- Client components extract JWT token from `document.cookie` via regex for API calls (Next.js `cookies()` API is server-only)

---

## [0.7.0] — 2026-06-27

### Epic 007 — Prerequisite Graph

#### Added

**Backend:**
- `programs.module.ts` — Added `Course`, `Prerequisite`, `Corequisite` to TypeOrmModule
- `programs.service.ts` — `findGraph()`: fetches program courses via requirement groups, collects all prereq/coreq edges, returns nodes+edges
- `programs.controller.ts` — `GET /programs/:id/graph` endpoint
- `program.dto.ts` — `GraphNodeDto`, `GraphEdgeDto`, `ProgramGraphDto`

**Frontend:**
- `package.json` — Added `@xyflow/react ^12.11.1`
- `lib/api.ts` — `GraphNode`, `GraphEdge`, `ProgramGraph` types; `programs.graph(id)` call
- `lib/graphLayout.ts` — Topological-sort layout: longest-path level assignment → x/y positions
- `components/graph/CourseNode.tsx` — Custom React Flow node: level-colored border (blue=UG, purple=grad), code/title/credits, target+source handles
- `components/graph/DetailsPanel.tsx` — Absolute-positioned panel: course details, external badge, link to course detail
- `components/graph/GraphCanvas.tsx` — React Flow canvas: Background, Controls, MiniMap; node click highlights edges; pane click resets
- `components/graph/GraphPageClient.tsx` — `'use client'` wrapper for `dynamic(ssr:false)` (required by Next.js 16 App Router)
- `app/programs/[id]/graph/page.tsx` — Server component: fetch graph data, render hero + breadcrumb + canvas
- `components/programs/ProgramNavigation.tsx` — Replaced "Coming in Epic 007" with live link to graph page

---

## [0.6.0] — 2026-06-27

### Epic 006 — Curriculum Roadmap

#### Added

**Backend:**
- `programs.module.ts` — Added `RequirementGroup` and `ProgramRequirement` to TypeOrmModule
- `programs.service.ts` — `findRoadmap()`: fetches requirement groups with linked courses for latest catalog year
- `programs.controller.ts` — `GET /programs/:id/roadmap` endpoint
- `programs/dto/program.dto.ts` — `RoadmapCourseDto`, `RoadmapPhaseDto`, `ProgramRoadmapDto`

**Frontend:**
- `lib/api.ts` — `RoadmapCourse`, `RoadmapPhase`, `ProgramRoadmap` types; `programs.roadmap(id)` call
- `components/roadmap/RoadmapCourseCard.tsx` — Compact course card with level-colored left border and link
- `components/roadmap/PhaseColumn.tsx` — Collapsible column with courses list and credit total badge
- `components/roadmap/RoadmapCanvas.tsx` — Client component: CSS zoom slider (50–150%), level legend, scrollable canvas
- `app/programs/[id]/roadmap/page.tsx` — Roadmap page: hero, breadcrumb, canvas
- `components/programs/ProgramNavigation.tsx` — Replaced placeholder with live link to roadmap page

---

## [0.5.0] — 2026-06-27

### Epic 005 — Course Explorer (Frontend)

#### Added

- `frontend/components/courses/CourseCard.tsx` — Course card with code badge, level badge (UG/Grad), credits, truncated description
- `frontend/components/courses/CourseFilters.tsx` — Client component: keyword search + level filter, updates URL params via `router.push`
- `frontend/components/courses/PrerequisiteList.tsx` — Linked chips for prerequisites and corequisites
- `frontend/components/courses/CoursePagination.tsx` — Prev/Next pagination with URL search param preservation
- `frontend/app/courses/page.tsx` — Course list page: reads `searchParams`, server-fetches filtered data, 18/page
- `frontend/app/courses/[id]/page.tsx` — Course detail: hero with code/level/credits, description, info table, prerequisites section, explore-further cards

#### Changed

- `frontend/lib/api.ts` — Added `CoursePrerequisites`, `SearchResult` types; added `courses.get()`, `courses.prerequisites()` calls

---

## [0.4.0] — 2026-06-27

### Epic 004 — Program Explorer (Frontend)

#### Added

- `frontend/lib/api.ts` — Typed API client with server/client URL switching (`API_BASE_URL` for SSR, `NEXT_PUBLIC_API_URL` for browser)
- `frontend/components/ui/Nav.tsx` — Sticky navigation header with SFBU branding and Programs/Courses links
- `frontend/components/ui/Breadcrumb.tsx` — Accessible breadcrumb navigation with aria-current
- `frontend/components/programs/ProgramCard.tsx` — Program card with color accent per abbreviation (BSCS=blue, MSCS=purple, MSEE=emerald)
- `frontend/components/programs/ProgramHero.tsx` — Gradient hero section per program
- `frontend/components/programs/RequirementSummary.tsx` — Requirement groups table with min credits and total row
- `frontend/components/programs/ProgramNavigation.tsx` — Placeholder navigation cards for upcoming Epics 006/007
- `frontend/app/programs/page.tsx` — Programs list page (async server component, live API data)
- `frontend/app/programs/[id]/page.tsx` — Program detail page with requirements table, catalog year selector, breadcrumb
- `frontend/app/page.tsx` — Rewritten home page: gradient hero with live program badges, program grid, features section

#### Changed

- `frontend/app/layout.tsx` — Added Nav, footer with © year, metadata title template
- `docker-compose.yml` — Added `API_BASE_URL: http://backend:3001/api/v1` to frontend service
- `.env.example` — Added `API_BASE_URL` variable

---

## [0.3.0] — 2026-06-27

### Epic 003 — Backend API

#### Added

- `@nestjs/swagger` + `swagger-ui-express` — Swagger UI at `/api/docs`
- `common/filters/http-exception.filter.ts` — Global exception filter with consistent `{ statusCode, timestamp, path, message }` shape
- `common/dto/pagination.dto.ts` — `PaginationDto` (page/limit), `PaginatedResult<T>`, `paginate()` helper
- `modules/programs/` — `GET /programs`, `GET /programs/:id`, `GET /programs/:id/requirements`
- `modules/courses/` — `GET /courses`, `GET /courses/:id`, `GET /courses/:id/prerequisites`
- `modules/requirement-groups/` — `GET /requirement-groups`, `GET /requirement-groups/:id`
- `modules/knowledge-areas/` — `GET /knowledge-areas`, `GET /knowledge-areas/:id`
- `modules/catalog-years/` — `GET /catalog-years`, `GET /catalog-years/:id`
- `modules/search/` — `GET /search?q=&type=&level=` (ILIKE across programs and courses)

#### Changed

- `main.ts` — Added global exception filter, Swagger setup
- `app.module.ts` — Imports all 6 feature modules

---

## [0.2.0] — 2026-06-27

### Epic 002 — Database Design

#### Added

- `backend/src/database/entities/` — 10 TypeORM entities:
  - `program.entity.ts` — Program (BSCS, MSCS, MSEE)
  - `catalog-year.entity.ts` — CatalogYear with unique constraint on (program_id, academic_year)
  - `requirement-group.entity.ts` — RequirementGroup with minCredits and sortOrder
  - `course.entity.ts` — Course with CourseLevel enum (undergraduate/graduate)
  - `knowledge-area.entity.ts` — KnowledgeArea
  - `course-knowledge-area.entity.ts` — Junction with unique composite index
  - `program-requirement.entity.ts` — ProgramRequirement linking groups to courses
  - `prerequisite.entity.ts` — Prerequisite with unique constraint per course pair
  - `corequisite.entity.ts` — Corequisite with unique constraint per course pair
  - `catalog-import.entity.ts` — CatalogImport with ImportStatus enum
- `backend/src/database/entities/index.ts` — Barrel export for all entities
- `backend/src/database/database.config.ts` — TypeORM config factory from DATABASE_URL
- `backend/src/database/database.module.ts` — NestJS DatabaseModule (TypeOrmModule.forRootAsync)
- `backend/src/database/data-source.ts` — AppDataSource for TypeORM CLI
- `backend/src/database/migrations/1719446400000-InitialSchema.ts` — Full schema migration (all tables, FK constraints, composite indexes, enums)
- `backend/src/database/seeds/catalog-data.ts` — Typed seed data from 2025-2026 SFBU catalog (3 programs, 70+ courses, prerequisites, corequisites, requirement groups)
- `backend/src/database/seeds/seed.ts` — Idempotent seed runner script

#### Changed

- `backend/src/app.module.ts` — Imports DatabaseModule
- `backend/package.json` — Added migration scripts: `migration:run`, `migration:revert`, `migration:generate`, `migration:create`, `seed`

---

## [0.1.0] — 2026-06-27

### Epic 001 — Project Foundation

#### Added

- Repository structure: `frontend/`, `backend/`, `database/`, `docker/`, `scripts/`, `.github/`
- Frontend scaffold: Next.js 16, React, TypeScript, Tailwind CSS, App Router
- Backend scaffold: NestJS 11, TypeScript; health endpoint at `GET /api/v1/health`
- Backend dependencies: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/config`, `class-validator`, `class-transformer`
- `docker-compose.yml`: orchestrates `postgres`, `backend`, `frontend`, `nginx`
- `backend/Dockerfile` and `frontend/Dockerfile` (multi-stage: dev + production)
- `docker/nginx.conf`: reverse proxy routing `/api` → backend, `/` → frontend
- `.env.example`: all required environment variables documented
- `.gitignore`: covers Node.js, Next.js, NestJS, Docker, OS artifacts
- `.prettierrc` and `.prettierignore`: consistent formatting rules
- Root `package.json` with monorepo scripts
- Husky pre-commit hook: runs `lint-staged` on staged files
- GitHub Actions CI (`.github/workflows/ci.yml`): lint, build, test on push/PR
- `README.md`: project overview, quick start, structure, tech stack

#### Fixed (Documentation)

- `docs/03-Database.md`: resolved ORM ambiguity — TypeORM confirmed
- `docs/02-Architecture.md`: fixed broken epics reference link
- `docs/06-CodingStandards.md`: corrected `management/CLAUDE.md` → `CLAUDE.md`
- `docs/07-TestingStrategy.md`: fixed epic filename references
- `docs/10-DeveloperGuide.md`: corrected CLAUDE.md path, updated management section
- `epics/001-foundation.md`: corrected CLAUDE.md path in deliverables and AI instructions
