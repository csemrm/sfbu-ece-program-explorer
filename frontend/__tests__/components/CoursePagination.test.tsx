import { render, screen } from '@testing-library/react';
import { CoursePagination } from '../../components/courses/CoursePagination';

const BASE_PARAMS = { q: 'algo', level: 'undergraduate' };

describe('CoursePagination', () => {
  it('returns null when totalPages <= 1', () => {
    const { container } = render(
      <CoursePagination page={1} totalPages={1} total={5} searchParams={{}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page info text', () => {
    render(<CoursePagination page={2} totalPages={5} total={90} searchParams={{}} />);
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('plural label for multiple courses', () => {
    render(<CoursePagination page={1} totalPages={2} total={30} searchParams={{}} />);
    expect(screen.getByText(/courses/)).toBeInTheDocument();
  });

  it('singular label for 1 course', () => {
    render(<CoursePagination page={1} totalPages={2} total={1} searchParams={{}} />);
    expect(screen.queryByText(/courses/)).not.toBeInTheDocument();
  });

  it('Previous is disabled span on first page', () => {
    render(<CoursePagination page={1} totalPages={3} total={50} searchParams={{}} />);
    const prev = screen.getByText('← Previous');
    expect(prev.tagName).toBe('SPAN');
  });

  it('Previous is a link when not on first page', () => {
    render(<CoursePagination page={2} totalPages={3} total={50} searchParams={{}} />);
    const links = screen.getAllByRole('link');
    const prevLink = links.find((l) => l.textContent?.includes('Previous'));
    expect(prevLink).toBeDefined();
    expect(prevLink).toHaveAttribute('href', '/courses?page=1');
  });

  it('Next is disabled span on last page', () => {
    render(<CoursePagination page={3} totalPages={3} total={50} searchParams={{}} />);
    const next = screen.getByText('Next →');
    expect(next.tagName).toBe('SPAN');
  });

  it('Next is a link when not on last page', () => {
    render(<CoursePagination page={1} totalPages={3} total={50} searchParams={{}} />);
    const links = screen.getAllByRole('link');
    const nextLink = links.find((l) => l.textContent?.includes('Next'));
    expect(nextLink).toBeDefined();
    expect(nextLink).toHaveAttribute('href', '/courses?page=2');
  });

  it('preserves existing search params in Next href', () => {
    render(<CoursePagination page={1} totalPages={2} total={30} searchParams={BASE_PARAMS} />);
    const links = screen.getAllByRole('link');
    const nextLink = links.find((l) => l.textContent?.includes('Next'));
    expect(nextLink?.getAttribute('href')).toContain('q=algo');
    expect(nextLink?.getAttribute('href')).toContain('level=undergraduate');
    expect(nextLink?.getAttribute('href')).toContain('page=2');
  });

  it('preserves existing search params in Previous href', () => {
    render(<CoursePagination page={2} totalPages={3} total={50} searchParams={BASE_PARAMS} />);
    const links = screen.getAllByRole('link');
    const prevLink = links.find((l) => l.textContent?.includes('Previous'));
    expect(prevLink?.getAttribute('href')).toContain('q=algo');
    expect(prevLink?.getAttribute('href')).toContain('page=1');
  });
});
