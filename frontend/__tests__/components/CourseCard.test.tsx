import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CourseCard } from '../../components/courses/CourseCard';
import type { Course } from '../../lib/api';

expect.extend(toHaveNoViolations);

const ugCourse: Course = {
  id: 'a1b2c3d4-0000-0000-0000-000000000001',
  courseCode: 'CS101',
  title: 'Introduction to Computer Science',
  level: 'undergraduate',
  creditHours: '3',
  description: 'Fundamental concepts of CS.',
};

const gradCourse: Course = {
  id: 'a1b2c3d4-0000-0000-0000-000000000002',
  courseCode: 'CS501',
  title: 'Advanced Algorithms',
  level: 'graduate',
  creditHours: '3',
  description: null,
};

describe('CourseCard', () => {
  it('renders course code', () => {
    render(<CourseCard course={ugCourse} />);
    expect(screen.getByText('CS101')).toBeInTheDocument();
  });

  it('renders course title', () => {
    render(<CourseCard course={ugCourse} />);
    expect(screen.getByText('Introduction to Computer Science')).toBeInTheDocument();
  });

  it('renders UG badge for undergraduate course', () => {
    render(<CourseCard course={ugCourse} />);
    expect(screen.getByText('UG')).toBeInTheDocument();
  });

  it('renders Grad badge for graduate course', () => {
    render(<CourseCard course={gradCourse} />);
    expect(screen.getByText('Grad')).toBeInTheDocument();
  });

  it('renders credit hours', () => {
    render(<CourseCard course={ugCourse} />);
    expect(screen.getByText('3 cr')).toBeInTheDocument();
  });

  it('renders description when present', () => {
    render(<CourseCard course={ugCourse} />);
    expect(screen.getByText('Fundamental concepts of CS.')).toBeInTheDocument();
  });

  it('omits description when null', () => {
    render(<CourseCard course={gradCourse} />);
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
  });

  it('links to course detail page', () => {
    render(<CourseCard course={ugCourse} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/courses/${ugCourse.id}`);
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<CourseCard course={ugCourse} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
