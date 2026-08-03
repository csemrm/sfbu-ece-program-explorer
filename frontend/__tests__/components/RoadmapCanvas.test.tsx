import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RoadmapCanvas } from '../../components/roadmap/RoadmapCanvas';
import type { RoadmapPhase } from '../../lib/api';

expect.extend(toHaveNoViolations);

const phase = (id: string, name: string, minCredits: number, codes: string[]): RoadmapPhase => ({
  id,
  name,
  description: null,
  minCredits,
  sortOrder: 1,
  courses: codes.map((c) => ({
    id: `${id}-${c}`,
    courseCode: c,
    title: `Title ${c}`,
    creditHours: 3,
    level: 'graduate',
    description: null,
  })),
});

// MSCS in miniature: a required group, three alternative tracks, a capstone.
const phases: RoadmapPhase[] = [
  phase('g-foundation', 'Foundation Courses', 11, ['CS500']),
  phase('g-cyber', 'Specialization — Cybersecurity', 12, ['CS535']),
  phase('g-data', 'Specialization — Data Science', 12, ['CS550']),
  phase('g-qa', 'Cluster — QA Engineering', 12, ['CS521']),
  phase('g-capstone', 'Capstone', 3, ['CS595']),
];

const renderCanvas = () => render(<RoadmapCanvas phases={phases} academicYear="2025-2026" />);
const track = (name: RegExp) => screen.getByRole('button', { name });

describe('RoadmapCanvas specialization tracks', () => {
  it('shows every track for comparison by default', () => {
    renderCanvas();
    expect(screen.getByText('5 phases')).toBeInTheDocument();
    expect(screen.getByText('CS535')).toBeInTheDocument();
    expect(screen.getByText('CS550')).toBeInTheDocument();
    expect(screen.getByText('CS521')).toBeInTheDocument();
  });

  it('hides the competing tracks once one is chosen', () => {
    renderCanvas();
    fireEvent.click(track(/^Specialization — Data Science$/));

    // The chosen track stays; the other two alternatives go.
    expect(screen.getByText('CS550')).toBeInTheDocument();
    expect(screen.queryByText('CS535')).not.toBeInTheDocument();
    expect(screen.queryByText('CS521')).not.toBeInTheDocument();
    // Non-alternative groups are untouched — they are not a choice.
    expect(screen.getByText('CS500')).toBeInTheDocument();
    expect(screen.getByText('CS595')).toBeInTheDocument();
  });

  it('brings them all back when the same track is deselected', () => {
    renderCanvas();
    fireEvent.click(track(/^Specialization — Data Science$/));
    fireEvent.click(track(/^Specialization — Data Science$/));
    expect(screen.getByText('CS535')).toBeInTheDocument();
    expect(screen.getByText('CS521')).toBeInTheDocument();
  });

  it('switches directly from one track to another', () => {
    renderCanvas();
    fireEvent.click(track(/^Specialization — Data Science$/));
    fireEvent.click(track(/^Cluster — QA Engineering$/));
    expect(screen.getByText('CS521')).toBeInTheDocument();
    expect(screen.queryByText('CS550')).not.toBeInTheDocument();
  });

  it('says how many phases are hidden rather than silently shrinking', () => {
    renderCanvas();
    fireEvent.click(track(/^Specialization — Data Science$/));
    expect(screen.getByText('3 phases of 5')).toBeInTheDocument();
  });

  it('keeps the required credit total whichever track is chosen', () => {
    // The requirement is the same either way — 11 + 12 + 3.
    renderCanvas();
    expect(screen.getByText('26 credits required')).toBeInTheDocument();
    fireEvent.click(track(/^Cluster — QA Engineering$/));
    expect(screen.getByText('26 credits required')).toBeInTheDocument();
  });

  it('reports the choice to assistive technology', () => {
    renderCanvas();
    const button = track(/^Specialization — Data Science$/);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('clears the chosen track on Reset', () => {
    renderCanvas();
    fireEvent.click(track(/^Specialization — Data Science$/));
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('5 phases')).toBeInTheDocument();
    expect(screen.getByText('CS535')).toBeInTheDocument();
  });

  it('has no accessibility violations in either state', async () => {
    const { container } = renderCanvas();
    expect(await axe(container)).toHaveNoViolations();
    fireEvent.click(track(/^Specialization — Data Science$/));
    expect(await axe(container)).toHaveNoViolations();
  });
});
