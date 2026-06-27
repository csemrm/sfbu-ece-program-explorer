SFBU ECE Program Explorer

Coding Standards

Version: 1.0
Status: Draft

⸻

Revision History

Version	Date	Author	Description
1.0	2026-06-24	Project Team	Initial Coding Standards

⸻

1. Purpose

This document defines the coding standards for the SFBU ECE Program Explorer.

The objective is to ensure that the project remains:

* Maintainable
* Readable
* Consistent
* Scalable
* Testable

These standards apply to every contributor, including AI coding assistants.

⸻

2. General Principles

Every contribution should follow these principles:

* Readability over cleverness
* Simplicity over complexity
* Reuse over duplication
* Composition over inheritance
* Explicit code over implicit behavior

⸻

3. Languages

Layer	Language
Frontend	TypeScript
Backend	TypeScript
Database	SQL (PostgreSQL)
Documentation	Markdown

JavaScript should not be used unless absolutely necessary.

⸻

4. Naming Conventions

Files

React Components

ProgramCard.tsx
CourseCard.tsx
RoadmapCanvas.tsx

Utilities

formatCourse.ts
buildGraph.ts

Hooks

useCourses.ts
useRoadmap.ts

⸻

Variables

Use camelCase

courseTitle
programList
selectedCatalog

⸻

Components

Use PascalCase

ProgramExplorer
CourseExplorer
AdminDashboard

⸻

Interfaces

interface Course
interface Program

Avoid prefixes like

ICourse
IProgram

⸻

Types

type CatalogYear
type RequirementGroup

⸻

Enums

enum ProgramType
enum RequirementType

⸻

5. Folder Organization

Frontend

components/
modules/
hooks/
services/
types/
utils/
styles/

Backend

controllers/
services/
repositories/
entities/
dto/
common/

Never place unrelated files together.

⸻

6. React Standards

Use

* Functional Components
* Hooks
* TypeScript
* Composition

Avoid

* Class Components
* Large monolithic components

Example

export function ProgramCard() {
}

⸻

7. Component Rules

A component should

* have one responsibility
* be reusable
* receive typed props
* avoid business logic

Maximum

300 lines

If larger

Split it.

⸻

8. Backend Standards

Every module should contain

Controller
Service
Repository
DTO
Entity
Tests

Business logic belongs inside

Service

Never inside

Controller

⸻

9. Database Standards

Use

UUID

for primary keys.

Every table should include

created_at
updated_at

Optional

deleted_at

⸻

10. API Standards

REST only

Example

GET /programs
GET /courses
POST /admin/programs

Responses

{
  "success": true,
  "data": {}
}

⸻

11. Error Handling

Never expose stack traces.

Always return

{
  "success": false,
  "error": {
    "code": "...",
    "message": "..."
  }
}

⸻

12. Comments

Good

Explain

WHY

Not

WHAT

Bad

// increment i

Good

// Cache program metadata because it rarely changes.

⸻

13. Formatting

Use

* Prettier
* ESLint

Maximum line length

100

Indentation

2 spaces

⸻

14. Testing Standards

Every feature should include

* Unit Tests
* Integration Tests

Critical features

End-to-End Tests

⸻

15. Git Standards

Branch names

feature/program-explorer
feature/course-search
bugfix/api-pagination

Commit messages

feat:
fix:
docs:
refactor:
test:
chore:

Example

feat: implement course explorer search

⸻

16. Security Standards

Never

* hardcode secrets
* commit passwords
* expose internal errors

Always

* validate inputs
* sanitize outputs
* use HTTPS

⸻

17. Accessibility Standards

Every UI component must

* support keyboard navigation
* use semantic HTML
* include ARIA labels where needed
* maintain WCAG 2.1 AA compliance

⸻

18. Performance Standards

* Lazy load large modules
* Avoid unnecessary re-renders
* Paginate large datasets
* Cache catalog data where appropriate

⸻

19. Documentation Standards

Every major feature must update

* SRS.md (if requirements change)
* Architecture.md (if architecture changes)
* Database.md (if schema changes)
* API.md (if endpoints change)
* UIUX.md (if interface changes)
* CHANGELOG.md
* TASKS.md

⸻

20. AI Coding Standards

When using Claude Code or another AI assistant:

* Read CLAUDE.md before making changes.
* Read the current Epic before implementation.
* Make focused, incremental changes.
* Do not refactor unrelated code.
* Update documentation after completing work.
* Explain significant design decisions in pull requests or commit messages.

⸻

21. Definition of Done

Code is complete only when:

* It follows these coding standards.
* It builds successfully.
* Tests pass.
* Documentation is updated.
* No linting or formatting errors remain.
* The feature satisfies the corresponding Epic and SRS requirements.

⸻

References

* docs/SRS.md
* docs/02-Architecture.md
* docs/03-Database.md
* docs/04-API.md
* docs/05-UIUX.md
* CLAUDE.md
* management/PROJECT_ROADMAP.md
* epics/001-foundation.md