import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { OfferingPlanner } from '../../components/planner/OfferingPlanner';
import type { Course, TermSummary } from '../../lib/api';
import type { ProgramOption } from '../../lib/programScope';

jest.mock('../../lib/api', () => ({
  api: { planner: { evaluate: jest.fn() }, terms: { get: jest.fn() } },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { api } = require('../../lib/api');

const STORAGE_KEY = 'semester-plan-v3';

const course = (id: string, courseCode: string): Course => ({
  id,
  courseCode,
  title: `Title ${courseCode}`,
  description: null,
  creditHours: '3.0',
  level: 'graduate',
});

/** Two offered courses, neither of which belongs to the selected degree. */
const courses = [course('c-1', 'CS200'), course('c-2', 'CS500'), course('c-3', 'CS501')];

const terms: TermSummary[] = [
  { id: 't-1', name: 'Fall 2026', sortOrder: 1, courseCount: 2, offeredCourseIds: ['c-2', 'c-3'] },
];

const programs: ProgramOption[] = [
  {
    id: 'p-1',
    abbreviation: 'BSCS',
    name: 'Bachelor of Science',
    courseIds: ['c-1'],
    tiers: {},
    groups: {},
    groupOrder: {},
    requiredCredits: 36,
    capstoneCourseIds: [],
  },
];

/** The term detail the API now serves: whole term, each course flagged inProgram. */
const termDetail = (inProgram: string[] = []) => ({
  id: 't-1',
  name: 'Fall 2026',
  sortOrder: 1,
  courseCount: 2,
  inProgramCount: inProgram.length,
  courses: ['c-2', 'c-3'].map((id) => ({
    id,
    courseCode: courses.find((c) => c.id === id)!.courseCode,
    title: courses.find((c) => c.id === id)!.title,
    creditHours: 3,
    level: 'graduate' as const,
    openForRegistration: true,
    sectionCount: null,
    statusNote: null,
    inProgram: inProgram.includes(id),
  })),
});

const evaluationFor = (ids: string[], completed: string[] = []) => ({
  terms: [
    {
      term: 1,
      termId: 't-1',
      termName: 'Fall 2026',
      termCredits: 3 * ids.length,
      courses: ids.map((id) => ({
        courseId: id,
        courseCode: courses.find((c) => c.id === id)!.courseCode,
        title: courses.find((c) => c.id === id)!.title,
        creditHours: 3,
        level: 'graduate' as const,
        eligible: true,
        offered: true,
        registrable: true,
        openForRegistration: true,
        sectionCount: null,
        statusNote: null,
        alreadyCompleted: completed.includes(id),
        satisfiedPrerequisites: [],
        missingPrerequisites: [],
        backgroundPrerequisites: [],
        corequisites: [],
        reason: 'Eligible',
      })),
    },
  ],
  suggestions: [],
  totalPlannedCredits: 0,
  allEligible: true,
  allOffered: true,
});

describe('OfferingPlanner — out-of-degree offerings', () => {
  beforeEach(() => {
    window.localStorage.clear();
    api.terms.get.mockResolvedValue(termDetail());
    api.planner.evaluate.mockImplementation(({ terms: t }: { terms: { courseIds: string[] }[] }) =>
      Promise.resolve(evaluationFor(t[0].courseIds)),
    );
  });

  it('scopes offerings to the degree by default and offers an escape hatch', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);

    expect(
      await screen.findByText(/None of Fall 2026's 2 courses are part of BSCS/),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show all 2 anyway/ })).toBeInTheDocument();
  });

  it('persists the escape hatch, so a plan built through it survives a reload', async () => {
    const { unmount } = render(
      <OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />,
    );

    fireEvent.click(await screen.findByRole('button', { name: /Show all 2 anyway/ }));

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
      expect(stored.showAllOfferings).toBe(true);
    });
    unmount();

    // Remount is the reload: the toggle must come back on, otherwise selections
    // made through it evaluate to nothing and "Your plan" reads as empty.
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);
    expect(
      await screen.findByRole('button', { name: /Show only BSCS courses/ }),
    ).toBeInTheDocument();
  });

  it('keeps a plan of out-of-degree courses visible after remounting', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedIds: [],
        termId: 't-1',
        selectedIds: ['c-2'],
        programId: 'p-1',
        showAllOfferings: true,
      }),
    );

    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);

    expect(await screen.findByText(/1 course · 3 cr/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download as PDF/ })).toBeInTheDocument();
  });

  it('re-scopes to the new degree when the degree changes', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);
    fireEvent.click(await screen.findByRole('button', { name: /Show all 2 anyway/ }));
    expect(await screen.findByRole('button', { name: /Show only BSCS/ })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'p-1' } });
    expect(await screen.findByRole('button', { name: /Show all 2 anyway/ })).toBeInTheDocument();
  });
});

