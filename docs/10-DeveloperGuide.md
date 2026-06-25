SFBU ECE Program Explorer

Developer Guide

Version: 1.0
Status: Draft

⸻

Revision History

Version	Date	Author	Description
1.0	2026-06-24	Project Team	Initial Developer Guide

⸻

Table of Contents

1. Introduction
2. Project Overview
3. Repository Structure
4. Development Environment
5. Getting Started
6. Technology Stack
7. Development Workflow
8. Coding Standards
9. Branching Strategy
10. Commit Guidelines
11. Documentation Standards
12. Working with Claude Code
13. Project Documentation
14. Build & Run
15. Testing
16. Debugging
17. Release Process
18. Troubleshooting
19. References

⸻

1. Introduction

This document provides guidance for developers contributing to the SFBU ECE Program Explorer.

It explains how to:

* set up the project
* follow development standards
* understand project organization
* collaborate effectively
* work with AI coding assistants

⸻

2. Project Overview

The SFBU ECE Program Explorer is an interactive curriculum visualization platform.

Supported Programs

* BSCS
* MSCS
* MSEE

Purpose

Transform the university catalog into interactive visualizations.

Version 1 excludes

* Student records
* Degree audit
* Enrollment
* Registration
* GPA
* SIS integration

⸻

3. Repository Structure

sfbu-ece-program-explorer/
docs/
management/
epics/
frontend/
backend/
database/
docker/
scripts/
.github/

⸻

4. Documentation Structure

docs/
01-SRS.md
02-Architecture.md
03-Database.md
04-API.md
05-UIUX.md
06-CodingStandards.md
07-TestingStrategy.md
08-DeploymentGuide.md
09-CatalogDataModel.md
10-DeveloperGuide.md

⸻

5. Project Management

management/
CLAUDE.md
PROJECT_ROADMAP.md
TASKS.md
CHANGELOG.md
DEVELOPMENT_WORKFLOW.md

⸻

6. Development Workflow

Before coding

Read

* CLAUDE.md
* PROJECT_ROADMAP.md
* TASKS.md
* Current Epic

Understand

* architecture
* requirements
* dependencies

Plan

Implement

Test

Document

Commit

⸻

7. Technology Stack

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* React Flow
* Recharts

⸻

Backend

* NestJS
* TypeScript

⸻

Database

* PostgreSQL

⸻

Deployment

* Docker
* Docker Compose
* Nginx

⸻

8. Getting Started

Clone

git clone <repository>

Install

npm install

Frontend

cd frontend
npm install
npm run dev

Backend

cd backend
npm install
npm run start:dev

Docker

docker compose up -d

⸻

9. Environment Variables

Frontend

NEXT_PUBLIC_API_URL

Backend

DATABASE_URL
JWT_SECRET
NODE_ENV

Database

POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB

⸻

10. Coding Standards

Follow

docs/06-CodingStandards.md

Always

* TypeScript
* ESLint
* Prettier

⸻

11. Branch Strategy

main
develop
feature/*
bugfix/*
release/*

Examples

feature/program-explorer
feature/course-search
bugfix/api-pagination

⸻

12. Commit Messages

Use Conventional Commits

feat:
fix:
docs:
refactor:
test:
chore:

Example

feat: implement curriculum roadmap

⸻

13. Working with Claude Code

Before every session

Claude should read

* CLAUDE.md
* PROJECT_ROADMAP.md
* TASKS.md
* Current Epic

Typical prompt

Read the project documentation.
Determine the next unfinished task.
Implement only that task.
Update TASKS.md and CHANGELOG.md.
Summarize changes.

⸻

14. Working with Epics

Every feature belongs to one Epic.

Example

Epic 004
Program Explorer

Claude should not work outside the current Epic unless instructed.

⸻

15. Testing

Run

npm test

Run E2E

npm run test:e2e

Run lint

npm run lint

⸻

16. Debugging

Frontend

Use

* React DevTools
* Browser DevTools

Backend

Use

* NestJS Logger
* VS Code Debugger

Database

Use

* pgAdmin
* psql

⸻

17. Documentation Rules

Every feature must update

* CHANGELOG.md
* TASKS.md

Update if necessary

* SRS
* Architecture
* Database
* API
* UIUX

⸻

18. Pull Requests

Every PR should include

* Summary
* Related Epic
* Related Issue
* Testing performed
* Documentation updates

⸻

19. Release Process

Feature Complete
↓
Testing
↓
Review
↓
Merge develop
↓
Release Branch
↓
Production

⸻

20. Troubleshooting

Frontend

rm -rf node_modules
npm install

⸻

Backend

Verify

DATABASE_URL

⸻

Docker

docker compose logs

⸻

Database

docker compose ps

⸻

21. Developer Checklist

Before committing

* Code builds
* Tests pass
* Lint passes
* Documentation updated
* TASKS.md updated
* CHANGELOG.md updated
* No secrets committed

⸻

22. References

* docs/01-SRS.md
* docs/02-Architecture.md
* docs/03-Database.md
* docs/04-API.md
* docs/05-UIUX.md
* docs/06-CodingStandards.md
* docs/07-TestingStrategy.md
* docs/08-DeploymentGuide.md
* docs/09-CatalogDataModel.md
* management/CLAUDE.md
* management/PROJECT_ROADMAP.md
* management/TASKS.md
* management/CHANGELOG.md
* management/DEVELOPMENT_WORKFLOW.md
* epics/001-foundation.md through epics/009-deployment.md

⸻

Definition of Done

A feature is considered complete only when:

* Requirements are implemented.
* Tests pass.
* Code review is complete.
* Documentation is updated.
* TASKS.md and CHANGELOG.md are updated.
* The implementation aligns with the current Epic and project architecture.
