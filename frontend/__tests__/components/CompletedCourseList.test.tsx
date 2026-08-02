import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CompletedCourseList } from '../../components/planner/CompletedCourseList';
import type { Course } from '../../lib/api';

expect.extend(toHaveNoViolations);

const course = (
  id: string,
  courseCode: string,
  title: string,
  creditHours = '3.0',
  level: Course['level'] = 'undergraduate',
): Course => ({ id, courseCode, title, description: null, creditHours, level });

const courses: Course[] = [
  course('c-cs380', 'CS380', 'Analysis of Algorithms'),
  course('c-cs200', 'CS200', 'Introduction to Computer Science'),
  course('c-cs230l', 'CS230L', 'Object-Oriented Programming Lab', '1.0'),
  course('c-ee310', 'EE310', 'Signals and Systems'),
  course('c-ce305', 'CE305', 'Digital Logic Design'),
  course('c-math200', 'MATH200', 'Discrete Mathematics'),
];

const renderList = (props: Partial<React.ComponentProps<typeof CompletedCourseList>> = {}) =>
  render(
    <CompletedCourseList courses={courses} completedIds={[]} onToggle={() => {}} {...props} />,
  );

/** Expand a collapsed subject section by its header button. */
const openSubject = (subject: string) =>
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${subject}`) }));

describe('CompletedCourseList', () => {
  it('groups courses by subject, largest-first by catalog convention', () => {
    renderList();
    const headers = screen
      .getAllByRole('button')
      .map((b) => b.textContent ?? '')
      .filter((t) => /Computer Science|Engineering|Mathematics/.test(t));
    expect(headers[0]).toMatch(/^CS/);
    expect(headers.some((h) => h.startsWith('CE'))).toBe(true);
    expect(headers.some((h) => h.startsWith('EE'))).toBe(true);
    expect(headers.some((h) => h.startsWith('MATH'))).toBe(true);
  });

  it('expands the first subject and collapses the rest so the panel stays scannable', () => {
    renderList();
    expect(screen.getByRole('button', { name: /^CS/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /^EE/ })).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getByLabelText(/CS200/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/EE310/)).not.toBeInTheDocument();
  });

  it('reveals a collapsed subject when its header is clicked', () => {
    renderList();
    expect(screen.queryByLabelText(/EE310/)).not.toBeInTheDocument();
    openSubject('EE');
    expect(screen.getByLabelText(/EE310/)).toBeInTheDocument();
  });

  it('sorts courses within a subject by code', () => {
    renderList();
    const cs = screen.getByRole('button', { name: /^CS/ }).closest('section');
    const codes = within(cs as HTMLElement)
      .getAllByRole('checkbox')
      .map((box) => box.closest('label')?.querySelector('span')?.textContent);
    expect(codes).toEqual(['CS200', 'CS230L', 'CS380']);
  });

  it('marks a course on click and unmarks one already completed', () => {
    const onToggle = jest.fn();
    const { rerender } = renderList({ onToggle });

    fireEvent.click(screen.getByLabelText(/CS200/));
    expect(onToggle).toHaveBeenCalledWith('c-cs200');

    rerender(
      <CompletedCourseList courses={courses} completedIds={['c-cs200']} onToggle={onToggle} />,
    );
    const box = screen.getByLabelText(/CS200/) as HTMLInputElement;
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(onToggle).toHaveBeenLastCalledWith('c-cs200');
  });

  it('reflects completed courses as checked', () => {
    renderList({ completedIds: ['c-cs380'] });
    expect(screen.getByLabelText(/CS380/)).toBeChecked();
    expect(screen.getByLabelText(/CS200/)).not.toBeChecked();
  });

  it('shows a per-subject count of what is already marked', () => {
    renderList({ completedIds: ['c-cs380', 'c-cs200'] });
    expect(screen.getByRole('button', { name: /^CS/ })).toHaveTextContent('2 ✓');
  });

  it('filters by code and by title, opening every matching subject', () => {
    renderList();
    const filter = screen.getByLabelText('Filter courses by code or title');

    // A match inside a collapsed subject must still surface.
    fireEvent.change(filter, { target: { value: 'EE310' } });
    expect(screen.getByLabelText(/EE310/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/CS200/)).not.toBeInTheDocument();

    fireEvent.change(filter, { target: { value: 'digital logic' } });
    expect(screen.getByLabelText(/CE305/)).toBeInTheDocument();
  });

  it('reports when nothing matches instead of rendering an empty panel', () => {
    renderList();
    fireEvent.change(screen.getByLabelText('Filter courses by code or title'), {
      target: { value: 'zzzz' },
    });
    expect(screen.getByText(/No courses match/)).toBeInTheDocument();
  });

  it('normalises decimal credit strings so both planner columns agree', () => {
    renderList();
    const cs = screen.getByRole('button', { name: /^CS/ }).closest('section');
    expect(within(cs as HTMLElement).getAllByText('3 cr').length).toBeGreaterThan(0);
    expect(within(cs as HTMLElement).getByText('1 cr')).toBeInTheDocument();
    expect(within(cs as HTMLElement).queryByText('3.0 cr')).not.toBeInTheDocument();
  });

  it('has no accessibility violations, collapsed or filtered', async () => {
    const { container } = renderList({ completedIds: ['c-cs380'] });
    expect(await axe(container)).toHaveNoViolations();

    fireEvent.change(screen.getByLabelText('Filter courses by code or title'), {
      target: { value: 'cs' },
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
