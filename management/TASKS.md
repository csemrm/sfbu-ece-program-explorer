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

- [ ] Program entity
- [ ] Program repository
- [ ] Program service
- [ ] Program controller
- [ ] CRUD API

---

#### Courses Module

- [ ] Course entity
- [ ] Course repository
- [ ] Course service
- [ ] Course controller

---

#### Knowledge Areas

- [ ] Entity
- [ ] Service
- [ ] API

---

#### Requirement Groups

- [ ] Entity
- [ ] Service
- [ ] API

---

#### Search

- [ ] Search API
- [ ] Full-text search
- [ ] Filtering

---

### Frontend

#### Layout

- [ ] Navigation bar
- [ ] Footer
- [ ] Theme
- [ ] Responsive layout

---

#### Home Page

- [ ] Hero section
- [ ] Program cards
- [ ] Search box
- [ ] Featured visualizations

---

#### Program Explorer

- [ ] Program list
- [ ] Program detail page
- [ ] Requirement summary
- [ ] Learning outcomes

---

#### Course Explorer

- [ ] Search
- [ ] Filters
- [ ] Course detail page
- [ ] Related courses

---

#### Curriculum Roadmap

- [ ] Timeline view
- [ ] Semester cards
- [ ] Zoom
- [ ] Pan

---

#### Prerequisite Graph

- [ ] React Flow integration
- [ ] Node rendering
- [ ] Edge rendering
- [ ] Highlight prerequisite paths

---

#### Program Comparison

- [ ] Comparison page
- [ ] Credit comparison
- [ ] Knowledge area comparison
- [ ] Requirement comparison

---

#### Admin

- [ ] Login
- [ ] Dashboard
- [ ] Course editor
- [ ] Program editor
- [ ] Catalog import

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

---

## Blocked

(None)

---

## Notes

- Version 1 does not include student accounts, transcripts, GPA, or advising workflows.
- The application is a public-facing curriculum visualization platform built from the university catalog.
- Next unfinished milestone task: PostgreSQL migrations and seed data (Epic 002).
