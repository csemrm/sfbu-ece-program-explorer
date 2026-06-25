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

Returns all knowledge areas.

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