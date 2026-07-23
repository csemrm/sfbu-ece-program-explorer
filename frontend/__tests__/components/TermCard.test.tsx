import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TermCard } from '../../components/planner/TermCard';
import type { Course, EvaluatedTerm, TermSummary } from '../../lib/api';

expect.extend(toHaveNoViolations);

const COURSES: Course[] = [
  {
    id: 'c-0000-0000-0000-000000000001',
    courseCode: 'CS250',
    title: 'Data Structures',
    description: null,
    creditHours: '3.00',
    level: 'undergraduate',
  } as Course,
];

const TERMS: TermSummary[] = [
  { id: 'fall26', name: 'Fall 2026', sortOrder: 1, courseCount: 2, offeredCourseIds: [] },
  { id: 'spring27', name: 'Spring 2027', sortOrder: 2, courseCount: 1, offeredCourseIds: [] },
];

const evaluation = (offered: boolean | null): EvaluatedTerm => ({
  term: 1,
  termId: offered === null ? null : 'spring27',
  termName: offered === null ? null : 'Spring 2027',
  termCredits: 3,
  courses: [
    {
      courseId: COURSES[0].id,
      courseCode: 'CS250',
      title: 'Data Structures',
      creditHours: 3,
      level: 'undergraduate',
      eligible: true,
      offered,
      registrable: offered !== false,
      alreadyCompleted: false,
      satisfiedPrerequisites: [],
      missingPrerequisites: [],
      corequisites: [],
      reason: 'Eligible — all prerequisites are satisfied.',
    },
  ],
});

const noop = () => {};

const defaults = {
  index: 0,
  courseIds: [] as string[],
  courses: COURSES,
  academicTerms: TERMS,
  termId: null as string | null,
  onChangeTerm: noop,
  onAddCourse: noop,
  onRemoveCourse: noop,
  onRemoveTerm: noop,
};

describe('TermCard', () => {
  it('renders the term selector with every academic term', () => {
    render(<TermCard {...defaults} />);
    const select = screen.getByLabelText('Academic term');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fall 2026' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Spring 2027' })).toBeInTheDocument();
  });

  it('offers an explicit opt-out of the availability check', () => {
    render(<TermCard {...defaults} />);
    expect(
      screen.getByRole('option', { name: 'Any term (no availability check)' }),
    ).toBeInTheDocument();
  });

  it('hides the selector entirely when no terms are curated', () => {
    render(<TermCard {...defaults} academicTerms={[]} />);
    expect(screen.queryByLabelText('Academic term')).not.toBeInTheDocument();
  });

  it('reports the selected term id on change', () => {
    const onChangeTerm = jest.fn();
    render(<TermCard {...defaults} onChangeTerm={onChangeTerm} />);

    fireEvent.change(screen.getByLabelText('Academic term'), { target: { value: 'fall26' } });
    expect(onChangeTerm).toHaveBeenCalledWith('fall26');
  });

  it('reports null when the user clears the term back to "Any term"', () => {
    const onChangeTerm = jest.fn();
    render(<TermCard {...defaults} termId="fall26" onChangeTerm={onChangeTerm} />);

    fireEvent.change(screen.getByLabelText('Academic term'), { target: { value: '' } });
    expect(onChangeTerm).toHaveBeenCalledWith(null);
  });

  it('summarises unoffered courses in the term header', () => {
    render(
      <TermCard
        {...defaults}
        courseIds={[COURSES[0].id]}
        termId="spring27"
        evaluation={evaluation(false)}
      />,
    );
    expect(screen.getByText(/1 not offered/)).toBeInTheDocument();
  });

  it('does not mention offerings when the term is unbound', () => {
    render(
      <TermCard {...defaults} courseIds={[COURSES[0].id]} evaluation={evaluation(null)} />,
    );
    expect(screen.queryByText(/not offered/)).not.toBeInTheDocument();
  });

  it('flags a term whose schedule has not been published', () => {
    const uncurated: TermSummary[] = [
      { id: 'spring27', name: 'Spring 2027', sortOrder: 2, courseCount: 0, offeredCourseIds: [] },
    ];
    render(<TermCard {...defaults} academicTerms={uncurated} termId="spring27" />);

    expect(
      screen.getByRole('option', { name: /Spring 2027 — schedule not published yet/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No schedule published for this term yet/)).toBeInTheDocument();
  });

  it('says offerings are checked when the term does have a schedule', () => {
    render(<TermCard {...defaults} termId="fall26" />);
    expect(screen.getByText(/Courses are checked against this term/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <TermCard
        {...defaults}
        courseIds={[COURSES[0].id]}
        termId="spring27"
        evaluation={evaluation(false)}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
