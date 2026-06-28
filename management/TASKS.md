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

#### Program Comparison

- [ ] Comparison page
- [ ] Credit comparison
- [ ] Knowledge area comparison
- [ ] Requirement comparison

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

### Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] API tests
- [ ] UI tests

---

### Deployment

- [x] Docker configuration
- [x] Environment variables
- [ ] Production build validation
- [ ] Deployment documentation

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
