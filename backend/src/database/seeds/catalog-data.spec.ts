import {
  COURSES,
  PREREQUISITES,
  COREQUISITES,
  KNOWLEDGE_AREAS,
  COURSE_KNOWLEDGE_AREAS,
  PROGRAMS,
  COURSE_OFFERINGS,
} from './catalog-data';

/**
 * Referential integrity for the seed itself.
 *
 * The seeder skips anything it cannot resolve and logs a warning, so a typo in a
 * course code becomes a silently missing prerequisite rather than a failure.
 * These checks turn that into a test failure instead — which is how 59 wrong
 * course titles survived to v1.5.1 unnoticed.
 */
describe('catalog seed data', () => {
  const codes = new Set(COURSES.map((c) => c.courseCode));
  const areaNames = new Set(KNOWLEDGE_AREAS.map((a) => a.name));

  it('has no duplicate course codes', () => {
    expect(codes.size).toBe(COURSES.length);
  });

  it('gives every course a title and positive credit hours', () => {
    for (const c of COURSES) {
      expect(c.title.trim().length).toBeGreaterThan(0);
      expect(c.title.length).toBeLessThanOrEqual(255); // varchar(255)
      expect(c.creditHours).toBeGreaterThan(0);
      expect(c.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('resolves every prerequisite to a seeded course', () => {
    for (const p of PREREQUISITES) {
      expect(codes.has(p.courseCode)).toBe(true);
      expect(codes.has(p.prerequisiteCode)).toBe(true);
      expect(p.courseCode).not.toBe(p.prerequisiteCode);
    }
  });

  it('resolves every corequisite to a seeded course', () => {
    for (const c of COREQUISITES) {
      expect(codes.has(c.courseCode)).toBe(true);
      expect(codes.has(c.corequisiteCode)).toBe(true);
      expect(c.courseCode).not.toBe(c.corequisiteCode);
    }
  });

  it('does not state a corequisite pair in both directions', () => {
    const seen = new Set<string>();
    for (const c of COREQUISITES) {
      const key = [c.courseCode, c.corequisiteCode].sort().join('|');
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('has no prerequisite cycles', () => {
    const edges = new Map<string, string[]>();
    for (const p of PREREQUISITES) {
      edges.set(p.courseCode, [
        ...(edges.get(p.courseCode) ?? []),
        p.prerequisiteCode,
      ]);
    }
    const state = new Map<string, 'visiting' | 'done'>();
    const walk = (node: string, trail: string[]): void => {
      if (state.get(node) === 'done') return;
      if (state.get(node) === 'visiting') {
        throw new Error(`prerequisite cycle: ${[...trail, node].join(' → ')}`);
      }
      state.set(node, 'visiting');
      for (const next of edges.get(node) ?? []) walk(next, [...trail, node]);
      state.set(node, 'done');
    };
    expect(() => {
      for (const code of edges.keys()) walk(code, []);
    }).not.toThrow();
  });

  it('maps knowledge areas to seeded courses and declared areas', () => {
    for (const m of COURSE_KNOWLEDGE_AREAS) {
      expect(codes.has(m.courseCode)).toBe(true);
      expect(m.knowledgeAreaNames.length).toBeGreaterThan(0);
      for (const name of m.knowledgeAreaNames) {
        expect(areaNames.has(name)).toBe(true);
      }
    }
  });

  it('maps each course to a knowledge area at most once', () => {
    const seen = new Set<string>();
    for (const m of COURSE_KNOWLEDGE_AREAS) {
      expect(seen.has(m.courseCode)).toBe(false);
      seen.add(m.courseCode);
      expect(new Set(m.knowledgeAreaNames).size).toBe(
        m.knowledgeAreaNames.length,
      );
    }
  });

  it('resolves every program requirement to a seeded course', () => {
    for (const program of PROGRAMS) {
      for (const group of program.requirementGroups) {
        for (const req of group.requirements) {
          if (req.courseCode !== null) {
            expect(codes.has(req.courseCode)).toBe(true);
          } else {
            // A placeholder stands for unenumerated credit and must say how much.
            expect(req.minCredits).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('orders requirement groups uniquely within each program', () => {
    for (const program of PROGRAMS) {
      const orders = program.requirementGroups.map((g) => g.sortOrder);
      expect(new Set(orders).size).toBe(orders.length);
      const names = program.requirementGroups.map((g) => g.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it('resolves every seeded offering to a seeded course', () => {
    for (const offering of COURSE_OFFERINGS) {
      for (const offered of offering.courses) {
        expect(codes.has(offered.courseCode)).toBe(true);
      }
    }
  });

  it('lists each course at most once per term', () => {
    for (const offering of COURSE_OFFERINGS) {
      const seen = offering.courses.map((c) => c.courseCode);
      expect(new Set(seen).size).toBe(seen.length);
    }
  });

  it('closes registration on every offering the registrar marked cancelled', () => {
    for (const offering of COURSE_OFFERINGS) {
      for (const offered of offering.courses) {
        if (offered.statusNote && /cancel/i.test(offered.statusNote)) {
          // A cancelled course that still reads as open would send a student to
          // enrol in something that will not run.
          expect(offered.openForRegistration).toBe(false);
        }
        if (offered.sectionCount !== undefined) {
          expect(offered.sectionCount).toBeGreaterThan(0);
        }
      }
    }
  });

  it('keeps the BSCS general-education group populated', () => {
    const bscs = PROGRAMS.find((p) => p.abbreviation === 'BSCS');
    const ge = bscs?.requirementGroups.find(
      (g) => g.name === 'General Education',
    );
    // The catalog's Agility Praxis Pathway is ten courses; an empty group here
    // was how the program page came to show no general education at all.
    expect(ge?.requirements.filter((r) => r.courseCode).length).toBe(10);
  });
});
