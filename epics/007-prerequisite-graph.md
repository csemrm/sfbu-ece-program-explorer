

# Epic 007 – Prerequisite Graph

## 1. Overview

This Epic introduces an interactive graph visualization to explore prerequisite and corequisite relationships among catalog courses for the BSCS, MSCS, and MSEE programs. The graph enables users to visually navigate course dependencies, facilitating understanding of curricular structure and planning.

## 2. Objective

Provide a dynamic, intuitive interface for exploring course prerequisite and corequisite relationships within each program and catalog year, supporting prospective and current students, faculty, and advisors in curriculum navigation and planning.

## 3. Scope

- Visualization of prerequisite and corequisite relationships for all catalog courses in BSCS, MSCS, and MSEE.
- Interactive graph with search, filtering, and detail features.
- Navigation integration with Course Explorer and Curriculum Roadmap.
- Support for multiple catalog years.

## 4. Out of Scope

- Degree audit or progress tracking.
- Enrollment validation.
- Personalized planning or student-specific course paths.
- Student record integration.

## 5. User Stories

### Prospective Students
- As a prospective student, I want to see how introductory courses connect to advanced courses, so I can understand the curriculum structure.
- As a prospective student, I want to search for a course and see its prerequisites, so I can estimate my preparation needs.

### Current Students
- As a current student, I want to visualize all courses required for my program and their dependencies, so I can plan my future semesters.
- As a current student, I want to identify which courses unlock advanced electives, so I can optimize my course sequence.

### Faculty
- As a faculty member, I want to review course dependencies to inform curriculum updates.
- As a faculty member, I want to identify potential bottleneck courses or over-constrained prerequisites.

### Advisors
- As an advisor, I want to help students understand prerequisite chains and alternative paths.
- As an advisor, I want to quickly access course details and requirements during advising sessions.

## 6. Functional Requirements

- **Select Program and Catalog Year:** Allow users to choose BSCS, MSCS, or MSEE and a specific catalog year.
- **Search for a Course:** Provide a search bar to locate and center the graph on a course.
- **Interactive Node-and-Edge Graph:** Visualize courses as nodes and dependencies as edges.
- **Display Prerequisites and Corequisites:** Distinguish between prerequisite and corequisite relationships.
- **Expand and Collapse Dependency Trees:** Enable collapsing/expanding portions of the graph for clarity.
- **Highlight Upstream and Downstream Paths:** Highlight all prerequisite (upstream) or dependent (downstream) courses from a selected node.
- **Center Graph on Selected Course:** Automatically focus and zoom on the selected course.
- **Node Details Panel:** Show course details (title, description, units, requirements) when a node is selected.
- **Navigation to Course Explorer and Curriculum Roadmap:** Provide links from nodes/details to related pages.

## 7. Visualization Requirements

- **Layout:** Use force-directed or hierarchical layouts for clarity.
- **Node Colors:** Differentiate required, elective, and core courses with distinct colors.
- **Edge Styles:** Use solid lines for prerequisites, dashed or differently colored lines for corequisites.
- **Zoom and Pan:** Enable smooth zooming and panning.
- **MiniMap:** Provide a minimap for navigation in large graphs.
- **Legend:** Include a legend explaining node and edge meanings.
- **Animations:** Animate node expansion/collapse and transitions.
- **Accessibility:** Ensure keyboard navigation, screen reader support, and color contrast.

## 8. Suggested Page Structure

- **Home** → **Programs** → **Course Explorer** → **Prerequisite Graph**

## 9. Components

- **GraphCanvas:** Container for the graph visualization (uses React Flow).
- **CourseNode:** Renders individual course nodes.
- **DependencyEdge:** Renders edges; distinguishes prerequisite vs corequisite.
- **GraphToolbar:** Controls for layout, expand/collapse, highlight, reset, and export.
- **SearchBar:** Course search and quick navigation.
- **DetailsPanel:** Displays course details when a node is selected.
- **Legend:** Explains colors, edge types, and icons.
- **MiniMap:** Overview of the full graph.
- **FilterPanel:** Optional filtering by requirement type, department, etc.

## 10. Backend API Dependencies

Example endpoints:
- `GET /courses/:id/dependencies` – Returns all prerequisites and corequisites for a course.
- `GET /courses/:id` – Returns course details.
- `GET /programs/:id/graph?catalogYear=YYYY` – Returns the full dependency graph for a program and catalog year.

## 11. Performance Requirements

- Efficient rendering for large graphs (hundreds of nodes/edges).
- Lazy loading of subgraphs as needed.
- Graph data caching to reduce redundant API calls.
- Responsive UI for desktop and mobile.

## 12. Tasks

```markdown
- [ ] Design GraphCanvas and select layout algorithm (preferably React Flow).
- [ ] Implement CourseNode with color coding and accessibility.
- [ ] Implement DependencyEdge with distinct styles for prerequisites/corequisites.
- [ ] Build SearchBar for course lookup and navigation.
- [ ] Implement DetailsPanel for course information.
- [ ] Add GraphToolbar with expand/collapse, highlight, reset, and export controls.
- [ ] Integrate MiniMap and Legend.
- [ ] Connect to backend API endpoints for graph and course data.
- [ ] Implement expand/collapse logic for dependency trees.
- [ ] Enable highlight of upstream (prerequisite) and downstream (dependent) paths.
- [ ] Ensure accessibility (keyboard, screen reader, color contrast).
- [ ] Add loading, error, and empty states.
- [ ] Write tests for components and graph logic.
- [ ] Document usage and update TASKS.md and CHANGELOG.md.
```

## 13. Acceptance Criteria

- Users can select a program and catalog year.
- Users can search for and center the graph on any course.
- The graph clearly distinguishes prerequisites and corequisites.
- Users can expand/collapse dependency trees.
- Node selection displays course details.
- Navigation is provided to Course Explorer and Curriculum Roadmap.
- Graph performance is acceptable for large programs.
- Accessibility standards are met.
- All tasks completed and documented.

## 14. Definition of Done

- All functional and visualization requirements are met.
- All user stories are satisfied.
- Code reviewed and merged to main.
- Documentation is complete.
- Tests pass.
- TASKS.md and CHANGELOG.md updated.
- Demo reviewed and accepted by stakeholders.

## 15. Future Enhancements

- Cross-program and cross-catalog visualization.
- AI-generated explanations of prerequisite paths.
- Printable or shareable graph views.
- Export to SVG or PDF.
- Integration with personalized planning tools (Epic 009+).

## 16. AI Execution Instructions

- Implement **only** the features described in this Epic.
- Use **React Flow** as the preferred graph visualization library.
- Reuse existing components and styles where possible.
- **Do not** implement degree audit, enrollment validation, or student-specific logic.
- Update `TASKS.md` and `CHANGELOG.md` as progress is made.
- Summarize all changes in a brief report.
- Upon completion, recommend starting **Epic 008 – Admin Dashboard**.