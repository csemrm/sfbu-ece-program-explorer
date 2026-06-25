

# Epic 003 – Backend API

## 1. Overview
The backend provides catalog data services for both the public-facing application and the admin interface. It exposes APIs for catalog browsing, program and course data, requirement groups, and related academic structures. **No student information or personally identifiable data is handled by this backend.**

## 2. Objective
Design and implement a robust, maintainable, and secure backend API to serve program, course, and catalog data, supporting both public and admin-facing clients.

## 3. Scope
- Expose RESTful APIs for catalog data (programs, courses, requirements, knowledge areas, catalog years)
- Provide search functionality for catalog data
- Support catalog import and admin management endpoints
- Ensure validation, documentation, and error handling

## 4. Out of Scope
- Authentication/authorization beyond basic admin endpoints
- Student records, enrollment, advising, or any SIS (Student Information System) integration
- Business logic for degree progress or advising
- Frontend application development

## 5. Architecture
- **NestJS Layered Architecture:**
  - **Controllers:** Handle HTTP requests and responses
  - **Services:** Business logic and orchestration
  - **Repositories:** Database access abstraction (via Prisma or TypeORM)
  - **DTOs:** Data Transfer Objects for input/output validation and typing
  - **Entities:** Database models
  - **Validation:** Use `class-validator` for request validation
  - **Exception Filters:** Consistent error handling

## 6. Technology Stack
- **Framework:** NestJS (Node.js, TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma or TypeORM
- **API Docs:** Swagger/OpenAPI (auto-generated)
- **Validation:** class-validator, class-transformer
- **Testing:** Jest (unit/integration)

## 7. Backend Modules
- **Health:** Service health check endpoint
- **Programs:** CRUD and read endpoints for academic programs
- **Courses:** CRUD and read endpoints for courses
- **Requirement Groups:** Groupings of requirements (e.g., core, electives)
- **Knowledge Areas:** Areas of study or specialization tags
- **Catalog Years:** Academic years for which programs/courses are valid
- **Search:** Full-text and filtered search across catalog data
- **Catalog Import:** Admin endpoint to import catalog data (CSV, JSON, etc.)
- **Admin:** Admin-only endpoints for catalog management

## 8. API Design Principles
- RESTful resource-oriented endpoints
- Versioned API paths (e.g., `/api/v1/`)
- JSON responses
- Pagination and filtering for list endpoints
- Input validation and clear error messages
- Consistent error response structure

## 9. Required Endpoints (by Module)
**Health**
- `GET /api/v1/health` – Health check

**Programs**
- `GET /api/v1/programs` – List programs
- `GET /api/v1/programs/:id` – Get program by ID
- `GET /api/v1/programs/:id/requirements` – Get requirements for a program

**Courses**
- `GET /api/v1/courses` – List courses
- `GET /api/v1/courses/:id` – Get course by ID
- `GET /api/v1/courses/:id/prerequisites` – Get course prerequisites

**Requirement Groups**
- `GET /api/v1/requirement-groups` – List requirement groups
- `GET /api/v1/requirement-groups/:id` – Get group by ID

**Knowledge Areas**
- `GET /api/v1/knowledge-areas` – List knowledge areas
- `GET /api/v1/knowledge-areas/:id` – Get knowledge area by ID

**Catalog Years**
- `GET /api/v1/catalog-years` – List catalog years
- `GET /api/v1/catalog-years/:id` – Get catalog year by ID

**Search**
- `GET /api/v1/search` – Search programs/courses (by keyword, filters)

**Catalog Import (Admin)**
- `POST /api/v1/admin/catalog-import` – Import catalog data (admin only)

**Admin**
- `GET /api/v1/admin/programs` – List/manage programs (admin)
- `POST /api/v1/admin/programs` – Create program
- `PUT /api/v1/admin/programs/:id` – Update program
- `DELETE /api/v1/admin/programs/:id` – Delete program
(Similar endpoints for courses, requirement groups, etc.)

## 10. Functional Requirements
- Expose read-only APIs for catalog data to the public
- Provide admin endpoints for catalog management (CRUD)
- Support catalog data import via admin endpoint
- Input validation for all endpoints
- Pagination/filtering for list endpoints
- Full API documentation (Swagger)
- Consistent error handling and status codes

## 11. Non-Functional Requirements
- Secure admin endpoints (basic authentication or API key)
- High test coverage (unit/integration)
- Scalable and maintainable codebase
- API versioning support
- Proper logging and error reporting
- Performance: List endpoints paginated, efficient queries

## 12. Tasks
- [ ] Project setup (NestJS, TypeScript, PostgreSQL, ORM)
- [ ] Define database schema (entities/models)
- [ ] Implement Health module
- [ ] Implement Programs module (CRUD, DTOs, validation)
- [ ] Implement Courses module (CRUD, DTOs, validation)
- [ ] Implement Requirement Groups module
- [ ] Implement Knowledge Areas module
- [ ] Implement Catalog Years module
- [ ] Implement Search module
- [ ] Implement Catalog Import (admin) module
- [ ] Implement Admin endpoints (CRUD for all entities)
- [ ] Implement input validation (class-validator)
- [ ] Implement exception filters and error handling
- [ ] Implement API versioning
- [ ] Add Swagger/OpenAPI documentation
- [ ] Add pagination and filtering to list endpoints
- [ ] Add logging (NestJS logger)
- [ ] Write unit and integration tests
- [ ] Document API usage and data models
- [ ] Update TASKS.md and CHANGELOG.md

## 13. Acceptance Criteria
- All required endpoints implemented and passing tests
- Admin endpoints protected from public access
- API validation, error handling, and documentation complete
- All modules integrated and functional
- TASKS.md and CHANGELOG.md updated
- Code reviewed and merged to main branch

## 14. Definition of Done
- All functional and non-functional requirements met
- All tasks checked off
- Code passes CI/CD checks and tests
- Documentation and API docs complete
- Project ready for Epic 004 (frontend integration)

## 15. AI Execution Instructions
- Implement only backend APIs and modules as described above
- Do not make frontend changes unless strictly necessary for backend integration
- Do not handle or expose any student data or records
- Update TASKS.md and CHANGELOG.md with each implemented feature/module
- After each module, provide a summary of what was created/changed
- When all tasks are complete, recommend proceeding to Epic 004 (Frontend Integration)