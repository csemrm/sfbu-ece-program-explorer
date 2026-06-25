

# Epic 001 – Project Foundation

## Overview
The SFBU ECE Program Explorer is a web application designed to help students, faculty, and advisors navigate the Electrical and Computer Engineering (ECE) curriculum at San Francisco Bay University. This epic establishes the foundational project structure, tooling, and initial scaffolding necessary for future development. It ensures that the development environment, codebase, and documentation are set up according to best practices.

## Objective
Lay the groundwork for the SFBU ECE Program Explorer by initializing the repository, setting up the frontend and backend scaffolds, configuring the database, establishing development workflows, and documenting the project structure and standards.

## Scope
- Initialize the git repository with basic structure and documentation
- Scaffold the frontend (Next.js, React, TypeScript, Tailwind CSS)
- Scaffold the backend (NestJS, TypeScript)
- Set up PostgreSQL database configuration
- Configure Docker and Docker Compose for local development
- Establish linting, formatting, and commit hooks
- Set up CI workflows (GitHub Actions)
- Provide initial documentation and project roadmap

## Out of Scope
- Implementation of domain-specific features (course data, visualization, user management, etc.)
- Production deployment or cloud infrastructure
- Advanced authentication or authorization
- Any curriculum-specific logic or data import

## Technology Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **Visualization:** React Flow, D3.js, Recharts
- **DevOps:** Docker, Docker Compose, GitHub Actions

## Repository Structure
Planned top-level folders and files:
```
docs/
epics/
frontend/
backend/
database/
scripts/
docker/
.github/
management/
```

## Deliverables
- Initialized git repository with structure above
- Frontend scaffolded with Next.js, React, TypeScript, Tailwind CSS
- Backend scaffolded with NestJS (TypeScript)
- PostgreSQL configuration (Docker Compose, connection settings)
- Docker Compose file to orchestrate services
- Linting and formatting (ESLint, Prettier) for both frontend and backend
- Initial README.md with project overview and setup instructions
- `management/CLAUDE.md`, `management/PROJECT_ROADMAP.md`, and `management/TASKS.md` created and populated

## Functional Requirements
- Project initializes and builds successfully (frontend, backend, database)
- Frontend can communicate with a backend placeholder API endpoint
- Database connection is configured and accessible from backend
- Environment variables are supported for configuration

## Non-Functional Requirements
- All code uses TypeScript
- Coding standards enforced via ESLint and Prettier
- Responsive design and accessibility in initial frontend scaffold
- Modular and scalable code architecture

## Tasks
### Setup Checklist
- [ ] Initialize git repository and create base folder structure
- [ ] Scaffold frontend with Next.js, React, TypeScript, Tailwind CSS
- [ ] Scaffold backend with NestJS (TypeScript)
- [ ] Configure PostgreSQL (Docker Compose, connection settings)
- [ ] Create Docker and Docker Compose files
- [ ] Set up ESLint and Prettier for monorepo
- [ ] Configure Husky for pre-commit hooks
- [ ] Set up initial GitHub Actions CI workflow
- [ ] Add README.md, CLAUDE.md, PROJECT_ROADMAP.md, TASKS.md
- [ ] Document development setup and contribution guidelines

## Dependencies
- None (this is the initial epic)

## Acceptance Criteria
- Application builds and starts successfully (frontend, backend, database)
- Docker Compose brings up all services without error
- Frontend loads in browser and displays a placeholder page
- Backend health endpoint responds (e.g., `/api/health`)
- Documentation exists in README.md and management files

## Definition of Done
- All setup tasks completed and checked off
- Codebase adheres to formatting and linting rules
- All deliverables present and functional
- Documentation is clear and up to date
- All acceptance criteria are met

## AI Execution Instructions
1. **Read** `management/CLAUDE.md`, `management/PROJECT_ROADMAP.md`, and `management/TASKS.md` before coding.
2. **Implement only this epic** (do not begin future features or epics).
3. **Keep changes modular**—update one concern at a time, following the tasks checklist.
4. **Update** `management/TASKS.md` and `CHANGELOG.md` after completing each major step.
5. **Summarize** all modified files and suggest the next logical epic for implementation.