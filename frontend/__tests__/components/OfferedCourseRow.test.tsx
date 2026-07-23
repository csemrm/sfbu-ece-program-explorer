import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { OfferedCourseRow } from '../../components/planner/OfferedCourseRow';
import type { EvaluatedCourse } from '../../lib/api';

expect.extend(toHaveNoViolations);

const eligible: EvaluatedCourse = {
  courseId: 'c-1',
  courseCode: 'CS501',
  title: 'Practical Application of Algorithms',
  creditHours: 3,
  level: 'graduate',
  eligible: true,
  offered: true,
  registrable: true,
  alreadyCompleted: false,
  satisfiedPrerequisites: [],
  missingPrerequisites: [],
  corequisites: [],
  reason: 'Eligible — all prerequisites are satisfied.',
};

const blocked: EvaluatedCourse = {
  ...eligible,
  courseId: 'c-2',
  courseCode: 'CS570',
  title: 'Big Data Processing & Analytics',
  eligible: false,
  registrable: false,
  missingPrerequisites: [
    {
      id: 'p-1',
      courseCode: 'CS515',
      title: 'Advanced Computer Networks',
      creditHours: 3,
      level: 'graduate',
      plannedInLaterTerm: null,
    },
  ],
  reason: 'Not eligible — missing prerequisite: CS515.',
};

const noop = () => {};

const renderRow = (props: Partial<React.ComponentProps<typeof OfferedCourseRow>> = {}) =>
  render(
    <ul>
      <OfferedCourseRow
        course={eligible}
        selected={false}
        onToggle={noop}
        unselectedCorequisites={[]}
        {...props}
      />
    </ul>,
  );

describe('OfferedCourseRow', () => {
  it('renders code, title and credits', () => {
    renderRow();
    expect(screen.getByText('CS501')).toBeInTheDocument();
    expect(screen.getByText('Practical Application of Algorithms')).toBeInTheDocument();
    expect(screen.getByText('3 cr')).toBeInTheDocument();
  });

  it('shows no pending-prerequisite highlight for an eligible course', () => {
    renderRow();
    expect(screen.queryByText('Prerequisites pending')).not.toBeInTheDocument();
  });

  it('highlights a course with pending prerequisites and names them', () => {
    renderRow({ course: blocked });
    expect(screen.getByText('Prerequisites pending')).toBeInTheDocument();
    expect(screen.getByText('CS515')).toBeInTheDocument();
  });

  it('links the blocked reason to the checkbox for screen readers', () => {
    renderRow({ course: blocked });
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-describedby', 'offered-c-2-reason');
    expect(screen.getByText('Prerequisites pending:')).toBeInTheDocument();
  });

  it('leaves a blocked course selectable — the planner advises, it does not gate', () => {
    const onToggle = jest.fn();
    renderRow({ course: blocked, onToggle });
    const box = screen.getByRole('checkbox');
    expect(box).not.toBeDisabled();
    fireEvent.click(box);
    expect(onToggle).toHaveBeenCalled();
  });

  it('reflects and toggles selection', () => {
    const onToggle = jest.fn();
    renderRow({ selected: true, onToggle });
    expect(screen.getByRole('checkbox')).toBeChecked();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('warns about a corequisite only once the course is selected', () => {
    const { unmount } = renderRow({ unselectedCorequisites: ['CS500L'] });
    expect(screen.queryByText(/required alongside/)).not.toBeInTheDocument();
    unmount();

    renderRow({ selected: true, unselectedCorequisites: ['CS500L'] });
    expect(screen.getByText(/Also select CS500L/)).toBeInTheDocument();
  });

  it('flags a course that is already marked completed', () => {
    renderRow({ course: { ...eligible, alreadyCompleted: true } });
    expect(screen.getByText(/already marked this course as completed/)).toBeInTheDocument();
  });

  it('has no accessibility violations in either state', async () => {
    for (const course of [eligible, blocked]) {
      const { container, unmount } = renderRow({ course });
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