describe('OfferingPlanner — completed courses in the offerings column', () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Set explicitly rather than inherited from an earlier describe — leaked
    // mock state made this block's failures depend on execution order.
    api.terms.get.mockResolvedValue(termDetail(['c-2', 'c-3']));
    api.planner.evaluate.mockImplementation(
      ({
        completedCourseIds,
        terms: t,
      }: {
        completedCourseIds: string[];
        terms: { courseIds: string[] }[];
      }) => Promise.resolve(evaluationFor(t[0].courseIds, completedCourseIds)),
    );
  });

  const seed = (completedIds: string[]) =>
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedIds,
        termId: 't-1',
        selectedIds: [],
        programId: 'p-1',
        showAllOfferings: true,
      }),
    );

  /** The offerings column only — course titles also appear under Suggested. */
  const offeredColumn = async () => {
    const heading = await screen.findByText(/^Offered in Fall 2026$/);
    return heading.closest('div')!.parentElement as HTMLElement;
  };

  it('drops an already-completed course from the offerings column', async () => {
    seed(['c-2']);
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);

    const column = await offeredColumn();
    // CS501 still on offer; CS500 is completed and no longer a candidate.
    await waitFor(() => expect(within(column).getByText('Title CS501')).toBeInTheDocument());
    expect(within(column).queryByText('Title CS500')).not.toBeInTheDocument();
  });

  it('says how many were hidden rather than silently shrinking the list', async () => {
    seed(['c-2']);
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);
    expect(await screen.findByText(/1 completed hidden/)).toBeInTheDocument();
  });

  it('reports the all-completed case instead of looking like it is still loading', async () => {
    seed(['c-2', 'c-3']);
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);
    expect(
      await screen.findByText(/already completed everything offered in Fall 2026/),
    ).toBeInTheDocument();
  });
});

describe('OfferingPlanner — offerings come from the database', () => {
  beforeEach(() => {
    window.localStorage.clear();
    api.terms.get.mockResolvedValue(termDetail(['c-2']));
    api.planner.evaluate.mockImplementation(({ terms: t }: { terms: { courseIds: string[] }[] }) =>
      Promise.resolve(evaluationFor(t[0].courseIds)),
    );
  });

  it('requests the term scoped to the selected degree', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);
    await waitFor(() => expect(api.terms.get).toHaveBeenCalledWith('t-1', { programId: 'p-1' }));
  });

  it("uses the API's inProgram flag for the scope notice", async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);
    // 1 of the term's 2 offerings sits outside the degree.
    expect(await screen.findByText(/1 of 2 offered courses are outside BSCS/)).toBeInTheDocument();
  });

  it('evaluates only the in-program offerings until the escape hatch is used', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);
    await waitFor(() =>
      expect(api.planner.evaluate).toHaveBeenCalledWith(
        expect.objectContaining({ terms: [{ termId: 't-1', courseIds: ['c-2'] }] }),
      ),
    );
  });
});

