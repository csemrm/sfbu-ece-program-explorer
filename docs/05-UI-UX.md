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

Layout — three columns

| Column | Contents |
| --- | --- |
| Left | Courses the user has already completed — the degree's courses as a flat clickable checklist, plus removable chips |
| Middle | Courses actually offered next semester, each selectable, with pending prerequisites highlighted |
| Right | Courses ready to register, then the chosen plan with credits, blocked warnings and a PDF download |

Two selectors sit above the columns: **Degree** and **Next semester**.

The middle column is scoped to the term's real offerings rather than the whole catalog, because the question the screen answers is "what can I register for next semester" — a catalog-wide search would surface courses that aren't running.

Those offerings come from `GET /terms/:id?programId=…` — read from the database for that degree and that semester — rather than assembled in the browser from the full catalog. The response carries the whole term with each course flagged `inProgram`, which is what lets the notice below report both counts from one request.

Degree scope

The degree selector narrows both catalog columns. The offerings column is scoped server-side via `GET /terms/:id?programId=…`; the completed column is scoped in the browser from `GET /programs/:id/roadmap`, since it lists the whole degree rather than one term.

Scoping the offerings can empty the middle column outright — Fall 2026 runs graduate CS only, so BSCS and MSEE match none of its 8 courses. That gap is stated in words ("None of Fall 2026's 8 courses are part of BSCS") with a **Show all N anyway** toggle, rather than rendering a blank panel that reads as a bug. When the overlap is partial the same notice reports how many were hidden.

A program whose roadmap returns no courses is treated as "do not scope" — filtering the planner down to nothing would look broken rather than like missing data.

Completed-courses column

The degree's courses are listed as a single flat checklist with a filter box above it. **Marked courses sort to the top**, separated by a rule, with everything else following by course code — correcting a mistake meant hunting through a hundred unmarked rows otherwise. Order within each half is by course code. The list was originally grouped into collapsible subject sections; once the degree selector narrowed it, those sections mostly held one subject each and cost a click to open, so the grouping was dropped in favour of a list that scans in one pass.

Courses completed under one degree stay marked when the user switches degree; the chips resolve against the unscoped catalog so their codes still render.

When a filter matches nothing, the panel says whether the course exists **in another degree** — "CS483, CS483L are in the catalog but not part of MSCS". An empty result is usually the degree filter doing its job, and silence there reads as a missing course.

Suggested column

"Ready to register" is drawn from the term's own offerings — registrable, not already completed, not already chosen — rather than the planner API's `suggestions` feed, which answers the different question of what the *whole plan* would unlock later.

It shows **at most five**, ranked by how firmly the degree requires each course: Core/Foundation/Preparation/Capstone first, then a specialization or cluster choice, then a free elective. With only five slots, spending one on an elective while a required course is available would be the wrong advice. The tier comes from the requirement group's name in the roadmap, so it needs no extra data.

A recommendation list as long as the term's schedule is not a recommendation; five fills a semester and reads without scrolling, and the full list is the Offered column beside it.

PDF download

The plan prints through a hidden `.plan-print` sheet revealed only under `@media print`, with `window.print()` behind a "Download as PDF" button; the user chooses "Save as PDF" in the browser dialog. No PDF library is bundled, keeping the client bundle unchanged.

The sheet carries **every list on the screen**: the plan broken out by requirement group, the ready-to-register shortlist, the full term offering table with each course's registration status, and the completed-course list — plus the term, degree and an "Advisory only — not a registration record" disclaimer.

**Your plan** is grouped by requirement group on screen and on paper — Foundation Courses, Capstone, Free Electives — with credits per group. A flat list of five codes does not tell a student whether they have covered their core requirements or stacked five electives, which is the question a registration plan exists to answer. Groups sort by requirement tier, then by the catalog's own sequence, so Foundation precedes Capstone rather than the alphabet deciding.

Course states in the right column

| State | Treatment |
| --- | --- |
| Ready | Neutral border; selecting it tints the row navy |
| Prerequisites pending | Red row + "Prerequisites pending" badge + "Needs CS515" naming the missing courses |
| Corequisite not selected | Amber note, shown only once the course itself is selected |
| Already completed | Amber note (likely a mistake to re-take) |

#### What can be added to a plan

A course **cannot be added** while it is blocked by an unmet prerequisite, or cancelled, or closed to registration. Its checkbox is disabled and the reason is named beside it.

It can always be **removed**, though. Gating only the "add" direction means a course that becomes blocked *after* it was chosen — the student unmarks its prerequisite, or the registrar cancels a section — is never stranded in the plan with no way to take it out.

This reverses the planner's original rule, which left prerequisite-blocked courses selectable on the grounds that a student might hold a waiver or transfer credit. That escape route still exists and is better: the student marks the prerequisite as **completed** in the left column, which unblocks the row. Gating the checkbox therefore shuts nobody out, and it stops the planner offering a registration a student cannot make.

The column has its own **filter box** — 96 offerings is too many to scan — and is ordered by what the student can act on: anything **closed or cancelled sinks to the end** regardless of degree, and among the rest **in-program courses lead**. The sort is applied before the scoped/full split, so the default view is ordered too.

The **capstone** is flagged when taken too early: the catalog reserves it for "all or most coursework" completed, so it is offered once the current semester would carry the student to the degree's required credits, and below that it carries a "Final semester — N more credits needed" note and drops out of Suggested. It **stays selectable**, unlike an unmet prerequisite: "most coursework" is a judgement an advisor makes on the whole record, not a fact the planner can check, so it advises rather than gates.

The selection summary still counts how many chosen courses are blocked, since a course can become blocked after it was picked.

Blocked rows carry a visually-hidden "Prerequisites pending:" prefix and an `aria-describedby` link from the checkbox to the reason, so the red highlight is never the only signal.

Verdict states

Three states, because "you aren't ready" and "the school isn't running it" are different problems:

| State | Colour | Meaning |
| --- | --- | --- |
| Eligible | Green | Prerequisites satisfied and not known to be unoffered |
| Not offered | Amber + "Not offered" badge | Prerequisites satisfied, but the course isn't scheduled in the selected term |
| Blocked | Red | Prerequisites or corequisites unmet (wins the row treatment even if also unoffered, since it's the more actionable failure — the availability badge still shows) |

Screen readers get a distinct visually-hidden prefix per state ("Eligible:", "Not offered this term:", "Not eligible:") so the colour is never the only signal.

Academic term selector

Each semester card offers "Any term (no availability check)" plus every curated term. Leaving it unset keeps the slot offering-agnostic, so a user can still sketch an abstract sequence. The selector is hidden entirely when no terms are curated, and the planner degrades to prerequisite-only checking if the terms endpoint is unavailable.

A term whose schedule has not been published yet is labelled "— schedule not published yet" in the dropdown, and selecting it shows "No schedule published for this term yet, so availability isn't checked." Its courses report `offered: null` and stay green. Silently showing every course as unknown would look like a bug; claiming they are all unavailable would be a lie.

State persists in browser localStorage only (`semester-plan-v3`; the completed-courses list is salvaged from v1/v2 plans on read). Eligibility is computed by POST /planner/evaluate — every offered course is evaluated, not just the selected ones, so the column can show what is blocked *before* the user commits. Terms come from GET /terms.

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