# SFBU ECE Program Explorer
**Version:** 1.0
**Document Status:** Draft

---

## Revision History

| Version | Date       | Author       | Description                      |
|---------|------------|--------------|---------------------------------|
| 1.0     | 2024-06-01 | Project Team | Initial draft of SRS document   |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Product Overview](#2-product-overview)
3. [Stakeholders and User Classes](#3-stakeholders-and-user-classes)
4. [System Overview](#4-system-overview)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-functional Requirements](#6-non-functional-requirements)
7. [System Constraints](#7-system-constraints)
8. [Assumptions](#8-assumptions)
9. [High-level Data Entities](#9-high-level-data-entities)
10. [External Interfaces](#10-external-interfaces)
11. [Future Enhancements](#11-future-enhancements)
12. [Acceptance Criteria](#12-acceptance-criteria)
13. [References](#13-references)

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the software requirements for the SFBU ECE Program Explorer. This system is designed to provide students, faculty, and administrators with an interactive platform to explore academic programs, courses, and curricula within the School of Engineering at San Francisco Bay University (SFBU).

### 1.2 Scope
The SFBU ECE Program Explorer will allow users to browse degree programs, course offerings, and curricular structures, including prerequisite relationships and curriculum roadmaps. It will support visualization and planning tools but will not handle student records or enrollment processes.

### 1.3 Intended Audience
- SFBU Students (undergraduate and graduate)
- Faculty and Academic Advisors
- Department Administrators
- Software Development and Maintenance Teams

### 1.4 Definitions and Acronyms

| Term    | Definition                                                |
|---------|-----------------------------------------------------------|
| SFBU    | San Francisco Bay University                              |
| BSCS    | Bachelor of Science in Computer Science                   |
| MSCS    | Master of Science in Computer Science                     |
| MSEE    | Master of Science in Electrical Engineering               |
| ECE     | Electrical and Computer Engineering                       |
| UI      | User Interface                                            |
| API     | Application Programming Interface                         |

---

## 2. Product Overview

### 2.1 Business Problem
Students and faculty at SFBU currently lack a centralized and interactive tool to explore academic programs and course dependencies, which hampers effective academic planning and advising.

### 2.2 Product Vision
To deliver an intuitive, web-based platform that empowers users to understand and navigate SFBU’s ECE academic offerings and curricular requirements efficiently.

### 2.3 Goals
- Provide comprehensive program and course information.
- Visualize prerequisite and corequisite relationships.
- Offer curriculum roadmaps for degree completion guidance.
- Enable administrative oversight through a dashboard interface.

### 2.4 Out-of-Scope Items
- Management of student records and personal data.
- Degree audits and official graduation eligibility checks.
- Enrollment and registration processes.
- Integration with Student Information Systems (SIS).

---

## 3. Stakeholders and User Classes

| Stakeholder           | Role/Interest                                      |
|----------------------|---------------------------------------------------|
| Students             | Explore programs, plan academic paths             |
| Faculty/Advisors     | Guide students, review curricular structures      |
| Department Admins    | Manage program and course data, monitor usage     |
| Development Team     | Build and maintain the system                      |

---

## 4. System Overview

The SFBU ECE Program Explorer is a web-based application comprising a user-friendly UI, a RESTful API backend, and a PostgreSQL database. It integrates program data, course catalogs, and curriculum mappings to provide interactive exploration and visualization tools.

---

## 5. Functional Requirements

### Program Explorer Module
- **FR-001:** The system shall display a list of all available academic programs.
- **FR-002:** The system shall provide detailed information for each program including degree requirements and catalog years.
- **FR-003:** The system shall allow filtering programs by degree type (BSCS, MSCS, MSEE).

### Course Explorer Module
- **FR-004:** The system shall display course details including descriptions, credits, and offered terms.
- **FR-005:** The system shall allow searching for courses by course code or keywords.
- **FR-006:** The system shall indicate prerequisite and corequisite requirements for each course.

### Curriculum Roadmap Module
- **FR-007:** The system shall generate a suggested semester-by-semester roadmap for degree completion.
- **FR-008:** The system shall allow users to customize the roadmap based on catalog year and course availability.

### Prerequisite Graph Module
- **FR-009:** The system shall visualize prerequisite and corequisite relationships as a directed graph.
- **FR-010:** The system shall allow users to interact with the graph to explore course dependencies.

### Administration Dashboard Module
- **FR-011:** The system shall provide administrators with tools to add, update, and remove programs and courses.
- **FR-012:** The system shall display usage statistics and system health metrics.
- **FR-013:** The system shall support role-based access control for administrative functions.

---

## 6. Non-functional Requirements

| ID       | Requirement                                                                                   |
|----------|-----------------------------------------------------------------------------------------------|
| NFR-001  | The system shall respond to user queries within 2 seconds under normal load.                  |
| NFR-002  | The system shall support at least 1000 concurrent users without degradation of performance.   |
| NFR-003  | The UI shall comply with WCAG 2.1 Level AA accessibility standards.                            |
| NFR-004  | The system shall be modular and maintainable with a documented codebase.                      |
| NFR-005  | All sensitive data shall be transmitted over secure channels (HTTPS).                         |
| NFR-006  | The UI shall be intuitive and require minimal training for first-time users.                  |
| NFR-007  | The system shall have 99.9% uptime excluding scheduled maintenance windows.                    |

---

## 7. System Constraints

- The system must use PostgreSQL as the primary data store.
- The web UI must be compatible with modern browsers (Chrome, Firefox, Edge, Safari).
- The API must adhere to RESTful principles and support JSON data format.
- The system must integrate with existing SFBU authentication services for user login.

---

## 8. Assumptions

- Accurate and up-to-date program and course data will be provided by SFBU academic departments.
- Users have access to internet-connected devices with modern browsers.
- Administrative users have appropriate permissions to manage program data.
- The system will be deployed on SFBU’s cloud infrastructure.

---

## 9. High-level Data Entities

| Entity             | Description                                                      |
|--------------------|------------------------------------------------------------------|
| Programs           | Academic degree programs including BSCS, MSCS, MSEE             |
| Courses            | Individual course offerings with metadata and descriptions      |
| Requirement Groups  | Logical groupings of course requirements within programs        |
| Knowledge Areas    | Thematic areas or domains associated with courses and programs   |
| Catalog Years      | Academic catalog versions defining program requirements         |
| Prerequisites      | Courses required to be completed before enrollment in another   |
| Corequisites       | Courses required to be taken concurrently with another course   |

---

## 10. External Interfaces

| Interface          | Description                                                   |
|--------------------|---------------------------------------------------------------|
| Web UI             | Browser-based user interface for students, faculty, and admins|
| REST API           | Backend API providing program and course data access         |
| PostgreSQL         | Relational database for persistent storage of all data       |

---

## 11. Future Enhancements

- Integration with SFBU Student Information System for real-time enrollment data.
- Degree audit and graduation eligibility checker.
- Mobile application version of the Program Explorer.
- Personalized academic advising recommendations based on user profiles.
- Multi-language support for international students.

---

## 12. Acceptance Criteria

- All functional requirements (FR-001 to FR-013) are implemented and verified through testing.
- The system meets or exceeds all non-functional requirements (NFR-001 to NFR-007).
- The UI passes accessibility and usability testing.
- Administrators can manage program and course data without errors.
- The system successfully deploys and operates within SFBU’s infrastructure constraints.

---

## 13. References

- [Architecture.md](Architecture.md)
- [Database.md](Database.md)
- [API.md](API.md)
- [UIUX.md](UIUX.md)
- [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md)
- Epics (Project Management Documentation)
