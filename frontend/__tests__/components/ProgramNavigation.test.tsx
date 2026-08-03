import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProgramNavigation } from '../../components/programs/ProgramNavigation';

expect.extend(toHaveNoViolations);

const renderNav = () => render(<ProgramNavigation programId="p-1" abbreviation="BSCS" />);

describe('ProgramNavigation', () => {
  it('links to the roadmap, the graph and the planner', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /Curriculum Roadmap/ })).toHaveAttribute(
      'href',
      '/programs/p-1/roadmap',
    );
    expect(screen.getByRole('link', { name: /Prerequisite Graph/ })).toHaveAttribute(
      'href',
      '/programs/p-1/graph',
    );
    expect(screen.getByRole('link', { name: /Semester Planner/ })).toHaveAttribute(
      'href',
      '/plan?program=p-1',
    );
  });

  it('carries the program so the planner opens on this degree', () => {
    // Without the query the planner would restore whatever degree the browser
    // last stored, which is the wrong answer to a click from a BSCS page.
    renderNav();
    const href = screen.getByRole('link', { name: /Semester Planner/ }).getAttribute('href');
    expect(href).toContain('program=p-1');
  });

  it('names the degree in each card', () => {
    renderNav();
    expect(screen.getAllByText(/BSCS/).length).toBeGreaterThanOrEqual(3);
  });

  it('has no accessibility violations', async () => {
    const { container } = renderNav();
    expect(await axe(container)).toHaveNoViolations();
  });
});
