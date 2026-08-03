SFBU ECE Program Explorer

API Design Specification

Version: 1.0
Status: Draft

⸻

Revision History

Version	Date	Author	Description
1.0	2026-06-24	Project Team	Initial API Specification

⸻

1. Purpose

This document defines the REST API for the SFBU ECE Program Explorer.

The API provides structured access to academic catalog information used by the public web application and the Administration Dashboard.

The API does not provide:

* Student records
* Enrollment
* Grades
* Degree audit
* Registration
* Student Information System (SIS) functionality

⸻

2. API Principles

The API follows these principles:

* RESTful
* JSON
* Stateless
* Versioned
* Secure
* Documented using OpenAPI
* Consistent error responses
* Pagination support
* Filtering support

⸻

3. Base URL

Development

http://localhost:3001/api/v1

Production

https://api.sfbu.edu/program-explorer/v1

⸻

4. Authentication

Public Endpoints

No authentication required.

Examples

* Program Explorer
* Course Explorer
* Curriculum Roadmap
* Prerequisite Graph

⸻

Administrator Endpoints

Authentication required.

Recommended

* JWT
* OAuth2
* Session Cookie

Role Based Access Control

Roles

* System Administrator
* Curriculum Administrator
* Content Editor

⸻

5. Response Format

Successful response

{
  "success": true,
  "data": {},
  "message": null
}

Error response

{
  "success": false,
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Course not found."
  }
}

⸻

6. HTTP Status Codes

Code	Meaning
200	OK
201	Created
204	No Content
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
409	Conflict
422	Validation Error
500	Internal Server Error

⸻

7. Public API

Programs

GET /programs

Returns all academic programs.

Supports

* filtering
* sorting
* pagination

⸻

GET /programs/{id}

Returns one program.

⸻

GET /programs/{id}/requirements

Returns requirement groups.

⸻

GET /programs/{id}/roadmap

Returns curriculum roadmap.

⸻

GET /programs/{id}/graph

Returns prerequisite graph.

⸻

Courses

GET /courses

Returns course catalog.

Supports

* search
* pagination
* filters

⸻

GET /courses/{id}

Returns detailed course.

⸻

GET /courses/{id}/dependencies

Returns

* prerequisites
* corequisites

⸻

GET /courses/{id}/related

Returns related courses.

⸻

Requirement Groups

GET /requirement-groups

Returns all requirement groups.

⸻

Knowledge Areas

GET /knowledge-areas

Returns a paginated list of knowledge areas. Each entry carries course counts
derived from the course_knowledge_areas join.

Response fields per area

* id
* name
* description
* courseCount
* undergraduateCount
* graduateCount

⸻

GET /knowledge-areas/{id}

Returns a single knowledge area with the courses assigned to it, ordered by
course code. Adds a courses array to the fields above:

* id
* courseCode
* title
* creditHours (number)
* level
* description

Returns 404 when the area does not exist.

⸻

GET /programs/{id}/knowledge-areas

Returns the knowledge-area distribution for a program's latest catalog year,
sorted by course count descending.

* programId, programName, programAbbreviation
* academicYear
* totalCourses — distinct courses reachable from the program's requirement groups
* knowledgeAreas[] — id, name, description, courseCount, percentage

Percentage is courseCount / totalCourses. All specialization tracks are
included, so this reports the subject breadth a program offers, not the areas
a single student's plan will span.

⸻

Catalog Years

GET /catalog-years

Returns available catalog years.

⸻

Search

GET /search

Supports

* keyword
* program
* catalog year
* requirement group
* knowledge area

Example

GET /search?q=machine learning

⸻

Semester Planner

POST /planner/evaluate

Stateless prerequisite-eligibility check for a multi-term registration plan. Nothing is persisted — the request carries the full plan and the response is computed on demand.

Request body

```json
{
  "completedCourseIds": ["<uuid>", "..."],
  "terms": [
    { "termId": "<uuid>", "courseIds": ["<uuid>", "..."] },
    { "courseIds": ["<uuid>"] }
  ]
}
```

* completedCourseIds — courses already finished before the plan begins.
* terms — ordered list of planned semesters; each earlier term counts as completed for later terms.
* terms[].termId — optional. Binds the slot to an academic term (see GET /terms), which additionally checks each course against that term's curated offerings. Omit it to keep the slot offering-agnostic.

Response

For each term, every course is returned with:

* eligible — true when all prerequisites are satisfied and no corequisite is unmet. Deliberately independent of availability.
* offered — true/false when the term is bound to an academic term, null when it is not.
* registrable — eligible && offered !== false; what a student can actually sign up for.
* satisfiedPrerequisites / missingPrerequisites — the latter flags plannedInLaterTerm when a prerequisite is scheduled too late (an ordering conflict).
* corequisites — each with status of completed, same-term, or unmet.
* reason — a human-readable explanation of the verdict, covering both the prerequisite and availability outcomes.

Each term also echoes termId and termName (both null when unbound).

The response also includes suggestions, totalPlannedCredits, allEligible, and allOffered (vacuously true when no term is bound). Suggestions carry offeredInTerms — the bound terms in the plan that actually offer the course — and are ranked so offerable ones come first.

