

# Epic 006 – Curriculum Roadmap

## 1. Overview
Develop an interactive curriculum roadmap that visualizes the recommended academic progression for SFBU's BSCS, MSCS, and MSEE programs. The roadmap should use catalog data only and display the typical semester-by-semester sequence of courses, aiding students and faculty in understanding program structure and course dependencies.

## 2. Objective
- Provide an at-a-glance, interactive visual timeline of required and elective courses for each program and catalog year.
- Help prospective and current students, as well as faculty and advisors, understand the standard academic pathway.

## 3. Scope
- Roadmap visualization for BSCS, MSCS, MSEE programs.
- Data sourced exclusively from the catalog (no student-specific data).
- Interactive features (zoom, pan, expand/collapse, selection).
- Links to Course Explorer and Prerequisite Graph.

## 4. Out of Scope
- Personalized plans or student-specific degree audits.
- Registration or planning for individual student schedules.
- Advisor overrides or custom course substitutions.
- Real-time seat availability or instructor assignments.

## 5. User Stories
- **As a prospective student**, I want to see the recommended course sequence for my intended program so I can plan my studies.
- **As a current student**, I want to understand the typical order and prerequisites of courses to plan my future semesters.
- **As a faculty member**, I want to view the curriculum roadmap to coordinate course offerings and advise students.
- **As an academic advisor**, I want to visually explain the standard pathway to students during advising sessions.

## 6. Functional Requirements
- **Program Roadmap Selection**: User can select BSCS, MSCS, or MSEE.
- **Catalog Year Selection**: User can change catalog year to view historical or current requirements.
- **Semester-by-Semester Timeline**: Display courses grouped by recommended semester.
- **Course Cards**: Each course represented as a card with code, title, credits, and requirement group.
- **Recommended Sequence**: Courses arranged in typical order, with prerequisites visually indicated.
- **Requirement Group Indicators**: Distinguish between core, elective, and other requirement groups.
- **Credit Totals per Semester**: Show total credits for each term.
- **Expand/Collapse Semesters**: Allow users to expand/collapse semester columns for focus.
- **Zoom and Pan**: Enable users to zoom out/in and pan across the roadmap.
- **Links to Course Explorer and Prerequisite Graph**: Each course card links to its detail page and the prerequisite graph.

## 7. Visualization Requirements
- **Timeline**: Horizontal or vertical layout showing semesters as columns.
- **Cards**: Visually distinct course cards with consistent sizing and color coding.
- **Color Legend**: Legend explaining colors for core, elective, prerequisite, etc.
- **Responsive Behavior**: Works on desktop, tablet, and mobile.
- **Animations**: Smooth transitions for expand/collapse, zoom, and pan.
- **Accessibility**: Keyboard navigation, screen reader support, sufficient contrast.

## 8. Suggested Page Structure
- **Home → Program → Curriculum Roadmap**
    - Home: Program list
    - Program: Overview and requirements
    - Curriculum Roadmap: Visual timeline for selected program and catalog year

## 9. Components
- `RoadmapCanvas`: Main visualization area for the roadmap.
- `SemesterColumn`: Displays courses for a single semester.
- `CourseCard`: Individual course display with details and links.
- `Legend`: Explains color and icon meanings.
- `TimelineControls`: Zoom, pan, expand/collapse controls.
- `CatalogSelector`: Dropdown for catalog year selection.
- `ProgramSelector`: Dropdown for program selection.
- `RoadmapToolbar`: Top bar with controls and legend.

## 10. Backend API Dependencies
- `GET /programs/:id/roadmap?catalog_year=YYYY`
    - Returns structured semester-by-semester roadmap data for a program.
- `GET /courses/:id`
    - Returns course details for display in cards.
- `GET /requirement-groups`
    - Returns metadata for requirement group color coding.

## 11. Tasks
```markdown
- [ ] Design roadmap visualization layout and user flow
- [ ] Implement `RoadmapCanvas` component
- [ ] Implement `SemesterColumn` and `CourseCard` components
- [ ] Add `Legend`, `TimelineControls`, `CatalogSelector`, and `ProgramSelector`
- [ ] Integrate with backend API endpoints
- [ ] Implement zoom and pan functionality
- [ ] Add expand/collapse for semesters
- [ ] Display credit totals per semester
- [ ] Add links to Course Explorer and Prerequisite Graph
- [ ] Ensure responsive and accessible design
- [ ] Write unit and integration tests
- [ ] Update documentation and user guide
- [ ] Update `TASKS.md` and `CHANGELOG.md` with progress and changes
```

## 12. Acceptance Criteria
- Users can select a program and catalog year to view the roadmap
- Roadmap displays all required and elective courses in recommended sequence
- Course cards show code, title, credits, and requirement group
- Prerequisites are visually indicated or linked
- Semester columns show credit totals and can be expanded/collapsed
- Zoom and pan are functional
- All links to course details and prerequisite graph work
- Visualization is responsive and accessible
- No student-specific planning or registration features present

## 13. Definition of Done
- All functional and visualization requirements met
- All acceptance criteria satisfied
- All tasks complete and tested
- Documentation updated
- `TASKS.md` and `CHANGELOG.md` updated with summary of changes
- Ready for stakeholder review

## 14. Future Enhancements
- Support for custom (student-specific) pathway planning
- Printable or exportable roadmap
- Compare multiple catalog years side-by-side
- Highlight or filter electives and requirement groups

## 15. AI Execution Instructions
- Implement only this Epic; do not introduce personalized planning features.
- Reuse existing components and styles where possible.
- Avoid any student-specific or registration functionality.
- Keep `TASKS.md` and `CHANGELOG.md` up to date with changes and progress.
- Summarize all roadmap-related changes in the changelog.
- Recommend Epic 007 – Prerequisite Graph as the next major feature after this roadmap.