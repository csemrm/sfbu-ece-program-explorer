# CHANGELOG

## [Unreleased]

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
