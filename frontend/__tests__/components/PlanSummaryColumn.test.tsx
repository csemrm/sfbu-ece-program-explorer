import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PlanSummaryColumn } from '../../components/planner/PlanSummaryColumn';
import type { EvaluatedCourse } from '../../lib/api';

expect.extend(toHaveNoViolations);

const base: EvaluatedCourse = {
  courseId: 'c-1',
  courseCode: 'CS501',
  title: 'Advanced Operating Systems',
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

const lab: EvaluatedCourse = { ...base, courseId: 'c-2', courseCode: 'CS500L', creditHours: 1 };

const blocked: EvaluatedCourse = {
  ...base,
  courseId: 'c-3',
  courseCode: 'CS550',
  title: 'Big Data Systems',
  eligible: false,
  registrable: false,
  openForRegistration: true,
  sectionCount: null,
  statusNote: null,
  missingPrerequisites: [
    {
      id: 'p-1',
      courseCode: 'CS455G',
      title: 'Database Systems',
      creditHours: 3,
      level: 'graduate',
      plannedInLaterTerm: null,
    },
  ],
  backgroundPrerequisites: [],
};

const renderColumn = (props: Partial<React.ComponentProps<typeof PlanSummaryColumn>> = {}) =>
  render(
    <PlanSummaryColumn
      termName="Fall 2026"
      programLabel="MSCS — Master of Science in Computer Science"
      recommended={[]}
      selected={[]}
      completedCodes={[]}
      onAdd={() => {}}
      {...props}
    />,
  );

describe('PlanSummaryColumn', () => {
  it('titles itself after the selected term', () => {
    renderColumn();
    expect(screen.getByText('Suggested for Fall 2026')).toBeInTheDocument();
  });

  it('lists recommended courses and adds one on click', () => {
    const onAdd = jest.fn();
    renderColumn({ recommended: [base], onAdd });
    expect(screen.getByText('Advanced Operating Systems')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Add CS501/ }));
    expect(onAdd).toHaveBeenCalledWith('c-1');
  });

  it('prompts for selections while the plan is empty', () => {
    renderColumn();
    expect(screen.getByText(/Tick courses in the Offered column/)).toBeInTheDocument();
  });

  it('totals the credits of the chosen courses', () => {
    renderColumn({ selected: [base, lab] });
    expect(screen.getByText(/2 courses · 4 cr/)).toBeInTheDocument();
  });

  it('names the missing prerequisite of a blocked selection', () => {
    renderColumn({ selected: [blocked] });
    expect(screen.getByText(/CS550 is blocked — needs CS455G/)).toBeInTheDocument();
  });

  it('distinguishes "nothing ready yet" from "you already took everything ready"', () => {
    const { unmount } = renderColumn();
    expect(screen.getByText(/mark more completed courses/)).toBeInTheDocument();
    unmount();

    renderColumn({ selected: [base] });
    expect(screen.getByText(/chosen every course that is ready/)).toBeInTheDocument();
  });

  it('offers the PDF download only once there is a plan to print', () => {
    const { unmount } = renderColumn();
    expect(screen.queryByRole('button', { name: /Download as PDF/ })).not.toBeInTheDocument();
    unmount();

    renderColumn({ selected: [base] });
    expect(screen.getByRole('button', { name: /Download as PDF/ })).toBeInTheDocument();
  });

  it('opens the print dialog when the download button is pressed', () => {
    jest.useFakeTimers();
    const print = jest.fn();
    Object.defineProperty(window, 'print', { value: print, writable: true });

    renderColumn({ selected: [base] });
    fireEvent.click(screen.getByRole('button', { name: /Download as PDF/ }));
    jest.runAllTimers();

    expect(print).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('builds a print sheet carrying the plan, the degree and the completed courses', () => {
    const { container } = renderColumn({
      selected: [base, blocked],
      completedCodes: ['CS380', 'CS455G'],
    });
    const sheet = container.querySelector('.plan-print') as HTMLElement;

    expect(sheet).toBeInTheDocument();
    expect(sheet).toHaveTextContent('Fall 2026 Registration Plan');
    expect(sheet).toHaveTextContent('MSCS');
    expect(sheet).toHaveTextContent('Planned courses (2) — 6 credits');
    expect(sheet).toHaveTextContent('Blocked — needs CS455G');
    expect(sheet).toHaveTextContent('CS380, CS455G');
    // The sheet must not overstate what this tool is.
    expect(sheet).toHaveTextContent(/Advisory only/);
  });

  it('has no accessibility violations', async () => {
    const { container } = renderColumn({ recommended: [lab], selected: [base, blocked] });
    expect(await axe(container)).toHaveNoViolations();
  });
});
