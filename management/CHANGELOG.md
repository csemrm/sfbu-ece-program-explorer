# CHANGELOG

## [Unreleased]

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
