SFBU ECE Program Explorer – UI/UX Design Specification

Version: 1.0
Status: Draft

Revision History

Version	Date	Author	Description
1.0	2026-06-24	Project Team	Initial UI/UX Specification

⸻

1. Purpose

This document defines the user experience (UX) and user interface (UI) design standards for the SFBU ECE Program Explorer.

The objective is to create a modern, interactive learning platform that transforms the university catalog into an intuitive visual experience.

⸻

2. Design Goals

The interface should:

* Be simple to learn
* Be visually engaging
* Be mobile friendly
* Encourage exploration
* Reduce dependency on PDF catalogs
* Support accessibility (WCAG 2.1 AA)
* Be consistent across all pages

⸻

3. Design Principles

Simplicity

Present one primary action per screen.

⸻

Consistency

Maintain consistent:

* colors
* typography
* spacing
* navigation
* icons

⸻

Visual Learning

Replace large text blocks with:

* diagrams
* cards
* graphs
* timelines
* charts

⸻

Progressive Disclosure

Only show advanced information when users request it.

⸻

Accessibility

Support:

* keyboard navigation
* screen readers
* sufficient color contrast
* scalable fonts

⸻

4. Target Users

Prospective Students

Explore programs.

⸻

Current Students

Understand curriculum.

⸻

Faculty

Present programs.

⸻

Advisors

Use during advising sessions.

⸻

Administrators

Maintain catalog content.

⸻

5. Branding

Style

Modern

Academic

Technology-focused

Minimal

Professional

⸻

Color Palette

Purpose	Color
Primary	SFBU Blue
Secondary	Slate Gray
Success	Green
Warning	Orange
Error	Red
Background	White
Surface	Light Gray

⸻

Typography

Primary Font

Inter

Fallback

Roboto

System UI

⸻

Icons

Recommended

* Heroicons
* Lucide
* Material Symbols

⸻

6. Responsive Design

Breakpoints

Device	Width
Mobile	<768px
Tablet	768–1024px
Desktop	>1024px

⸻

7. Navigation

Home
Programs
Course Explorer
Knowledge Areas
Curriculum Roadmap
Prerequisite Graph
Compare Programs
About

Administrator

Dashboard
Programs
Courses
Catalog
Audit Log
Settings

⸻

8. Page Specifications

Home

Contains

* Hero
* Search
* Program Cards
* Quick Links
* Featured Visualizations

⸻

Program Explorer

Displays

* Overview
* Credits
* Requirement Groups
* Learning Outcomes
* Curriculum Button

⸻

Course Explorer

Displays

* Search
* Filters
* Course Cards
* Course Detail

⸻

Knowledge Area Explorer

Routes: /knowledge-areas, /knowledge-areas/[id]

Groups courses by subject matter rather than by degree requirement, letting a
user explore a domain across program boundaries.

List page displays

* Page header with area count and link to the full course catalog
* Card grid — one per area, showing name, description, and course count
* Undergraduate / graduate split bar per card (navy = UG, gold = graduate),
  labelled for assistive technology
* Footnote noting that courses spanning multiple domains are counted in each

Detail page displays

* Navy gradient hero with gold rule, area name, description
* Stat row — total courses, undergraduate count, graduate count
* Courses grouped under Undergraduate and Graduate headings, reusing CourseCard
* Empty state when an area has no courses assigned
* CTAs back to all areas and out to Programs

Program comparison (/programs/compare) additionally renders a Knowledge Area
Coverage table: union of areas across the compared programs, one bar-and-count
cell per program, ranked by combined coverage. Areas absent from a program show
an em dash. The table scrolls horizontally on narrow viewports.

⸻

Curriculum Roadmap

Displays

* Semester Timeline
* Course Cards
* Credit Totals

⸻

Prerequisite Graph

Displays

* Interactive Graph
* Legend
* Filters
* Course Details

⸻

Semester Planner

Route: /plan

Lets a user check prerequisite eligibility before registering, without any login or stored records.

