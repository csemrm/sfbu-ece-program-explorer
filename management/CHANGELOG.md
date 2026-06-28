# CHANGELOG

## [Unreleased]

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