describe('OfferingPlanner — the Suggested column is a shortlist', () => {
  const many = Array.from({ length: 9 }, (_, i) => `m-${i}`);

  beforeEach(() => {
    window.localStorage.clear();
    api.terms.get.mockResolvedValue({
      id: 't-1',
      name: 'Fall 2026',
      sortOrder: 1,
      courseCount: many.length,
      inProgramCount: many.length,
      courses: many.map((id, i) => ({
        id,
        courseCode: `CS${600 + i}`,
        title: `Course ${i}`,
        creditHours: 3,
        level: 'graduate' as const,
        openForRegistration: true,
        sectionCount: null,
        statusNote: null,
        inProgram: true,
      })),
    });
    api.planner.evaluate.mockImplementation(({ terms: t }: { terms: { courseIds: string[] }[] }) =>
      Promise.resolve({
        terms: [
          {
            term: 1,
            termId: 't-1',
            termName: 'Fall 2026',
            termCredits: 0,
            courses: t[0].courseIds.map((id, i) => ({
              courseId: id,
              courseCode: `CS${600 + i}`,
              title: `Course ${i}`,
              creditHours: 3,
              level: 'graduate' as const,
              eligible: true,
              offered: true,
              openForRegistration: true,
              sectionCount: null,
              statusNote: null,
              registrable: true,
              alreadyCompleted: false,
              satisfiedPrerequisites: [],
              missingPrerequisites: [],
              backgroundPrerequisites: [],
              corequisites: [],
              reason: 'Eligible',
            })),
          },
        ],
        suggestions: [],
        totalPlannedCredits: 0,
        allEligible: true,
        allOffered: true,
      }),
    );
  });

  it('recommends at most five courses even when nine are registrable', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={programs} />);

    const heading = await screen.findByText(/^Suggested for Fall 2026$/);
    const column = heading.closest('div')!.parentElement as HTMLElement;
    await waitFor(() =>
      expect(within(column).getAllByRole('button', { name: /^Add CS/ })).toHaveLength(5),
    );
  });
});

describe('OfferingPlanner — ordering and precedence', () => {
  const catalog = ['req', 'spec', 'elec'];

  const withTiers: ProgramOption[] = [
    {
      id: 'p-1',
      abbreviation: 'BSCS',
      name: 'Bachelor of Science',
      courseIds: catalog,
      tiers: { req: 'required', spec: 'specialization', elec: 'elective' },
      groups: { req: 'Core Courses', spec: 'Specialization — X', elec: 'Free Electives' },
      groupOrder: { req: 1, spec: 2, elec: 3 },
      requiredCredits: 36,
      capstoneCourseIds: [],
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
    // Deliberately served elective-first, so any correct ordering is the
    // component's doing rather than the API's.
    api.terms.get.mockResolvedValue({
      id: 't-1',
      name: 'Fall 2026',
      sortOrder: 1,
      courseCount: 3,
      inProgramCount: 3,
      courses: ['elec', 'spec', 'req'].map((id) => ({
        id,
        courseCode: id.toUpperCase(),
        title: id,
        creditHours: 3,
        level: 'graduate' as const,
        openForRegistration: true,
        sectionCount: null,
        statusNote: null,
        inProgram: true,
      })),
    });
    api.planner.evaluate.mockImplementation(({ terms: t }: { terms: { courseIds: string[] }[] }) =>
      Promise.resolve({
        terms: [
          {
            term: 1,
            termId: 't-1',
            termName: 'Fall 2026',
            termCredits: 0,
            courses: t[0].courseIds.map((id) => ({
              courseId: id,
              courseCode: id.toUpperCase(),
              title: id,
              creditHours: 3,
              level: 'graduate' as const,
              eligible: true,
              offered: true,
              openForRegistration: true,
              sectionCount: null,
              statusNote: null,
              registrable: true,
              alreadyCompleted: false,
              satisfiedPrerequisites: [],
              missingPrerequisites: [],
              backgroundPrerequisites: [],
              corequisites: [],
              reason: 'Eligible',
            })),
          },
        ],
        suggestions: [],
        totalPlannedCredits: 0,
        allEligible: true,
        allOffered: true,
      }),
    );
  });

  it('ranks Suggested by how firmly the degree requires each course', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={withTiers} />);
    const heading = await screen.findByText(/^Suggested for Fall 2026$/);
    const column = heading.closest('div')!.parentElement as HTMLElement;

    await waitFor(() =>
      expect(
        within(column)
          .getAllByRole('button', { name: /^Add / })
          .map((b) => b.getAttribute('aria-label')),
      ).toEqual(['Add REQ to your plan', 'Add SPEC to your plan', 'Add ELEC to your plan']),
    );
  });

  it('puts in-program offerings ahead of the rest of the term', async () => {
    api.terms.get.mockResolvedValue({
      id: 't-1',
      name: 'Fall 2026',
      sortOrder: 1,
      courseCount: 2,
      inProgramCount: 1,
      courses: [
        {
          id: 'outside',
          courseCode: 'ZZZ999',
          title: 'Outside',
          creditHours: 3,
          level: 'graduate' as const,
          openForRegistration: true,
          sectionCount: null,
          statusNote: null,
          inProgram: false,
        },
        {
          id: 'inside',
          courseCode: 'AAA100',
          title: 'Inside',
          creditHours: 3,
          level: 'graduate' as const,
          openForRegistration: true,
          sectionCount: null,
          statusNote: null,
          inProgram: true,
        },
      ],
    });
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={withTiers} />);

    fireEvent.click(await screen.findByRole('button', { name: /Show all 2 anyway/ }));
    await waitFor(() =>
      expect(api.planner.evaluate).toHaveBeenCalledWith(
        // The in-program course leads even though the API listed it second.
        expect.objectContaining({ terms: [{ termId: 't-1', courseIds: ['inside', 'outside'] }] }),
      ),
    );
  });
});

