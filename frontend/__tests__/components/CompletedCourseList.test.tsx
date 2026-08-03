import { fireEvent, render, screen } from '@testing-library/react';
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
  course('c-cs380', 'CS380', 'Operating Systems'),
  course('c-cs200', 'CS200', 'Discrete Logic'),
  course('c-cs230l', 'CS230L', 'Linux & Shell Scripting Lab', '1.0'),
  course('c-ee310', 'EE310', 'Signals and Systems'),
  course('c-ce305', 'CE305', 'Computer Organization'),
  course('c-math203', 'MATH203', 'Linear Algebra'),
];

const renderList = (props: Partial<React.ComponentProps<typeof CompletedCourseList>> = {}) =>
  render(
    <CompletedCourseList courses={courses} completedIds={[]} onToggle={() => {}} {...props} />,
  );

const codes = () =>
  screen
    .getAllByRole('checkbox')
    .map((box) => box.closest('label')?.querySelector('span')?.textContent);

describe('CompletedCourseList', () => {
  it('lists every course as one flat, code-ordered checklist', () => {
    renderList();
    expect(codes()).toEqual(['CE305', 'CS200', 'CS230L', 'CS380', 'EE310', 'MATH203']);
  });

  it('shows every course without needing a section opened first', () => {
    renderList();
    // Nothing is collapsed, so a course from any subject is immediately visible.
    expect(screen.getByLabelText(/EE310/)).toBeInTheDocument();
    expect(screen.getByLabelText(/MATH203/)).toBeInTheDocument();
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

  it('filters by code and by title', () => {
    renderList();
    const filter = screen.getByLabelText('Filter courses by code or title');

    fireEvent.change(filter, { target: { value: 'EE310' } });
    expect(codes()).toEqual(['EE310']);

    fireEvent.change(filter, { target: { value: 'computer organization' } });
    expect(codes()).toEqual(['CE305']);
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
    expect(screen.getAllByText('3 cr').length).toBeGreaterThan(0);
    expect(screen.getByText('1 cr')).toBeInTheDocument();
    expect(screen.queryByText('3.0 cr')).not.toBeInTheDocument();
  });

  it('has no accessibility violations, listed or filtered', async () => {
    const { container } = renderList({ completedIds: ['c-cs380'] });
    expect(await axe(container)).toHaveNoViolations();

    fireEvent.change(screen.getByLabelText('Filter courses by code or title'), {
      target: { value: 'cs' },
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('floats marked courses to the top so they are easy to correct', () => {
    renderList({ completedIds: ['c-math203', 'c-cs380'] });
    // Marked first (code-ordered among themselves), then the rest.
    expect(codes()).toEqual(['CS380', 'MATH203', 'CE305', 'CS200', 'CS230L', 'EE310']);
  });

  it('keeps marked courses on top while filtering', () => {
    renderList({ completedIds: ['c-cs380'] });
    fireEvent.change(screen.getByLabelText('Filter courses by code or title'), {
      target: { value: 'cs' },
    });
    expect(codes()[0]).toBe('CS380');
  });
});
