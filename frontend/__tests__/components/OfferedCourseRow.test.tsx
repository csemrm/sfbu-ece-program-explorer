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

const blocked: EvaluatedCourse = {
  ...eligible,
  courseId: 'c-2',
  courseCode: 'CS570',
  title: 'Big Data Processing & Analytics',
  eligible: false,
  registrable: false,
  openForRegistration: true,
  sectionCount: null,
  statusNote: null,
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
  backgroundPrerequisites: [],
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

  it('does not let a blocked course be added to the plan', () => {
    const onToggle = jest.fn();
    renderRow({ course: blocked, onToggle });
    const box = screen.getByRole('checkbox');
    expect(box).toBeDisabled();
    fireEvent.click(box);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('still lets a blocked course be removed once chosen', () => {
    // A course can become blocked after it was picked — the student unmarks its
    // prerequisite, or the registrar cancels it — and must not be stranded in
    // the plan with no way to take it out.
    const onToggle = jest.fn();
    renderRow({ course: blocked, selected: true, onToggle });
    const box = screen.getByRole('checkbox');
    expect(box).not.toBeDisabled();
    fireEvent.click(box);
    expect(onToggle).toHaveBeenCalled();
  });

  it('still lets a cancelled course be removed once chosen', () => {
    const onToggle = jest.fn();
    renderRow({
      course: { ...eligible, openForRegistration: false, statusNote: 'Cancelled' },
      selected: true,
      onToggle,
    });
    expect(screen.getByRole('checkbox')).not.toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox'));
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

  it('marks a course that runs but is closed to registration', () => {
    renderRow({
      course: {
        ...eligible,
        openForRegistration: false,
        registrable: false,
        statusNote: 'Registration closed by the registrar',
      },
    });
    expect(screen.getByText('Registration closed')).toBeInTheDocument();
    expect(screen.getByText(/Registration closed by the registrar/)).toBeInTheDocument();
  });

  it('calls a cancelled course cancelled and quotes the registrar verbatim', () => {
    renderRow({
      course: {
        ...eligible,
        openForRegistration: false,
        registrable: false,
        statusNote: 'Cancelled due to low enrollment',
      },
    });
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText(/Cancelled due to low enrollment/)).toBeInTheDocument();
  });

  it('links the closed reason to the checkbox for screen readers', () => {
    renderRow({
      course: { ...eligible, openForRegistration: false, statusNote: 'Cancelled — no room' },
    });
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'offered-c-1-reason');
    expect(screen.getByText(/^Cancelled:$/)).toBeInTheDocument();
  });

  it('lets an unmet prerequisite win the row over a closed registration', () => {
    // Both are true; the prerequisite is the one the student can act on.
    renderRow({ course: { ...blocked, openForRegistration: false, statusNote: 'Cancelled' } });
    expect(screen.getByText('Prerequisites pending')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText(/Needs/)).toBeInTheDocument();
  });

  it('shows the section count only when more than one runs', () => {
    const { unmount } = renderRow({ course: { ...eligible, sectionCount: 1 } });
    expect(screen.queryByText(/section/)).not.toBeInTheDocument();
    unmount();

    renderRow({ course: { ...eligible, sectionCount: 3 } });
    expect(screen.getByText('3 sections')).toBeInTheDocument();
  });

  it('has no accessibility violations when closed or cancelled', async () => {
    const { container } = renderRow({
      course: {
        ...eligible,
        openForRegistration: false,
        statusNote: 'Cancelled due to low enrollment',
      },
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('makes a cancelled course unselectable — no waiver revives it', () => {
    const onToggle = jest.fn();
    renderRow({
      course: {
        ...eligible,
        openForRegistration: false,
        statusNote: 'Cancelled due to low enrollment',
      },
      onToggle,
    });
    const box = screen.getByRole('checkbox');
    expect(box).toBeDisabled();
    fireEvent.click(box);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('names what is missing rather than only disabling the row', () => {
    // Gating without saying why would leave the student with no route forward;
    // marking the named prerequisite as completed unblocks this row.
    renderRow({ course: blocked });
    expect(screen.getByText('Prerequisites pending')).toBeInTheDocument();
    expect(screen.getByText('CS515')).toBeInTheDocument();
  });

  it('flags a capstone taken before the final semester, naming the shortfall', () => {
    renderRow({ course: eligible, capstoneShortfall: 21 });
    expect(screen.getByText('Final semester')).toBeInTheDocument();
    expect(screen.getByText(/21 more credits needed/)).toBeInTheDocument();
  });

  it('leaves an early capstone selectable — "most coursework" is an advisor call', () => {
    // Unlike a cancelled section, this is a soft catalog rule the planner has no
    // authority to enforce.
    const onToggle = jest.fn();
    renderRow({ course: eligible, capstoneShortfall: 21, onToggle });
    const box = screen.getByRole('checkbox');
    expect(box).not.toBeDisabled();
    fireEvent.click(box);
    expect(onToggle).toHaveBeenCalled();
  });

  it('says nothing once the student has the credits', () => {
    renderRow({ course: eligible, capstoneShortfall: null });
    expect(screen.queryByText('Final semester')).not.toBeInTheDocument();
  });

  it('has no accessibility violations when flagged for the final semester', async () => {
    const { container } = renderRow({ course: eligible, capstoneShortfall: 21 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