describe('OfferingPlanner — opening from a program page', () => {
  const two: ProgramOption[] = [
    {
      id: 'p-1',
      abbreviation: 'BSCS',
      name: 'Bachelor',
      courseIds: ['c-1'],
      tiers: {},
      groups: {},
      groupOrder: {},
      requiredCredits: 36,
      capstoneCourseIds: [],
    },
    {
      id: 'p-2',
      abbreviation: 'MSCS',
      name: 'Master',
      courseIds: ['c-2'],
      tiers: {},
      groups: {},
      groupOrder: {},
      requiredCredits: 36,
      capstoneCourseIds: [],
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
    api.terms.get.mockResolvedValue(termDetail());
    api.planner.evaluate.mockImplementation(({ terms: t }: { terms: { courseIds: string[] }[] }) =>
      Promise.resolve(evaluationFor(t[0].courseIds)),
    );
  });

  it('shows the degree as a label, not a selector, when linked from a program page', async () => {
    render(
      <OfferingPlanner
        courses={courses}
        academicTerms={terms}
        programs={two}
        initialProgramId="p-2"
      />,
    );
    // The choice was already made on the program page; offering it again invites
    // the user to undo the navigation they just performed.
    // Scoped to the header: the label also appears on the hidden print sheet.
    await waitFor(() =>
      expect(screen.getByText('Degree').parentElement).toHaveTextContent('MSCS — Master'),
    );
    expect(screen.queryByLabelText('Degree')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to programme/ })).toHaveAttribute(
      'href',
      '/programs/p-2',
    );
  });

  it('still offers the selector when not linked from a program page', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={two} />);
    await waitFor(() => expect(screen.getByLabelText('Degree')).toBeInTheDocument());
  });

  it('opens on the requested degree', async () => {
    render(
      <OfferingPlanner
        courses={courses}
        academicTerms={terms}
        programs={two}
        initialProgramId="p-2"
      />,
    );
    await waitFor(() =>
      expect(screen.getByText('Degree').parentElement).toHaveTextContent('MSCS — Master'),
    );
  });

  it('overrides a stored degree, since the click was deliberate', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedIds: [],
        termId: 't-1',
        selectedIds: [],
        programId: 'p-1',
        showAllOfferings: false,
      }),
    );
    render(
      <OfferingPlanner
        courses={courses}
        academicTerms={terms}
        programs={two}
        initialProgramId="p-2"
      />,
    );
    await waitFor(() =>
      expect(screen.getByText('Degree').parentElement).toHaveTextContent('MSCS — Master'),
    );
  });

  it('falls back to the stored degree when the requested one is unknown', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedIds: [],
        termId: 't-1',
        selectedIds: [],
        programId: 'p-2',
        showAllOfferings: false,
      }),
    );
    render(
      <OfferingPlanner
        courses={courses}
        academicTerms={terms}
        programs={two}
        initialProgramId="not-a-program"
      />,
    );
    await waitFor(() =>
      expect((screen.getByLabelText('Degree') as HTMLSelectElement).value).toBe('p-2'),
    );
  });
});

