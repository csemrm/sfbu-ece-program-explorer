import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProgramCard } from '../../components/programs/ProgramCard';
import type { Program } from '../../lib/api';

expect.extend(toHaveNoViolations);

const bscsProgram: Program = {
  id: 'b1c2d3e4-0000-0000-0000-000000000001',
  name: 'Bachelor of Science in Computer Science',
  abbreviation: 'BSCS',
  description: 'An undergraduate CS degree.',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mscsProgram: Program = {
  id: 'b1c2d3e4-0000-0000-0000-000000000002',
  name: 'Master of Science in Computer Science',
  abbreviation: 'MSCS',
  description: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mseeProgram: Program = {
  id: 'b1c2d3e4-0000-0000-0000-000000000003',
  name: 'Master of Science in Electrical Engineering',
  abbreviation: 'MSEE',
  description: 'Graduate EE degree.',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('ProgramCard', () => {
  it('renders program name', () => {
    render(<ProgramCard program={bscsProgram} />);
    expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
  });

  it('renders abbreviation badge', () => {
    render(<ProgramCard program={bscsProgram} />);
    expect(screen.getByText('BSCS')).toBeInTheDocument();
  });

  it('renders degree label for BSCS', () => {
    render(<ProgramCard program={bscsProgram} />);
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
  });

  it('renders degree label for MSCS', () => {
    render(<ProgramCard program={mscsProgram} />);
    expect(screen.getByText('Master of Science')).toBeInTheDocument();
  });

  it('renders credit total for BSCS', () => {
    render(<ProgramCard program={bscsProgram} />);
    expect(screen.getByText('120 credits')).toBeInTheDocument();
  });

  it('renders credit total for MSCS', () => {
    render(<ProgramCard program={mscsProgram} />);
    expect(screen.getByText('36 credits')).toBeInTheDocument();
  });

  it('renders credit total for MSEE', () => {
    render(<ProgramCard program={mseeProgram} />);
    expect(screen.getByText('36 credits')).toBeInTheDocument();
  });

  it('renders description when present', () => {
    render(<ProgramCard program={bscsProgram} />);
    expect(screen.getByText('An undergraduate CS degree.')).toBeInTheDocument();
  });

  it('omits description when null', () => {
    render(<ProgramCard program={mscsProgram} />);
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
  });

  it('links to program detail page', () => {
    render(<ProgramCard program={bscsProgram} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/programs/${bscsProgram.id}`);
  });

  it('renders Explore program CTA', () => {
    render(<ProgramCard program={bscsProgram} />);
    expect(screen.getByText('Explore program')).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<ProgramCard program={bscsProgram} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