Separating eligible from offered is intentional: "you are not ready for this course" and "the university is not running it" are different problems with different fixes, and collapsing them into one flag would misreport both.

Returns 400 when any course ID or academic term ID does not exist.

⸻

Academic Terms

GET /terms

Public, read-only view of the academic terms and course offerings curated through the admin offerings tool. Exposed separately from /admin/offerings so the planner can read availability without a JWT.

Returns an array (not paginated) ordered by sortOrder, each entry with id, name, sortOrder, courseCount, and offeredCourseIds.

GET /terms/:id

One term with its offered courses (id, courseCode, title, creditHours, level), ordered by course code. Returns 404 when the term does not exist.

⸻

8. Administration API

Base URL

/api/v1/admin

⸻

Programs

GET

POST

PUT

DELETE

⸻

Courses

GET

POST

PUT

DELETE

⸻

Requirement Groups

GET

POST

PUT

DELETE

⸻

Knowledge Areas

GET

POST

PUT

DELETE

⸻

Catalog Years

GET

POST

PUT

DELETE

⸻

Course Offerings

Admin-curated record of which courses are offered in each academic term. Powers the admin two-column offerings tool (this semester vs. next semester) with prerequisite-eligibility checks.

GET /admin/offerings/terms — list academic terms (ordered by sortOrder)

POST /admin/offerings/terms — create a term { name, sortOrder? }

DELETE /admin/offerings/terms/:id — delete a term (cascades its offerings)

GET /admin/offerings?termId= — list courses offered in a term (with course details)

POST /admin/offerings — add an offering { termId, courseId } (409 if already offered)

DELETE /admin/offerings/:id — remove an offering

Eligibility for a next-semester course reuses POST /planner/evaluate with terms [thisSemesterOfferings, nextSemesterOfferings]: a right-column course is eligible when its prerequisites are covered by the left (this-semester) column. All routes require a valid admin JWT.

⸻

Catalog Import

POST

POST /admin/catalog-import

⸻

Publish

POST

POST /admin/publish

⸻

Audit Log

GET

GET /admin/audit-log

⸻

9. Pagination

Example

GET /courses?page=2&pageSize=25

Response

{
  "page": 2,
  "pageSize": 25,
  "totalItems": 210,
  "totalPages": 9,
  "data": []
}

⸻

10. Filtering

Supported filters

* Program
* Catalog Year
* Credits
* Requirement Group
* Knowledge Area

⸻

11. Sorting

Supported

* Course Code
* Title
* Credits
* Program
* Catalog Year

⸻

12. OpenAPI

The API shall expose OpenAPI documentation.

/api/docs

Swagger UI shall be enabled in

* Development
* Staging

Disabled in Production unless explicitly enabled.

⸻

13. Rate Limiting

Public API

100 requests/minute

Admin API

Role dependent

⸻

14. Security

* HTTPS only
* JWT authentication
* RBAC
* Input validation
* Output sanitization
* CORS
* Audit logging

⸻

15. Future APIs

Version 2 may include

* AI explanations
* Catalog comparison
* Graph analytics
* Curriculum recommendation
* Export APIs
* GraphQL endpoint

⸻

16. References

* SRS.md
* 02-Architecture.md
* 03-Database.md
* 05-UIUX.md
* Epic 003 – Backend API
* Epic 004 – Program Explorer
* Epic 005 – Course Explorer
* Epic 006 – Curriculum Roadmap
* Epic 007 – Prerequisite Graph
* Epic 008 – Administration Dashboard

This API specification is consistent with the rest of your documentation and is suitable as the authoritative API design document for the project.
---

## Planner — degree scoping and registration status

`POST /planner/evaluate` accepts an optional `programId`.

When supplied, an unmet prerequisite belonging to a **different** degree is
returned in `backgroundPrerequisites` instead of `missingPrerequisites`, and does
not affect `eligible`. Every graduate programme states its own background
preparation, cleared before admission, so blocking an MSCS student on an
undergraduate BSCS course would enforce a requirement the university does not
make of them.

A program with no course-bearing requirement rows is treated as "no scope" rather
than an empty one, so an unmodelled degree cannot silently excuse every
prerequisite in the catalog.

Each evaluated course also reports the offering's registration status:

| Field | Meaning |
| --- | --- |
| `offered` | The course runs in the bound term. Null when the term is unbound. |
| `openForRegistration` | The registrar has registration open. Distinct from `offered` — a cancelled course still appears on the schedule. |
| `sectionCount` | Sections on the published schedule, or null. |
| `statusNote` | The registrar's wording, verbatim (e.g. "Cancelled due to low enrollment"). |
| `registrable` | `eligible && offered !== false && openForRegistration !== false`. |

## Terms — offerings for a program and semester

`GET /terms/:id` accepts an optional `programId`.

Each offered course reports `openForRegistration`, `sectionCount`, `statusNote`
and `inProgram`, plus `courseCount` (the whole term) and `inProgramCount`
alongside it.

The whole term is returned even when scoped, rather than the server filtering it
away: the planner shows "N of M offered courses are outside `<degree>`" with an
escape hatch to reveal them, and that needs both counts from one request. A
program with no course-bearing requirement rows is treated as "no scope", so an
unmodelled degree shows the whole term rather than an empty column.