describe('OfferingPlanner — where to begin when nothing is completed', () => {
  const progs: ProgramOption[] = [
    {
      id: 'p-1',
      abbreviation: 'BSCS',
      name: 'Bachelor',
      courseIds: ['gate', 'elec', 'blocked'],
      // Both open courses are required, so what separates them is how much each
      // unlocks — GATE gates the rest of the term, ELEC gates nothing.
      tiers: { gate: 'required', elec: 'required', blocked: 'elective' },
      groups: {},
      groupOrder: {},
      requiredCredits: 36,
      capstoneCourseIds: [],
    },
  ];

  const detail = {
    id: 't-1',
    name: 'Fall 2026',
    sortOrder: 1,
    courseCount: 3,
    inProgramCount: 3,
    courses: ['gate', 'elec', 'blocked'].map((id) => ({
      id,
      courseCode: id.toUpperCase(),
      title: id,
      creditHours: 3,
      level: 'graduate' as const,
      openForRegistration: true,
      sectionCount: null,
      statusNote: null,
      inProgram: true,
    })),
  };

  const evaluation = (completed: string[]) => ({
    terms: [
      {
        term: 1,
        termId: 't-1',
        termName: 'Fall 2026',
        termCredits: 9,
        courses: ['gate', 'elec', 'blocked'].map((id) => ({
          courseId: id,
          courseCode: id.toUpperCase(),
          title: id,
          creditHours: 3,
          level: 'graduate' as const,
          eligible: id !== 'blocked',
          offered: true,
          openForRegistration: true,
          sectionCount: null,
          statusNote: null,
          registrable: id !== 'blocked',
          alreadyCompleted: completed.includes(id),
          satisfiedPrerequisites: [],
          // BLOCKED waits on GATE, which makes GATE the way into the term.
          missingPrerequisites:
            id === 'blocked'
              ? [
                  {
                    id: 'gate',
                    courseCode: 'GATE',
                    title: 'gate',
                    creditHours: 3,
                    level: 'graduate' as const,
                    plannedInLaterTerm: null,
                  },
                ]
              : [],
          backgroundPrerequisites: [],
          corequisites: [],
          reason: 'r',
        })),
      },
    ],
    suggestions: [],
    totalPlannedCredits: 0,
    allEligible: false,
    allOffered: true,
  });

  const order = () => {
    const heading = screen.getByText(/^Suggested for Fall 2026$/);
    const column = heading.closest('div')!.parentElement as HTMLElement;
    return within(column)
      .getAllByRole('button', { name: /^Add / })
      .map((b) => b.getAttribute('aria-label')!.replace(' to your plan', '').replace('Add ', ''));
  };

  beforeEach(() => {
    window.localStorage.clear();
    api.terms.get.mockResolvedValue(detail);
  });

  it('leads with the course that unlocks the rest', async () => {
    api.planner.evaluate.mockResolvedValue(evaluation([]));
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={progs} />);
    await waitFor(() => expect(order()[0]).toBe('GATE'));
  });

  it('does not let unlock count outrank requirement tier', async () => {
    // Ranked on unlocks alone, a business elective that gates two other
    // electives led the MSCS list ahead of its Foundation courses.
    const demoted: ProgramOption[] = [
      { ...progs[0], tiers: { gate: 'elective', elec: 'required', blocked: 'elective' } },
    ];
    api.planner.evaluate.mockResolvedValue(evaluation([]));
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={demoted} />);
    await waitFor(() => expect(order()[0]).toBe('ELEC'));
  });

  it('keeps tier ahead of unlocks once something is completed too', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedIds: ['c-1'],
        termId: 't-1',
        selectedIds: [],
        programId: 'p-1',
        showAllOfferings: false,
      }),
    );
    api.planner.evaluate.mockResolvedValue(evaluation([]));
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={progs} />);
    await waitFor(() => expect(order()[0]).toBe('GATE'));
  });
});

