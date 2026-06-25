

# Epic 008 – Administration Dashboard

## 1. Overview

Design and implement an internal administration portal for securely managing and maintaining the academic catalog content that powers the public-facing Program Explorer. This dashboard enables authorized staff to update programs, courses, requirements, and related metadata.

## 2. Objective

Provide a robust, user-friendly, and secure admin interface for catalog management, supporting efficient workflows for curriculum and content administrators.

## 3. Scope

- Admin authentication and access control
- CRUD (Create, Read, Update, Delete) for programs, courses, requirement groups, and knowledge areas
- Catalog year and version management
- Prerequisite/corequisite editing
- Catalog import tools
- Preview and publish workflow
- Audit logging of administrative actions

## 4. Out of Scope

- Student management
- SIS (Student Information System) integration
- Enrollment, grading, or advising functions
- Public-facing catalog browsing

## 5. User Roles

| Role                  | Description                                           | Permissions                                                                 |
|-----------------------|-------------------------------------------------------|-----------------------------------------------------------------------------|
| System Administrator  | IT or platform owner                                  | Full access to all features; manage users and roles                         |
| Curriculum Administrator | Academic/curriculum staff                         | Manage programs, courses, requirements, knowledge areas, catalog import     |
| Content Editor        | Staff responsible for content accuracy                | Edit course/program descriptions and metadata; cannot publish or import      |

### Permissions Breakdown
- **System Administrator**: All permissions, including user/role management and audit log access.
- **Curriculum Administrator**: All catalog content management, import, preview, and publish.
- **Content Editor**: Edit content, submit for review; cannot publish or manage users.

## 6. Functional Requirements

- **Secure Admin Authentication**
  - Login required for all admin actions
  - RBAC (Role-Based Access Control) enforcement

- **Dashboard**
  - Overview cards: # of programs, courses, pending changes, recent activity

- **Program Management**
  - List, search, filter, create, edit, archive programs
  - Assign requirement groups and knowledge areas

- **Course Management**
  - List, search, filter, create, edit, archive courses
  - Edit course details, prerequisites, corequisites

- **Requirement Group Management**
  - CRUD for requirement groups (e.g., core, elective, capstone)
  - Assign courses to groups

- **Knowledge Area Management**
  - CRUD for knowledge areas/tags
  - Assign to courses/programs

- **Prerequisite/Corequisite Editor**
  - Visual editor for managing course dependencies

- **Catalog Year Management**
  - View/manage catalog years and draft/published states
  - Set active year

- **Catalog Import**
  - Import from CSV/JSON or SIS export
  - Preview and validate before applying

- **Preview Unpublished Changes**
  - View changes in a "staging" mode before publishing

- **Publish Workflow**
  - Submit changes for review (if approval workflow enabled)
  - Publish to make changes live
  - Confirmation dialogs

- **Audit Log**
  - View/filter log of all admin actions with timestamps and user info

## 7. UI/UX Requirements

- Responsive admin layout (desktop, tablet, mobile)
- Consistent navigation (sidebar, breadcrumbs)
- Data tables with sorting, filtering, pagination
- Forms with validation and error handling
- Confirmation dialogs for destructive actions
- Accessible (WCAG 2.1 AA compliance)
- Clear feedback for success/error states

## 8. Suggested Navigation Structure

- Dashboard
- Programs
- Courses
- Requirement Groups
- Knowledge Areas
- Catalog Years
- Import Catalog
- Audit Log (System Admin only)
- User Management (System Admin only)
- [Profile, Logout]

## 9. Components

- `AdminLayout`: Main admin shell, navigation, user context
- `DashboardCards`: Overview stats and quick links
- `DataTable`: Reusable table with sorting/filtering/pagination
- `CourseForm`: Create/edit course details
- `ProgramForm`: Create/edit program details
- `RequirementEditor`: Assign/manage requirement groups and dependencies
- `CatalogImportWizard`: Step-by-step import tool
- `AuditLogTable`: Filterable log view
- `PublishDialog`: Confirm/preview publish actions

## 10. Backend API Dependencies

Example admin endpoints:
```http
POST   /api/admin/login
GET    /api/admin/programs
POST   /api/admin/programs
PUT    /api/admin/programs/:id
DELETE /api/admin/programs/:id
GET    /api/admin/courses
POST   /api/admin/courses
PUT    /api/admin/courses/:id
DELETE /api/admin/courses/:id
GET    /api/admin/requirement-groups
POST   /api/admin/requirement-groups
...
GET    /api/admin/catalog-years
POST   /api/admin/catalog-import
GET    /api/admin/audit-log
POST   /api/admin/publish
```
All endpoints require admin authentication and enforce RBAC.

## 11. Security Requirements

- Enforce RBAC for all admin actions
- Use HTTPS for all admin endpoints
- Input validation and sanitization (prevent XSS, SQLi, etc.)
- Audit log for all content changes and user activity
- Session timeout and logout

## 12. Tasks

```markdown
- [ ] Design AdminLayout and navigation
- [ ] Implement secure admin authentication (login, logout, session)
- [ ] Implement RBAC and permissions checks
- [ ] Create DashboardCards component
- [ ] Implement DataTable for programs, courses, requirement groups, knowledge areas
- [ ] Build ProgramForm and CRUD logic
- [ ] Build CourseForm and CRUD logic
- [ ] Build RequirementEditor for requirement groups and dependencies
- [ ] Build KnowledgeArea management UI
- [ ] Implement CatalogYear management
- [ ] Implement CatalogImportWizard with preview/validation
- [ ] Implement preview unpublished changes mode
- [ ] Implement PublishDialog and workflow
- [ ] Implement AuditLogTable with filtering
- [ ] Add confirmation dialogs for destructive actions
- [ ] Ensure form validation and error handling
- [ ] Implement accessibility features
- [ ] Write backend API endpoints for all admin features
- [ ] Integrate frontend with backend admin APIs
- [ ] Add automated tests (unit, integration, e2e)
- [ ] Update documentation (TASKS.md, CHANGELOG.md)
```

## 13. Acceptance Criteria

- Only authenticated admin users can access the admin dashboard
- RBAC permissions are strictly enforced
- Admins can manage programs, courses, requirements, knowledge areas, and catalog years
- Admins can import catalog data and preview changes before publishing
- All content changes are logged in the audit log
- The admin UI is responsive and accessible
- All destructive actions require confirmation
- No admin features leak into the public UI

## 14. Definition of Done

- All functional and UI/UX requirements are met
- All tasks in the checklist are complete
- Automated tests pass
- Documentation is updated
- Security requirements are verified
- Admin dashboard is deployed and accessible only to authorized users

## 15. Future Enhancements

- Bulk editing of courses/programs
- Approval workflow for publishing changes
- Version diff and rollback for catalog content
- Integration with external SIS for data import/export
- Customizable dashboard widgets

## 16. AI Execution Instructions

- Implement **only** the requirements specified in this Epic for the admin dashboard.
- Reuse or extend existing components where possible.
- Keep the admin dashboard **completely separate** from the public-facing Program Explorer UI.
- Update `TASKS.md` and `CHANGELOG.md` to reflect all changes made.
- Summarize all changes in the next pull request.
- After completing this Epic, recommend starting **Epic 009 – Deployment**.