import {
  courseIdsFromRoadmap,
  scopeFor,
  tierForGroup,
  tiersFromRoadmap,
  type ProgramOption,
} from '../../lib/programScope';
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
  tiers: {},
  groups: {},
  groupOrder: {},
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

describe('tierForGroup', () => {
  it('treats groups everyone must take as required', () => {
    for (const name of [
      'Core Courses',
      'Foundation Courses',
      'Preparation Courses',
      'Capstone',
      'General Education',
    ]) {
      expect(tierForGroup(name)).toBe('required');
    }
  });

  it('treats a track or cluster as a specialization choice', () => {
    expect(tierForGroup('Specialization — Cybersecurity')).toBe('specialization');
    expect(tierForGroup('Cluster — Multicore Computing')).toBe('specialization');
  });

  it('treats any electives group as elective, even a specialization one', () => {
    // "Specialization Electives" is still an open credit requirement.
    expect(tierForGroup('Specialization Electives')).toBe('elective');
    expect(tierForGroup('Free Electives')).toBe('elective');
    expect(tierForGroup('Graduate Electives')).toBe('elective');
  });
});

describe('tiersFromRoadmap', () => {
  const roadmapWith = (
    phases: { name: string; ids: string[] }[],
  ): Parameters<typeof tiersFromRoadmap>[0] =>
    ({
      programId: 'p',
      programName: 'P',
      programAbbreviation: 'P',
      catalogYearId: null,
      academicYear: null,
      phases: phases.map((ph, i) => ({
        id: `g${i}`,
        name: ph.name,
        description: null,
        minCredits: null,
        sortOrder: i,
        courses: ph.ids.map((id) => ({
          id,
          courseCode: id.toUpperCase(),
          title: id,
          creditHours: 3,
          level: 'graduate' as const,
          description: null,
        })),
      })),
    }) as Parameters<typeof tiersFromRoadmap>[0];

  it('classifies each course by its group', () => {
    const tiers = tiersFromRoadmap(
      roadmapWith([
        { name: 'Foundation Courses', ids: ['a'] },
        { name: 'Cluster — QA Engineering', ids: ['b'] },
        { name: 'Graduate Electives', ids: ['c'] },
      ]),
    );
    expect(tiers).toEqual({ a: 'required', b: 'specialization', c: 'elective' });
  });

  it('keeps the firmest classification when a course sits in several groups', () => {
    // CS550 is both a Data Science specialization course and a cluster course;
    // the stronger obligation is what binds the student.
    const tiers = tiersFromRoadmap(
      roadmapWith([
        { name: 'Graduate Electives', ids: ['cs550'] },
        { name: 'Specialization — Data Science', ids: ['cs550'] },
        { name: 'Core Courses', ids: ['cs500'] },
        { name: 'Free Electives', ids: ['cs500'] },
      ]),
    );
    expect(tiers.cs550).toBe('specialization');
    expect(tiers.cs500).toBe('required');
  });
});
