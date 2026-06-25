

# Epic 002 – Database Design

## Overview
The database is the foundation for the SFBU ECE Program Explorer application. It is designed to store and manage all catalog and program-related data, such as degree requirements, courses, knowledge areas, and catalog versions. The database does **not** store any student records or personally identifiable information; its sole purpose is to represent the university's official academic catalog and program requirements.

## Objective
Design, implement, and document a robust, maintainable, and query-efficient relational database to support the ECE Program Explorer’s catalog and program data needs.

## Scope
- Store all data required to represent ECE programs, requirements, courses, knowledge areas, and their relationships.
- Support multiple catalog years (versioned catalogs).
- Enable querying of requirements, prerequisites, and course relationships.
- Provide mechanisms for importing and updating catalog data.
- Serve as the authoritative source for the application’s catalog/program information.

## Out of Scope
- Student profiles, grades, transcripts, or enrollment data.
- Integration with the Student Information System (SIS).
- Any tables or data relating to users, authentication, or student records.

## Database Design Principles
- **Normalization:** Apply normalization (up to 3NF) to minimize redundancy and ensure consistency.
- **Referential Integrity:** Use foreign keys to maintain relationships between tables.
- **Catalog-Version Support:** All relevant data is associated with a specific catalog year/version.
- **Auditability:** Include timestamps for creation and updates on all core tables.

## Technology Stack
- **Database:** PostgreSQL (primary target)
- **ORM:** Prisma ORM **or** TypeORM (implementation option, to be finalized)
- **Migrations:** Use the ORM’s migration tool (Prisma Migrate, TypeORM migrations, or equivalent)

## Core Entities
- **Programs:** Academic programs (e.g., MS in ECE)
- **CatalogYears:** Distinct catalog versions (e.g., 2023–2024)
- **RequirementGroups:** Groupings of requirements within a program and catalog (e.g., Core, Electives)
- **Courses:** Individual course records with codes, titles, descriptions, units, etc.
- **KnowledgeAreas:** Areas of knowledge (e.g., Networking, Signal Processing) associated with courses.
- **CourseKnowledgeAreas:** Join table linking Courses to KnowledgeAreas (many-to-many).
- **Prerequisites:** Course-to-course prerequisite relationships.
- **Corequisites:** Course-to-course corequisite relationships.
- **CourseOfferings:** (Optional/future) Terms/semesters when courses are offered.
- **CatalogImports:** Metadata/log of catalog data imports.

## Relationship Summary
- Each **Program** is defined for one or more **CatalogYears**.
- Each **Program** in a **CatalogYear** has multiple **RequirementGroups**.
- **RequirementGroups** contain one or more **Courses** (directly or via a join table).
- **Courses** may belong to multiple **RequirementGroups** and **KnowledgeAreas**.
- **Courses** can have zero or more **Prerequisites** and/or **Corequisites** (self-referential relationships).
- **CourseKnowledgeAreas** links **Courses** to **KnowledgeAreas** (many-to-many).
- **CatalogImports** records each catalog data import event.

## Required Database Deliverables
- Entity-Relationship (ER) diagram
- SQL schema (DDL)
- ORM models (Prisma or TypeORM)
- Seed scripts with sample catalog data
- Initial catalog import mechanism and data

## Functional Requirements
- CRUD operations for all catalog/program data entities.
- Support for versioned catalogs and querying by catalog year.
- Ability to look up course prerequisites and corequisites.
- Search and filter support for courses, programs, and knowledge areas.
- Catalog import mechanism with audit trail.

## Non-Functional Requirements
- Appropriate indexing for efficient querying (especially on codes, names, and foreign keys).
- Scalable design to support additional programs or catalog years.
- Referential integrity enforced via constraints.
- Maintainable, well-documented schema and models.
- Regular backup and restore procedures documented.

## Tasks
- [ ] Design normalized schema (ER diagram, table definitions)
- [ ] Define all primary and foreign keys, constraints, and indexes
- [ ] Implement migrations for schema creation
- [ ] Create ORM models (Prisma or TypeORM)
- [ ] Develop and test seed scripts for initial data
- [ ] Implement catalog import scripts/process
- [ ] Add audit fields (created_at, updated_at) to all tables
- [ ] Validate referential integrity and 3NF normalization
- [ ] Document schema and relationships
- [ ] Test CRUD operations for all entities
- [ ] Generate and review ER diagram
- [ ] Update TASKS.md and CHANGELOG.md

## Acceptance Criteria
- Database schema supports all entities and relationships described above
- All tables have appropriate constraints and audit fields
- Can import and query catalog/program data for multiple catalog years
- Can look up course prerequisites, corequisites, and knowledge areas
- Migration and seed scripts run successfully on a clean database
- Documentation and ER diagram are complete and accurate

## Definition of Done
- All tasks above are completed and reviewed
- All functional and non-functional requirements are met
- No student-related tables or data are present
- TASKS.md and CHANGELOG.md are updated with schema and implementation notes
- AI execution instructions have been followed precisely

## AI Execution Instructions
- Implement **only** the scope described in this Epic.
- Keep the schema normalized (3NF where practical).
- Do **not** create any tables for students, users, grades, enrollment, or SIS integration.
- Update `TASKS.md` and `CHANGELOG.md` with progress and schema changes.
- Summarize schema changes and decisions in the documentation.
- After implementation, recommend the next Epic to tackle.