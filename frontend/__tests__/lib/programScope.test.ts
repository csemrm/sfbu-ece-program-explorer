import {
  courseIdsFromRoadmap,
  scopeFor,
  capstoneCourseIdsFromRoadmap,
  isAlternativeGroup,
  requiredCreditsFromRoadmap,
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
  requiredCredits: 36,
  capstoneCourseIds: [],
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

describe('requiredCreditsFromRoadmap', () => {
  const phase = (name: string, minCredits: number | null, ids: string[] = []) => ({
    id: name,
    name,
    description: null,
    minCredits,
    sortOrder: 0,
    courses: ids.map((id) => ({
      id,
      courseCode: id.toUpperCase(),
      title: id,
      creditHours: 3,
      level: 'graduate' as const,
      description: null,
    })),
  });
  const roadmap = (phases: ReturnType<typeof phase>[]) =>
    ({
      programId: 'p',
      programName: 'P',
      programAbbreviation: 'P',
      catalogYearId: null,
      academicYear: null,
      phases,
    }) as Parameters<typeof requiredCreditsFromRoadmap>[0];

  it('counts one alternative group, not every specialization and cluster', () => {
    // MSCS in miniature: three concentrations and three clusters, all
    // alternatives satisfying the same 12-credit requirement. Counting them all
    // would report 72 credits against a stated 36.
    const total = requiredCreditsFromRoadmap(
      roadmap([
        phase('Foundation Courses', 11),
        phase('Specialization — Cybersecurity', 12),
        phase('Specialization — Data Science', 12),
        phase('Cluster — QA Engineering', 12),
        phase('Cluster — Mobile Application Technologies', 12),
        phase('Graduate Electives', 10),
        phase('Capstone', 3),
      ]),
    );
    expect(total).toBe(36);
  });

  it('counts every non-alternative group, including electives', () => {
    const total = requiredCreditsFromRoadmap(
      roadmap([
        phase('General Education', 30),
        phase('Core Courses', 48),
        phase('Specialization Electives', 15),
        phase('Free Electives', 15),
        phase('Preparation Courses', 12),
      ]),
    );
    // "Specialization Electives" is an open credit requirement, not an
    // alternative track, so it counts alongside Free Electives.
    expect(total).toBe(120);
  });

  it('falls back to the sum of a group with no stated credits', () => {
    expect(requiredCreditsFromRoadmap(roadmap([phase('Core Courses', null, ['a', 'b'])]))).toBe(6);
  });
});

describe('isAlternativeGroup', () => {
  it('treats concentrations and clusters as alternatives', () => {
    expect(isAlternativeGroup('Specialization — Data Science')).toBe(true);
    expect(isAlternativeGroup('Cluster — QA Engineering')).toBe(true);
  });

  it('does not treat an electives group as one', () => {
    expect(isAlternativeGroup('Specialization Electives')).toBe(false);
    expect(isAlternativeGroup('Free Electives')).toBe(false);
    expect(isAlternativeGroup('Core Courses')).toBe(false);
  });
});

describe('capstoneCourseIdsFromRoadmap', () => {
  it('collects the courses in a capstone group', () => {
    const ids = capstoneCourseIdsFromRoadmap({
      programId: 'p',
      programName: 'P',
      programAbbreviation: 'P',
      catalogYearId: null,
      academicYear: null,
      phases: [
        {
          id: 'g1',
          name: 'Capstone',
          description: null,
          minCredits: 3,
          sortOrder: 9,
          courses: [
            {
              id: 'cs595',
              courseCode: 'CS595',
              title: 'Capstone',
              creditHours: 3,
              level: 'graduate',
              description: null,
            },
          ],
        },
        {
          id: 'g2',
          name: 'Core Courses',
          description: null,
          minCredits: 48,
          sortOrder: 1,
          courses: [
            {
              id: 'cs200',
              courseCode: 'CS200',
              title: 'Discrete',
              creditHours: 3,
              level: 'undergraduate',
              description: null,
            },
          ],
        },
      ],
    } as Parameters<typeof capstoneCourseIdsFromRoadmap>[0]);
    expect(ids).toEqual(['cs595']);
  });
});
