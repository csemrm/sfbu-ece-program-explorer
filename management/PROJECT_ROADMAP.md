SFBU ECE Program Explorer

Project Roadmap

Version: 2.0
Last Updated: 2026-06-27

Status: 🟡 In Progress

⸻

Project Vision

Develop an interactive web application that transforms the SFBU Electrical and Computer Engineering catalog into an engaging visual learning platform.

The application supports:

* Bachelor of Science in Computer Science (BSCS)
* Master of Science in Computer Science (MSCS)
* Master of Science in Electrical Engineering (MSEE)

This is a curriculum visualization platform only.

⸻

Project Goals

* Replace static PDF catalog browsing with interactive visualizations.
* Help students understand curriculum structure.
* Visualize prerequisite relationships.
* Compare academic programs.
* Provide an intuitive educational experience.

⸻

Development Strategy

The project is developed incrementally.

Each milestone must:

* Build successfully.
* Pass testing.
* Update documentation.
* Be committed to version control.

Do not begin the next milestone until the current one is complete.

⸻

Milestone 1 — Project Foundation

Objectives

* Initialize repository.
* Configure frontend.
* Configure backend.
* Configure PostgreSQL.
* Configure Docker.
* Create project documentation.

Deliverables

* Repository structure
* CLAUDE.md
* README.md
* SRS.md
* Architecture.md
* Initial CI configuration

Status: ✅ Complete (Epic 001 — v0.1.0)

⸻

Milestone 2 — Database Design

Objectives

Design the catalog database.

Tables

* Programs
* Courses
* Requirement Groups
* Knowledge Areas
* Prerequisites
* Corequisites
* Catalog Years

Deliverables

* ER diagram
* SQL schema
* Seed data (3 programs, 70+ courses)

Status: ✅ Complete (Epic 002 — v0.2.0)

⸻

Milestone 3 — Backend API

Objectives

Develop the REST API.

Modules

* Programs
* Courses
* Requirements
* Knowledge Areas
* Search

Deliverables

* REST endpoints
* Validation
* API documentation

Status: ✅ Complete (Epic 003 — v0.3.0)

⸻

Milestone 4 — Frontend Framework

Objectives

Create the application shell.

Pages

* Home
* Programs
* Courses
* Knowledge Areas
* Comparison
* About

Deliverables

* Responsive layout
* Navigation
* Theme

Status: ✅ Complete (Epic 004 — v0.4.0)

⸻

Milestone 5 — Program Explorer

Objectives

Develop the Program Explorer.

Features

* Program cards
* Program overview
* Requirement summary
* Curriculum roadmap link

Status: ✅ Complete (Epic 004 — v0.5.0)

⸻

Milestone 6 — Course Explorer

Objectives

Develop the Course Explorer.

Features

* Search (keyword, code, title)
* Filtering (level)
* Course list page with grid/list toggle
* Course detail (hero, info table, prerequisites)
* Prerequisite and corequisite display

Status: ✅ Complete (Epic 005 — v0.6.0, enhanced v0.8.4)

⸻

Milestone 7 — Curriculum Roadmap

Objectives

Visualize curriculum progression.

Features

* Phase-by-phase timeline
* Course cards with level badge and credits
* Zoom (50–150%) and collapse/expand per phase
* Credit totals per phase

Status: ✅ Complete (Epic 006 — v0.6.0)

⸻

Milestone 8 — Prerequisite Graph

Objectives

Build the interactive prerequisite network.

Features

* React Flow graph visualization
* Custom course nodes (level-colored borders)
* Solid/dashed edges (prerequisite/corequisite)
* Node click highlights connected edges
* Details panel with link to course detail
* MiniMap, zoom/pan controls

Status: ✅ Complete (Epic 007 — v0.7.0)

⸻

Milestone 9 — Knowledge Area Explorer

Objectives

Organize courses by learning domain.

Examples

* Programming
* Artificial Intelligence
* Networks
* Embedded Systems
* Digital Design

Status: 🟡 Partial — Admin CRUD complete; public browsing page not yet built.

⸻

Milestone 10 — Program Comparison

Objectives

Compare BSCS, MSCS, and MSEE.

Compare

* Credits
* Duration
* Requirement groups
* Knowledge areas
* Capstone requirements

Status: ⬜ Not Started — next milestone.

⸻

Milestone 11 — Administration

Objectives

Create an admin interface.

Functions

* Manage programs, courses, prerequisites, requirement groups, knowledge areas, catalog years
* Audit log
* Role-based access (system_admin, curriculum_admin, content_editor)
* Dark mode UI

Status: ✅ Complete (Epic 008 — v0.8.0, improved v0.8.1–v0.8.3)

⸻

Milestone 12 — Polish

Objectives

Improve quality.

Tasks

* SFBU brand theme (navy #1C3766, gold #C5972B)
* Accessibility
* Performance optimization
* Responsive testing
* UI refinement
* Error handling

Status: 🟡 In Progress — Brand theme, dark mode, error boundaries, and UI polish complete (v0.8.x). Formal accessibility audit and responsive QA pending.

⸻

Milestone 13 — Testing

Objectives

Complete testing.

Types

* Unit tests
* Integration tests
* API tests
* UI tests

Status: ⬜ Not Started

⸻

Milestone 14 — Deployment

Objectives

Prepare production deployment.

Deliverables

* Docker Compose (dev + production)
* Production Nginx (HTTPS, security headers, rate limiting)
* Deployment scripts (deploy, backup, restore, healthcheck)
* CI Docker build validation
* Deployment guide

Status: ✅ Complete (Epic 009 — v0.9.0)

⸻

Current Milestone

Milestone 10 — Program Comparison

Next development task should target Program Comparison unless priorities change.

⸻

Completed Versions

| Version | Milestone | Epic |
| ------- | --------- | ---- |
| v0.1.0  | Foundation       | 001 |
| v0.2.0  | Database         | 002 |
| v0.3.0  | Backend API      | 003 |
| v0.4.0  | Frontend Shell   | 004 |
| v0.5.0  | Program Explorer | 004 |
| v0.6.0  | Course Explorer + Roadmap | 005, 006 |
| v0.7.0  | Prerequisite Graph | 007 |
| v0.8.0  | Administration   | 008 |
| v0.8.1  | Post-Admin fixes + forms | — |
| v0.8.2  | Dark mode fix + admin brand | — |
| v0.8.3  | Public UI brand theme | — |
| v0.8.4  | Public UI polish + grid/list toggle | — |
| v0.9.0  | Deployment infrastructure | 009 |

⸻

Future Enhancements (Post v1.0)

* Student login
* Degree planning
* Personalized dashboards
* AI recommendations
* Transcript import
* Degree audit
* Career pathway recommendations
* SIS integration
* Kubernetes / container orchestration
* CDN integration
* Redis cache
* Multi-region deployment

⸻

Definition of Done

A milestone is complete only when:

* All planned features are implemented.
* Documentation is updated.
* Tests pass.
* The application builds successfully.
* No known critical issues remain.
