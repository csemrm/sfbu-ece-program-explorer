import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { OfferingPlanner } from '../../components/planner/OfferingPlanner';
import type { Course, TermSummary } from '../../lib/api';
import type { ProgramOption } from '../../lib/programScope';

jest.mock('../../lib/api', () => ({
  api: { planner: { evaluate: jest.fn() } },
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
  { id: 'p-1', abbreviation: 'BSCS', name: 'Bachelor of Science', courseIds: ['c-1'] },
];

const evaluationFor = (ids: string[]) => ({
  terms: [
    {
      term: 1,
      termId: 't-1',
      termName: 'Fall 2026',
      termCredits: 3 * ids.length,
      courses: ids.map((id) => ({
        courseId: id,
        courseCode: courses.find((c) => c.id === id)!.courseCode,
        title: 'T',
        creditHours: 3,
        level: 'graduate' as const,
        eligible: true,
        offered: true,
        registrable: true,
        alreadyCompleted: false,
        satisfiedPrerequisites: [],
        missingPrerequisites: [],
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
