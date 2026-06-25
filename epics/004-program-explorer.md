

# Epic 004 – Program Explorer

## 1. Overview
Program Explorer is the primary student-facing module for exploring SFB University’s BSCS, MSCS, and MSEE programs using catalog data only. It provides prospective and current students, as well as advisors, a clear and accessible interface to view program offerings, requirements, learning outcomes, and curriculum structure, without personalized or login-required features.

## 2. Objective
- Enable users to browse and understand available programs using up-to-date catalog data.
- Present program requirements, learning outcomes, and curriculum structure in a clear, visually engaging manner.
- Support exploration and comparison of programs before login or enrollment.

## 3. Scope
- Display all offered programs (BSCS, MSCS, MSEE) with catalog information.
- Show program details, requirements, learning outcomes, and credit summaries.
- Allow users to select catalog years and explore requirement groups.
- Provide navigation to curriculum roadmap and course explorer modules.

## 4. Out of Scope
- Student login or authentication.
- Degree audit or personalized progress tracking.
- Personalized planning features (e.g., My Plan).
- Enrollment or registration workflows.
- Advisor-only or admin features.

## 5. User Stories
- **As a prospective student**, I want to browse and compare programs to decide which degree best fits my interests.
- **As a current student**, I want to understand my program’s structure and requirements for my catalog year.
- **As an advisor**, I want to use visual program overviews to explain curriculum structure to students during presentations.

## 6. Functional Requirements
- **Program List Page:** Display all available programs with summary cards.
- **Program Detail Page:** Show detailed program information, including:
  - Program overview (title, description, degree type)
  - Learning outcomes
  - Requirement group summary (e.g., core, electives)
  - Credit summary (total, by group)
  - Catalog year selector
  - Navigation to curriculum roadmap and course explorer
- **Program Overview Cards:** Summarize key program attributes for quick comparison.
- **Learning Outcomes:** Clearly list program learning outcomes.
- **Requirement Group Summary:** Show groups, required credits, and brief descriptions.
- **Credit Summary:** Display total credits and breakdown by requirement group.
- **Catalog Year Selector:** Allow users to view programs for different catalog years.
- **Navigation:** Link to curriculum roadmap and course explorer for deeper exploration.

## 7. UI/UX Requirements
- Clean, modern layout with clear hierarchy and visual cues.
- Responsive design for desktop, tablet, and mobile devices.
- Accessibility compliance (WCAG 2.1 AA): semantic HTML, keyboard navigation, alt text.
- Search/filter for programs on the list page.
- Breadcrumb navigation for context and easy backtracking.
- Consistent typography, color palette, and card-based visual design.

## 8. Suggested Page Structure
- **Home → Programs** (Program List)
- **Programs → Program Detail** (with catalog year, requirements, outcomes, navigation)

## 9. Components List
- `ProgramCard` – summary card for program list
- `ProgramHero` – header section for program detail
- `RequirementSummary` – displays requirement groups and credits
- `LearningOutcomeCard` – lists learning outcomes
- `CatalogSelector` – choose catalog year
- `ProgramNavigation` – links to curriculum roadmap and course explorer
- `RelatedPrograms` – suggest similar programs

## 10. API Dependencies
- Endpoint: `/api/programs` – list of all programs
- Endpoint: `/api/programs/{programId}?catalogYear=YYYY` – program details by year
- Endpoint: `/api/catalog-years` – available catalog years
- Endpoint: `/api/programs/{programId}/learning-outcomes` – learning outcomes
- Endpoint: `/api/programs/{programId}/requirements` – requirement groups

## 11. Tasks
- [ ] Design and implement Program List Page with `ProgramCard`s.
- [ ] Build Program Detail Page using `ProgramHero`, `RequirementSummary`, `LearningOutcomeCard`, and `CatalogSelector`.
- [ ] Integrate catalog year selection.
- [ ] Implement navigation to curriculum roadmap and course explorer.
- [ ] Ensure responsive, accessible UI with breadcrumbs and consistent design.
- [ ] Connect all components to backend API endpoints.
- [ ] Write documentation and update `TASKS.md` and `CHANGELOG.md`.

## 12. Acceptance Criteria
- Users can view all available programs and select one for details.
- Program detail page displays overview, requirements, learning outcomes, and credit summary for selected catalog year.
- Navigation to curriculum roadmap and course explorer is functional.
- UI is responsive and accessible.
- No login or personalized features are present.
- All components fetch and display data from backend APIs.

## 13. Definition of Done
- All functional and UI/UX requirements are met.
- Acceptance criteria are satisfied and verified by review.
- Code is merged, documented, and released.
- `TASKS.md` and `CHANGELOG.md` are updated.
- No regressions or accessibility issues introduced.

## 14. Future Enhancements
- Add comparison view for multiple programs.
- Integrate program video or media introductions.
- Support for dual-degree or minor program exploration.
- Add personalized planning and degree audit (future epics).

## 15. AI Execution Instructions
- Implement only the requirements in this Epic.
- Reuse existing components where possible.
- Do **not** implement student-specific or login-required features.
- Update `TASKS.md` and `CHANGELOG.md` with all changes.
- Provide a summary of changes after implementation.
- Recommend starting Epic 005 (e.g., Curriculum Roadmap) next.