describe('OfferingPlanner — offerings grouped into requirement cards', () => {
  const ids = ['found', 'spec', 'elec', 'stray'];

  const progs: ProgramOption[] = [
    {
      id: 'p-1',
      abbreviation: 'BSCS',
      name: 'Bachelor',
      courseIds: ['found', 'spec', 'elec'],
      tiers: { found: 'required', spec: 'specialization', elec: 'elective' },
      groups: {
        found: 'Foundation Courses',
        spec: 'Specialization — Data Science',
        elec: 'Free Electives',
      },
      // Deliberately out of alphabetical order: Capstone-like groups must not
      // float to the front just because of their name.
      groupOrder: { found: 1, spec: 2, elec: 3 },
      requiredCredits: 36,
      capstoneCourseIds: [],
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedIds: [],
        termId: 't-1',
        selectedIds: [],
        programId: 'p-1',
        // 'stray' has no group in this degree; revealing it is what surfaces
        // the trailing card.
        showAllOfferings: true,
      }),
    );
    api.terms.get.mockResolvedValue({
      id: 't-1',
      name: 'Fall 2026',
      sortOrder: 1,
      courseCount: ids.length,
      inProgramCount: 3,
      courses: ids.map((id) => ({
        id,
        courseCode: id.toUpperCase(),
        title: id,
        creditHours: 3,
        level: 'graduate' as const,
        openForRegistration: true,
        sectionCount: null,
        statusNote: null,
        inProgram: id !== 'stray',
      })),
    });
    // Its own evaluation: the shared helper resolves ids against the module's
    // `courses` fixture, which does not contain these.
    api.planner.evaluate.mockImplementation(({ terms: t }: { terms: { courseIds: string[] }[] }) =>
      Promise.resolve({
        terms: [
          {
            term: 1,
            termId: 't-1',
            termName: 'Fall 2026',
            termCredits: 0,
            courses: t[0].courseIds.map((id) => ({
              courseId: id,
              courseCode: id.toUpperCase(),
              title: id,
              creditHours: 3,
              level: 'graduate' as const,
              eligible: true,
              offered: true,
              openForRegistration: true,
              sectionCount: null,
              statusNote: null,
              registrable: true,
              alreadyCompleted: false,
              satisfiedPrerequisites: [],
              missingPrerequisites: [],
              backgroundPrerequisites: [],
              corequisites: [],
              reason: 'Eligible',
            })),
          },
        ],
        suggestions: [],
        totalPlannedCredits: 0,
        allEligible: true,
        allOffered: true,
      }),
    );
  });

  /** Card headings in the offerings column only — "Your plan" is also an h3. */
  const cardTitles = () => {
    const heading = screen.getByText(/^Offered in Fall 2026$/);
    const column = heading.closest('div')!.parentElement as HTMLElement;
    return within(column)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent!.replace(/\d+$/, '').trim());
  };

  it('renders one card per requirement group, in catalog order', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={progs} />);
    await waitFor(() =>
      expect(cardTitles()).toEqual([
        'Foundation Courses',
        'Specialization — Data Science',
        'Free Electives',
        'Not part of this degree',
      ]),
    );
  });

  it('counts the courses in each card', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={progs} />);
    await waitFor(() => expect(cardTitles()).toContain('Foundation Courses'));
    expect(
      screen.getByRole('heading', { level: 3, name: /Foundation Courses/ }),
    ).toHaveTextContent('1');
  });

  it('files a course the degree has no group for under one trailing card', async () => {
    render(<OfferingPlanner courses={courses} academicTerms={terms} programs={progs} />);
    // Last, so the degree's own groups are read first.
    await waitFor(() => expect(cardTitles().at(-1)).toBe('Not part of this degree'));
  });
});
