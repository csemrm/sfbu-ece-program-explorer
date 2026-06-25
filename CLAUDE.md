SFBU ECE Program Explorer

Version: 2.0

Purpose

This file contains permanent project instructions for Claude Code.

This document describes the project’s architecture, coding philosophy, development workflow, and operational rules.

Do not store sprint information, temporary tasks, or implementation progress here.

Those belong in:

* management/PROJECT_ROADMAP.md
* management/TASKS.md
* management/CHANGELOG.md

⸻

Project Overview

The SFBU ECE Program Explorer is a web-based curriculum visualization platform for the Electrical and Computer Engineering Department at San Francisco Bay University.

The application converts the official university catalog into an interactive educational experience.

Supported users include:

* Prospective Students
* Current Students
* Faculty
* Academic Advisors (presentation mode)
* Curriculum Administrators

The application is educational and informational.

It is not a Student Information System.

⸻

Supported Programs

Current programs:

* Bachelor of Science in Computer Science (BSCS)
* Master of Science in Computer Science (MSCS)
* Master of Science in Electrical Engineering (MSEE)

The architecture should allow future programs without major redesign.

⸻

Primary Goal

Build an interactive platform that helps users understand:

* Program structure
* Curriculum pathways
* Course relationships
* Prerequisite chains
* Knowledge areas
* Degree requirement groups

The application should provide a significantly better experience than navigating static PDF catalogs.

⸻

Project Scope

The project visualizes academic information.

Version 1 does not include:

* Student login
* Student profiles
* Student records
* Grades
* GPA
* Degree audit
* Enrollment
* Registration
* Financial Aid
* FERPA data
* SIS integration

Authentication is required only for the Administration Dashboard.

⸻

Documentation Hierarchy

Claude should consider the following documents authoritative.

Priority order:

1. CLAUDE.md
2. docs/
3. management/
4. epics/
5. Source Code

When documentation conflicts occur:

SRS

↓

Architecture

↓

Database/API

↓

Current Epic

Current Epics may refine implementation details but should never override business requirements defined in the SRS.

⸻

Startup Workflow

Whenever beginning work:

1. Read:

* management/PROJECT_ROADMAP.md
* management/TASKS.md
* management/CHANGELOG.md

2. Read all documents inside:

docs/

3. Read the current Epic.
4. Determine:

* Current milestone
* Remaining tasks
* Dependencies
* Files affected

5. Present an implementation plan before making code changes.

⸻

Data Source

The university catalog is the authoritative source.

Catalog information is transformed into structured data.

Primary entities include:

* Programs
* Catalog Years
* Requirement Groups
* Courses
* Knowledge Areas
* Prerequisites
* Corequisites
* Curriculum Roadmaps

⸻

Technology Stack

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Visualization

* React Flow
* D3.js
* Recharts

Backend

* NestJS

Database

* PostgreSQL

Deployment

* Docker
* Docker Compose
* Nginx

⸻

Architecture Principles

Always follow:

* Layered Architecture
* REST API
* Component-based Frontend
* Separation of Concerns
* Modular Design
* Strong Typing
* Reusable Components

Avoid:

* Tight coupling
* Large monolithic components
* Duplicate logic

⸻

UI Philosophy

The interface should feel like an interactive educational platform.

Prioritize:

* Visual Learning
* Exploration
* Simplicity
* Accessibility
* Responsiveness

Avoid administrative-style interfaces for public users.

⸻

Coding Standards

Always:

* Use TypeScript.
* Prefer functional React components.
* Prefer composition over inheritance.
* Keep functions focused.
* Reuse existing components.
* Follow ESLint and Prettier.

Component guideline:

Prefer components under approximately 300 lines when practical.

⸻

Implementation Rules

Before coding:

* Understand requirements.
* Review existing implementation.
* Reuse components whenever possible.

During implementation:

* Modify only relevant files.
* Avoid unrelated refactoring.
* Preserve architecture.
* Maintain documentation consistency.

Never implement student-related features unless explicitly requested.

⸻

Documentation Policy

Whenever architecture changes:

Update:

* docs/02-Architecture.md

Whenever database changes:

Update:

* docs/03-Database.md

Whenever API changes:

Update:

* docs/04-API.md

Whenever UI changes:

Update:

* docs/05-UIUX.md

Whenever requirements change:

Update:

* docs/SRS.md

Always update:

* management/TASKS.md
* management/CHANGELOG.md

⸻

AI Workflow

For every implementation:

1. Understand the task.
2. Review documentation.
3. Explain the implementation plan.
4. Implement only the requested feature.
5. Verify the implementation.
6. Summarize modified files.
7. Recommend the next logical task.

Do not modify unrelated code.

⸻

Performance Goals

* Fast page loads
* Efficient graph rendering
* Lazy loading where appropriate
* Optimized API responses
* Small frontend bundle

⸻

Accessibility

Follow WCAG 2.1 AA.

Support:

* Keyboard navigation
* Screen readers
* Responsive layouts
* Sufficient color contrast

⸻

Definition of Done

A task is complete only when:

* Requirements are satisfied.
* Code builds successfully.
* Tests pass (when applicable).
* Documentation is updated.
* TASKS.md is updated.
* CHANGELOG.md is updated.
* No unrelated code was modified.
* Code follows project standards.

⸻

Project Vision

The SFBU ECE Program Explorer will become the primary interactive interface for understanding Electrical and Computer Engineering curricula, replacing static catalog browsing with an engaging visual learning experience.


# Startup

Always read in this order:

1. CLAUDE.md

2. docs/README.md

3. management/PROJECT_ROADMAP.md

4. management/TASKS.md

5. management/CHANGELOG.md

6. epics/README.md

7. Current Epic

Do not read every Epic unless required.