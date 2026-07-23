import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { KnowledgeAreaCard } from '../../components/knowledge-areas/KnowledgeAreaCard';
import type { KnowledgeAreaSummary } from '../../lib/api';

expect.extend(toHaveNoViolations);

const mixedArea: KnowledgeAreaSummary = {
  id: 'ka-0000-0000-0000-000000000001',
  name: 'Computer Networks',
  description: 'Network architecture and protocols, routing, and wireless networking.',
  courseCount: 7,
  undergraduateCount: 3,
  graduateCount: 4,
};

const gradOnlyArea: KnowledgeAreaSummary = {
  id: 'ka-0000-0000-0000-000000000002',
  name: 'Embedded Systems & IoT',
  description: null,
  courseCount: 5,
  undergraduateCount: 0,
  graduateCount: 5,
};

const emptyArea: KnowledgeAreaSummary = {
  id: 'ka-0000-0000-0000-000000000003',
  name: 'Quantum Computing',
  description: 'Not yet offered.',
  courseCount: 0,
  undergraduateCount: 0,
  graduateCount: 0,
};

describe('KnowledgeAreaCard', () => {
  it('renders the area name', () => {
    render(<KnowledgeAreaCard area={mixedArea} />);
    expect(screen.getByText('Computer Networks')).toBeInTheDocument();
  });

  it('renders the description when present', () => {
    render(<KnowledgeAreaCard area={mixedArea} />);
    expect(screen.getByText(/Network architecture and protocols/)).toBeInTheDocument();
  });

  it('omits the description when null', () => {
    render(<KnowledgeAreaCard area={gradOnlyArea} />);
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
  });

  it('pluralizes the course count', () => {
    render(<KnowledgeAreaCard area={mixedArea} />);
    expect(screen.getByText('7 courses')).toBeInTheDocument();
  });

  it('uses the singular form for a single course', () => {
    render(<KnowledgeAreaCard area={{ ...mixedArea, courseCount: 1 }} />);
    expect(screen.getByText('1 course')).toBeInTheDocument();
  });

  it('renders the undergraduate and graduate split', () => {
    render(<KnowledgeAreaCard area={mixedArea} />);
    expect(screen.getByText('3 UG')).toBeInTheDocument();
    expect(screen.getByText('4 Grad')).toBeInTheDocument();
  });

  it('describes the level split for assistive technology', () => {
    render(<KnowledgeAreaCard area={mixedArea} />);
    expect(
      screen.getByLabelText('3 undergraduate and 4 graduate courses')
    ).toBeInTheDocument();
  });

  it('renders a graduate-only area without an undergraduate segment', () => {
    render(<KnowledgeAreaCard area={gradOnlyArea} />);
    expect(screen.getByText('0 UG')).toBeInTheDocument();
    expect(screen.getByText('5 Grad')).toBeInTheDocument();
  });

  it('renders an area with no courses without dividing by zero', () => {
    render(<KnowledgeAreaCard area={emptyArea} />);
    expect(screen.getByText('0 courses')).toBeInTheDocument();
    expect(screen.getByText('0 UG')).toBeInTheDocument();
  });

  it('links to the area detail page', () => {
    render(<KnowledgeAreaCard area={mixedArea} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/knowledge-areas/${mixedArea.id}`
    );
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<KnowledgeAreaCard area={mixedArea} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
