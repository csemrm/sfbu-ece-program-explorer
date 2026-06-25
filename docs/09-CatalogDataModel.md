SFBU ECE Program Explorer

Academic Catalog Data Model

Version: 1.0
Status: Draft

⸻

Revision History

Version	Date	Author	Description
1.0	2026-06-24	Project Team	Initial Academic Data Model

⸻

Table of Contents

1. Purpose
2. Scope
3. Academic Domain Overview
4. Academic Hierarchy
5. Program Model
6. Catalog Year Model
7. Requirement Model
8. Course Model
9. Knowledge Area Model
10. Curriculum Roadmap Model
11. Prerequisite Model
12. Course Relationship Model
13. Catalog Import Model
14. Business Rules
15. Catalog Versioning
16. Academic Workflows
17. Future Extensions
18. References

⸻

1. Purpose

This document defines the academic data model used by the SFBU ECE Program Explorer.

Unlike the Database Design document, this document describes the academic concepts and relationships that exist within the university catalog.

It acts as the bridge between:

* University Catalog
* Database Design
* API
* UI
* Business Rules

⸻

2. Scope

The model covers

* Academic Programs
* Catalog Years
* Courses
* Requirement Groups
* Knowledge Areas
* Curriculum Roadmaps
* Course Relationships

This document does not include

* Students
* Enrollment
* Grades
* GPA
* Degree Audit
* Financial Information

⸻

3. Academic Domain Overview

University
↓
College
↓
Department
↓
Program
↓
Catalog Year
↓
Requirement Groups
↓
Courses
↓
Knowledge Areas
↓
Prerequisite Network

⸻

4. Academic Hierarchy

San Francisco Bay University
↓
School of Engineering
↓
Electrical & Computer Engineering Department
↓
Programs
    BSCS
    MSCS
    MSEE
↓
Catalog Year
↓
Requirements
↓
Courses

⸻

5. Program Model

A Program represents a complete degree.

Examples

* BSCS
* MSCS
* MSEE

Each program contains

* name
* degree level
* total credits
* description
* learning outcomes
* curriculum
* catalog years

Example

Program
↓
BSCS
↓
120 Credits
↓
Core
↓
Electives
↓
Capstone

⸻

6. Catalog Year Model

Programs evolve over time.

Each catalog year represents an immutable academic definition.

Example

BSCS
├── 2024-2025
├── 2025-2026
└── 2026-2027

Each catalog contains

* courses
* requirements
* prerequisite rules

⸻

7. Requirement Model

Requirements are grouped.

Examples

Core
Foundation
Engineering
Electives
Capstone

Requirement Group

↓

contains

↓

Courses

Each requirement has

* minimum credits
* required courses
* optional courses

⸻

8. Course Model

Each course contains

Attribute	Description
Course Code	CS201
Title	Data Structures
Description	Catalog description
Credits	3
Catalog Year	2025
Requirement Group	Core
Knowledge Areas	Programming

⸻

9. Knowledge Area Model

Knowledge Areas classify courses.

Examples

BSCS

* Programming
* Software Engineering
* Databases
* AI
* Networks
* Cybersecurity

MSCS

* Machine Learning
* Data Science
* Distributed Systems

MSEE

* Embedded Systems
* Computer Architecture
* Digital Design
* IoT
* IC Technologies

A course may belong to multiple knowledge areas.

⸻

10. Curriculum Roadmap Model

The roadmap represents the recommended sequence.

Example

Semester 1
↓
Semester 2
↓
Semester 3
↓
Semester 4
↓
Capstone

Each semester contains

* recommended courses
* total credits
* requirement coverage

⸻

11. Prerequisite Model

Prerequisites create dependency chains.

Example

CS101
↓
CS201
↓
CS301
↓
CS401

Relationship types

* prerequisite
* corequisite

⸻

12. Course Relationship Model

Relationships

Course
↓
Prerequisite
↓
Corequisite
↓
Related Course
↓
Knowledge Area

One course can

* require multiple courses
* belong to multiple requirement groups
* belong to multiple knowledge areas

⸻

13. Catalog Import Model

Catalog data enters the system through an import pipeline.

University Catalog PDF
↓
Parser
↓
Validation
↓
Transformation
↓
Catalog Model
↓
Database

Import stages

1. Extract
2. Validate
3. Normalize
4. Map
5. Save

⸻

14. Business Rules

Rule 1

Every course belongs to one catalog year.

⸻

Rule 2

Programs may have multiple catalog years.

⸻

Rule 3

Courses may belong to multiple knowledge areas.

⸻

Rule 4

Requirement Groups belong to one program.

⸻

Rule 5

Prerequisites reference other courses.

⸻

Rule 6

Catalogs are immutable once published.

⸻

Rule 7

A course code must be unique within a catalog year.

⸻

Rule 8

Course relationships cannot be circular.

⸻

15. Catalog Versioning

Each year is stored independently.

2024
↓
Published
↓
Read Only

Updates

2025
↓
Draft
↓
Review
↓
Published

No published catalog is overwritten.

⸻

16. Academic Workflows

New Catalog

Import
↓
Review
↓
Validation
↓
Approval
↓
Publish

⸻

Course Update

Edit
↓
Preview
↓
Approve
↓
Publish

⸻

New Program

Create
↓
Add Requirements
↓
Add Courses
↓
Review
↓
Publish

⸻

17. Future Extensions

Future versions may support

* Minors
* Certificates
* Concentrations
* Research Tracks
* Dual Degrees
* Cross-listed Courses
* Course Equivalencies
* Transfer Credit Mapping

⸻

18. References

* docs/SRS.md
* docs/02-Architecture.md
* docs/03-Database.md
* docs/04-API.md
* docs/05-UIUX.md
* docs/07-TestingStrategy.md
* epics/001-foundation.md
* epics/002-database.md
* epics/003-backend-api.md

⸻

Appendix A — Academic Entity Relationship

Program
│
├── Catalog Years
│
├── Requirement Groups
│       │
│       ├── Courses
│       │      │
│       │      ├── Knowledge Areas
│       │      ├── Prerequisites
│       │      └── Corequisites
│
└── Curriculum Roadmap

⸻

Appendix B — Conceptual Lifecycle

Catalog PDF
↓
Academic Data Model
↓
Database
↓
REST API
↓
Frontend
↓
Student Visualization