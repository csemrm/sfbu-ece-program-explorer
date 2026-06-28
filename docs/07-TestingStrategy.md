SFBU ECE Program Explorer

Testing Strategy

Version: 1.0
Status: Draft

⸻

Revision History

Version	Date	Author	Description
1.0	2026-06-24	Project Team	Initial Testing Strategy

⸻

Table of Contents

1. Purpose
2. Testing Objectives
3. Scope
4. Testing Strategy
5. Test Pyramid
6. Test Levels
7. Test Types
8. Test Environments
9. Test Data Strategy
10. CI/CD Testing Pipeline
11. Defect Management
12. Entry & Exit Criteria
13. Test Deliverables
14. Definition of Done
15. References

⸻

1. Purpose

This document defines the testing strategy for the SFBU ECE Program Explorer.

It establishes the processes, tools, responsibilities, and quality criteria used to verify that the application meets the requirements defined in the SRS.

⸻

2. Testing Objectives

The testing process aims to:

* Verify functional requirements
* Validate user workflows
* Prevent regressions
* Ensure system stability
* Verify accessibility
* Ensure responsive behavior
* Verify API correctness
* Improve maintainability

⸻

3. Scope

Included

* Frontend
* Backend
* Database
* REST API
* Authentication
* Admin Dashboard
* Curriculum Roadmap
* Course Explorer
* Program Explorer
* Prerequisite Graph

Excluded

* Student Information System (SIS)
* Student records
* Enrollment
* Degree audit
* External university systems

⸻

4. Testing Strategy

Testing follows a layered approach.

Unit Tests
      ↓
Integration Tests
      ↓
API Tests
      ↓
Component Tests
      ↓
End-to-End Tests
      ↓
User Acceptance Testing

Testing begins as soon as development starts.

⸻

5. Test Pyramid

            ▲
          E2E Tests
      Integration Tests
         Unit Tests

Recommended distribution

Test Type	Percentage
Unit	70%
Integration	20%
End-to-End	10%

⸻

6. Test Levels

Unit Testing

Purpose

Verify individual functions.

Examples

* utility functions
* services
* React hooks

Tools

* Jest
* Vitest

⸻

Integration Testing

Purpose

Verify interaction between components.

Examples

* Frontend ↔ API
* Backend ↔ Database

⸻

API Testing

Verify

* endpoints
* validation
* pagination
* filtering
* authorization

Tools

* Supertest
* Postman

⸻

Component Testing

React components

Examples

* ProgramCard
* CourseCard
* SearchBar
* GraphCanvas

Tools

* React Testing Library

⸻

End-to-End Testing

Simulate real users.

Example

Home
↓
Programs
↓
Program Detail
↓
Course Explorer
↓
Prerequisite Graph

Tool

* Playwright

⸻

User Acceptance Testing

Performed by

* Faculty
* Advisors
* Students

Verify

* usability
* correctness
* accessibility

⸻

7. Test Types

Functional Testing

Verify

* Features
* Business rules

⸻

Regression Testing

Run automatically before every release.

⸻

Accessibility Testing

Verify

* WCAG 2.1 AA
* Keyboard navigation
* Screen readers
* Focus order

Tools

* Axe
* Lighthouse

⸻

Performance Testing

Measure

* page load
* API latency
* graph rendering

Targets

Metric	Target
Page Load	<2 seconds
API	<500 ms
Search	<1 second

Tools

* Lighthouse
* k6

⸻

Security Testing

Verify

* Authentication
* Authorization
* SQL Injection
* XSS
* CSRF
* Rate Limiting

Tools

* OWASP ZAP

⸻

Compatibility Testing

Browsers

* Chrome
* Firefox
* Safari
* Edge

Devices

* Desktop
* Tablet
* Mobile

⸻

8. Test Environments

Environment	Purpose
Local	Developer testing
Development	Feature integration
Testing	QA validation
Staging	Pre-production
Production	Live monitoring

⸻

9. Test Data Strategy

Use

* Seed scripts
* Catalog samples
* Mock APIs

Never use

* Student data
* Real grades
* Personal information

⸻

10. CI/CD Testing Pipeline

Every Pull Request

Commit
↓
ESLint
↓
Prettier
↓
Unit Tests
↓
Integration Tests
↓
API Tests
↓
Build
↓
E2E Tests
↓
Deploy

Deployment stops if any required test fails.

⸻

11. Defect Management

Severity

Level	Description
Critical	System unusable
High	Major feature broken
Medium	Feature partially works
Low	Cosmetic issue

Priority

* P1
* P2
* P3
* P4

⸻

12. Entry Criteria

Testing begins when

* Code compiles
* Build succeeds
* Feature implemented
* Unit tests written

⸻

13. Exit Criteria

Testing ends when

* All planned tests pass
* Critical defects = 0
* High defects = 0
* Coverage target achieved
* Documentation updated

⸻

14. Code Coverage Targets

Layer	Target
Backend	90%
Frontend	85%
Services	95%
Utilities	95%

⸻

15. Test Deliverables

* Test Plan
* Test Cases
* Automated Test Scripts
* Test Reports
* Coverage Report
* Performance Report
* Accessibility Report
* Security Report

⸻

16. Test Automation Matrix

Test Type	Automated
Unit	Yes
Integration	Yes
API	Yes
Component	Yes
E2E	Yes
Accessibility	Yes
Performance	Yes
Security	Partial

⸻

17. Definition of Done

A feature is complete only if:

* Functional requirements are satisfied.
* Unit tests pass.
* Integration tests pass.
* API tests pass.
* E2E tests pass.
* Accessibility requirements are met.
* No critical or high-severity defects remain.
* Documentation is updated.
* Code review is approved.

⸻

18. References

* docs/SRS.md
* docs/02-Architecture.md
* docs/03-Database.md
* docs/04-API.md
* docs/05-UIUX.md
* docs/06-CodingStandards.md
* epics/001-foundation.md
* epics/002-database.md
* epics/003-backend.md
* epics/004-program-explorer.md
* epics/005-course-explorer.md
* epics/006-roadmap.md
* epics/007-prerequisite-graph.md
* epics/008-admin.md
* epics/009-deployment.md