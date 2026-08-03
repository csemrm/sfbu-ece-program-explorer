import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CourseVerdictRow } from '../../components/planner/CourseVerdictRow';
import type { EvaluatedCourse } from '../../lib/api';

expect.extend(toHaveNoViolations);

const base: EvaluatedCourse = {
  courseId: 'c-0000-0000-0000-000000000001',
  courseCode: 'CS250',
  title: 'Data Structures',
  creditHours: 3,
  level: 'undergraduate',
  eligible: true,
  offered: null,
  registrable: true,
  openForRegistration: true,
  sectionCount: null,
  statusNote: null,
  alreadyCompleted: false,
  satisfiedPrerequisites: [],
  missingPrerequisites: [],
  backgroundPrerequisites: [],
  corequisites: [],
  reason: 'Eligible — all prerequisites are satisfied.',
};

const eligibleUnbound = base;

const eligibleOffered: EvaluatedCourse = { ...base, offered: true };

const eligibleNotOffered: EvaluatedCourse = {
  ...base,
  offered: false,
  registrable: false,
  openForRegistration: true,
  sectionCount: null,
  statusNote: null,
  reason: 'Prerequisites satisfied, but this course is not offered in Spring 2027.',
};

const blocked: EvaluatedCourse = {
  ...base,
  eligible: false,
  registrable: false,
  openForRegistration: true,
  sectionCount: null,
  statusNote: null,
  missingPrerequisites: [
    {
      id: 'c-0000-0000-0000-000000000002',
      courseCode: 'CS100',
      title: 'Intro',
      creditHours: 3,
      level: 'undergraduate',
      plannedInLaterTerm: null,
    },
  ],
  backgroundPrerequisites: [],
  reason: 'Not eligible — missing prerequisite: CS100.',
};

describe('CourseVerdictRow', () => {
  it('renders the course code, title and credits', () => {
    render(<CourseVerdictRow course={eligibleUnbound} onRemove={() => {}} />);
    expect(screen.getByText('CS250')).toBeInTheDocument();
    expect(screen.getByText('Data Structures')).toBeInTheDocument();
    expect(screen.getByText('3 cr')).toBeInTheDocument();
  });

  it('shows no "Not offered" badge when the term is unbound', () => {
    render(<CourseVerdictRow course={eligibleUnbound} onRemove={() => {}} />);
    expect(screen.queryByText('Not offered')).not.toBeInTheDocument();
  });

  it('shows no "Not offered" badge when the course is offered', () => {
    render(<CourseVerdictRow course={eligibleOffered} onRemove={() => {}} />);
    expect(screen.queryByText('Not offered')).not.toBeInTheDocument();
  });

  it('shows the "Not offered" badge when the course is not offered that term', () => {
    render(<CourseVerdictRow course={eligibleNotOffered} onRemove={() => {}} />);
    expect(screen.getByText('Not offered')).toBeInTheDocument();
  });

  it('renders the not-offered reason from the API', () => {
    render(<CourseVerdictRow course={eligibleNotOffered} onRemove={() => {}} />);
    expect(screen.getByText(/not offered in Spring 2027/)).toBeInTheDocument();
  });

  it('distinguishes "not offered" from "not eligible" for screen readers', () => {
    const { unmount } = render(
      <CourseVerdictRow course={eligibleNotOffered} onRemove={() => {}} />,
    );
    expect(screen.getByText('Not offered this term:')).toBeInTheDocument();
    unmount();

    render(<CourseVerdictRow course={blocked} onRemove={() => {}} />);
    expect(screen.getByText('Not eligible:')).toBeInTheDocument();
  });

  it('announces an eligible course as eligible', () => {
    render(<CourseVerdictRow course={eligibleOffered} onRemove={() => {}} />);
    expect(screen.getByText('Eligible:')).toBeInTheDocument();
  });

  it('keeps the blocked styling when a course is both blocked and unoffered', () => {
    render(<CourseVerdictRow course={{ ...blocked, offered: false }} onRemove={() => {}} />);
    // The prerequisite failure is the more actionable problem, so it wins the
    // row treatment — but the availability badge is still shown.
    expect(screen.getByText('Not eligible:')).toBeInTheDocument();
    expect(screen.getByText('Not offered')).toBeInTheDocument();
  });

  it('exposes an accessible remove control', () => {
    render(<CourseVerdictRow course={eligibleUnbound} onRemove={() => {}} />);
    expect(screen.getByRole('button', { name: 'Remove CS250 from this term' })).toBeInTheDocument();
  });

  it('has no accessibility violations across verdict states', async () => {
    for (const course of [eligibleOffered, eligibleNotOffered, blocked]) {
      const { container, unmount } = render(
        <ul>
          <CourseVerdictRow course={course} onRemove={() => {}} />
        </ul>,
      );
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
