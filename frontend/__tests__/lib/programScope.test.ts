import { courseIdsFromRoadmap, scopeFor, type ProgramOption } from '../../lib/programScope';
import type { ProgramRoadmap } from '../../lib/api';

const roadmap = (phases: { id: string; courseIds: string[] }[]): ProgramRoadmap => ({
  programId: 'p-1',
  programName: 'Master of Science in Computer Science',
  programAbbreviation: 'MSCS',
  catalogYearId: 'cy-1',
  academicYear: '2025-2026',
  phases: phases.map((p, i) => ({
    id: p.id,
    name: `Phase ${i + 1}`,
    description: null,
    minCredits: null,
    sortOrder: i + 1,
    courses: p.courseIds.map((id) => ({
      id,
      courseCode: id.toUpperCase(),
      title: `Course ${id}`,
      creditHours: 3,
      level: 'graduate' as const,
      description: null,
    })),
  })),
});

const program = (courseIds: string[]): ProgramOption => ({
  id: 'p-1',
  abbreviation: 'MSCS',
  name: 'Master of Science in Computer Science',
  courseIds,
});

describe('courseIdsFromRoadmap', () => {
  it('collects course ids across every phase', () => {
    const ids = courseIdsFromRoadmap(
      roadmap([
        { id: 'g1', courseIds: ['a', 'b'] },
        { id: 'g2', courseIds: ['c'] },
      ]),
    );
    expect(ids.sort()).toEqual(['a', 'b', 'c']);
  });

  it('de-duplicates a course that appears in more than one phase', () => {
    const ids = courseIdsFromRoadmap(
      roadmap([
        { id: 'g1', courseIds: ['a'] },
        { id: 'g2', courseIds: ['a'] },
      ]),
    );
    expect(ids).toEqual(['a']);
  });

  it('tolerates a phase with no courses', () => {
    expect(courseIdsFromRoadmap(roadmap([{ id: 'g1', courseIds: [] }]))).toEqual([]);
  });
});

describe('scopeFor', () => {
  it('returns the program course ids as a set', () => {
    const scope = scopeFor(program(['a', 'b']));
    expect(scope?.has('a')).toBe(true);
    expect(scope?.has('z')).toBe(false);
  });

  it('does not scope when no program is chosen', () => {
    expect(scopeFor(null)).toBeNull();
    expect(scopeFor(undefined)).toBeNull();
  });

  it('does not scope a program with no roadmap courses — an empty planner reads as a bug', () => {
    expect(scopeFor(program([]))).toBeNull();
  });
});