Displays

* Completed-courses panel (searchable picker + removable chips)
* Ordered semester cards, each with a course picker and per-course eligibility verdict (eligible / blocked, with a plain-language reason)
* Corequisite status per course (done / this term / not scheduled)
* Plan summary (completed, semesters, planned courses, planned credits, overall eligibility)
* Suggested next courses (unlocked once the plan is complete)

State persists in browser localStorage only. Eligibility is computed by POST /planner/evaluate.

⸻

Admin Dashboard

Displays

* Statistics
* Catalog Management
* Audit Log

⸻

Admin — Course Offerings

Route: /admin/offerings (protected)

Two-column tool for curating per-term course offerings and checking registration eligibility.

Displays

* Term selectors for "this semester" (left) and "next semester" (right), plus inline term creation
* Left column: courses offered this semester (add via picker / remove)
* Right column: courses offered next semester, each with an eligibility badge, blocking reason, and a checkbox to select for registration
* Selection summary (N selected — X eligible, Y blocked)

A next-semester course is eligible when its prerequisites are covered by the left column. Reuses POST /planner/evaluate; offerings are persisted via the admin API.

⸻

9. Component Library

Core Components

* Button
* Card
* Badge
* Table
* Modal
* Dialog
* Tooltip
* Tabs
* Accordion
* Breadcrumbs
* Pagination
* SearchBar

Program Components

* ProgramCard
* ProgramHero
* RequirementSummary
* CatalogSelector

Course Components

* CourseCard
* CourseDetail
* KnowledgeAreaTag
* RelatedCourses

Roadmap Components

* SemesterColumn
* Timeline
* Legend

Graph Components

* GraphCanvas
* CourseNode
* DependencyEdge
* MiniMap

Admin Components

* DashboardCard
* DataTable
* CourseForm
* ProgramForm

⸻

10. User Flows

Program Exploration

Home
↓
Programs
↓
Program Detail
↓
Curriculum Roadmap
↓
Course Detail

⸻

Course Discovery

Home
↓
Search
↓
Course Explorer
↓
Course Detail
↓
Prerequisite Graph

⸻

Administrator

Login
↓
Dashboard
↓
Edit Course
↓
Preview
↓
Publish

⸻

11. Wireframes

Home

+--------------------------------------+
Navigation
Hero
Search
Programs
Footer
+--------------------------------------+

⸻

Program Detail

+--------------------------------------+
Hero
Overview
Requirements
Learning Outcomes
Roadmap Button
+--------------------------------------+

⸻

Course Explorer

+--------------------------------------+
Search
Filters
Course Cards
Pagination
+--------------------------------------+

⸻

Curriculum Roadmap

Semester 1
↓
Semester 2
↓
Semester 3
↓
Semester 4

⸻

Prerequisite Graph

CS101
↓
CS201
↓
CS301
↓
CS401

⸻

12. Accessibility

The application shall conform to WCAG 2.1 AA.

Requirements

* Keyboard navigation
* ARIA labels
* Semantic HTML
* High contrast
* Focus indicators
* Skip navigation links

⸻

13. Animation Guidelines

Use subtle animations.

Examples

* Page transitions
* Card hover
* Graph expansion
* Timeline expansion

Avoid excessive animation.

⸻

14. Error States

Provide user-friendly messages.

Examples

“No programs found.”

“No matching courses.”

“Unable to load catalog.”

⸻

15. Loading States

Use

* Skeleton screens
* Loading spinners
* Progress indicators

Never leave blank pages.

⸻

16. Future Enhancements

* Dark Mode
* Multi-language support
* Personalized dashboard
* AI explanations
* Interactive onboarding
* Export diagrams

⸻

17. References

* docs/SRS.md
* docs/02-Architecture.md
* docs/03-Database.md
* docs/04-API.md
* epics/004-program-explorer.md
* epics/005-course-explorer.md
* epics/006-roadmap.md
* epics/007-prerequisite-graph.md