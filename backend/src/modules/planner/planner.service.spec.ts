import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { Course, CourseLevel } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';

const course = (id: string, courseCode: string, creditHours = 3): Course =>
  ({
    id,
    courseCode,
    title: `${courseCode} Title`,
    description: null,
    creditHours,
    level: CourseLevel.UNDERGRADUATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as Course;

// CS100 → CS200 → CS300 chain; CS250 requires CS100; LAB201 is a coreq of CS200.
const CATALOG = [
  course('c100', 'CS100'),
  course('c200', 'CS200'),
  course('c250', 'CS250'),
  course('c300', 'CS300'),
  course('lab201', 'LAB201', 1),
];

const PREREQS = [
  { courseId: 'c200', prerequisiteCourseId: 'c100' },
  { courseId: 'c250', prerequisiteCourseId: 'c100' },
  { courseId: 'c300', prerequisiteCourseId: 'c200' },
];

const COREQS = [{ courseId: 'c200', corequisiteCourseId: 'lab201' }];

// Fall offers the intro courses, Spring the follow-ons. CS300 is offered in
// neither, so it exercises the "planned but never offered" path.
const TERMS = [
  { id: 'fall26', name: 'Fall 2026', sortOrder: 1 },
  { id: 'spring27', name: 'Spring 2027', sortOrder: 2 },
];

const OFFERINGS = [
  { termId: 'fall26', courseId: 'c100' },
  { termId: 'fall26', courseId: 'c250' },
  { termId: 'spring27', courseId: 'c200' },
  { termId: 'spring27', courseId: 'lab201' },
];

describe('PlannerService', () => {
  let service: PlannerService;
  let termRepo: { find: jest.Mock };
  let offeringRepo: { find: jest.Mock };
  /** Course ids the mocked program "contains"; drives the scoping tests. */
  let programCourseIds: string[];

  beforeEach(async () => {
    // The service filters by `In(termIds)`; the mocks return the full fixture
    // and let the service's own bookkeeping do the narrowing.
    termRepo = { find: jest.fn().mockResolvedValue(TERMS) };
    offeringRepo = { find: jest.fn().mockResolvedValue(OFFERINGS) };
    // CS100 is deliberately absent: it stands for a prerequisite belonging to a
    // different degree, which the programId path must treat as background.
    programCourseIds = ['c200', 'c250', 'c300', 'lab201'];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlannerService,
        {
          provide: getRepositoryToken(Course),
          useValue: { find: jest.fn().mockResolvedValue(CATALOG) },
        },
        {
          provide: getRepositoryToken(Prerequisite),
          useValue: { find: jest.fn().mockResolvedValue(PREREQS) },
        },
        {
          provide: getRepositoryToken(Corequisite),
          useValue: { find: jest.fn().mockResolvedValue(COREQS) },
        },
        { provide: getRepositoryToken(AcademicTerm), useValue: termRepo },
        { provide: getRepositoryToken(CourseOffering), useValue: offeringRepo },
        {
          provide: getRepositoryToken(ProgramRequirement),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              getRawMany: jest
                .fn()
                .mockImplementation(() =>
                  Promise.resolve(
                    programCourseIds.map((courseId) => ({ courseId })),
                  ),
                ),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<PlannerService>(PlannerService);
  });

  it('marks a course eligible when its prerequisite is already completed', async () => {
    const result = await service.evaluate({
      completedCourseIds: ['c100', 'lab201'],
      terms: [{ courseIds: ['c250'] }],
    });

    const cs250 = result.terms[0].courses[0];
    expect(cs250.eligible).toBe(true);
    expect(cs250.missingPrerequisites).toHaveLength(0);
    expect(cs250.satisfiedPrerequisites[0].courseCode).toBe('CS100');
    expect(result.allEligible).toBe(true);
  });

  it('blocks a course whose prerequisite is not completed', async () => {
    const result = await service.evaluate({
      completedCourseIds: [],
      terms: [{ courseIds: ['c250'] }],
    });

    const cs250 = result.terms[0].courses[0];
    expect(cs250.eligible).toBe(false);
    expect(cs250.missingPrerequisites.map((m) => m.courseCode)).toEqual([
      'CS100',
    ]);
    expect(cs250.reason).toContain('CS100');
    expect(result.allEligible).toBe(false);
  });

  it('feeds an earlier term into a later term', async () => {
    const result = await service.evaluate({
      completedCourseIds: ['lab201'],
      terms: [{ courseIds: ['c100'] }, { courseIds: ['c200'] }],
    });

    expect(result.terms[0].courses[0].eligible).toBe(true); // CS100 (no prereqs)
    expect(result.terms[1].courses[0].eligible).toBe(true); // CS200 (CS100 from term 1)
  });

  it('flags a prerequisite scheduled in a later term as an ordering conflict', async () => {
    const result = await service.evaluate({
      completedCourseIds: [],
      terms: [{ courseIds: ['c200'] }, { courseIds: ['c100'] }],
    });

    const cs200 = result.terms[0].courses[0];
    const missing = cs200.missingPrerequisites.find(
      (m) => m.courseCode === 'CS100',
    );
    expect(cs200.eligible).toBe(false);
    expect(missing?.plannedInLaterTerm).toBe(2);
    expect(cs200.reason).toContain('too late');
  });

  it('satisfies a corequisite taken in the same term', async () => {
    const result = await service.evaluate({
      completedCourseIds: ['c100'],
      terms: [{ courseIds: ['c200', 'lab201'] }],
    });

    const cs200 = result.terms[0].courses.find(
      (c) => c.courseCode === 'CS200',
    )!;
    const lab = cs200.corequisites.find((c) => c.courseCode === 'LAB201')!;
    expect(lab.status).toBe('same-term');
    expect(cs200.eligible).toBe(true);
  });

  it('blocks a course whose corequisite is unscheduled', async () => {
    const result = await service.evaluate({
      completedCourseIds: ['c100'],
      terms: [{ courseIds: ['c200'] }],
    });

    const cs200 = result.terms[0].courses[0];
    expect(cs200.corequisites[0].status).toBe('unmet');
    expect(cs200.eligible).toBe(false);
  });

  it('suggests newly unlocked courses and computes credit totals', async () => {
    const result = await service.evaluate({
      completedCourseIds: [],
      terms: [{ courseIds: ['c100'] }],
    });

    const codes = result.suggestions.map((s) => s.courseCode);
    expect(codes).toEqual(expect.arrayContaining(['CS200', 'CS250']));
    expect(codes).not.toContain('CS100'); // already planned
    expect(codes).not.toContain('CS300'); // still needs CS200
    expect(result.totalPlannedCredits).toBe(3);
  });

  it('rejects unknown course ids', async () => {
    await expect(
      service.evaluate({ completedCourseIds: ['nope'], terms: [] }),
    ).rejects.toThrow(BadRequestException);
  });

  describe('offering awareness', () => {
    it('reports offered = null and skips offering queries for unbound terms', async () => {
      const result = await service.evaluate({
        completedCourseIds: ['c100'],
        terms: [{ courseIds: ['c250'] }],
      });

      expect(result.terms[0].termId).toBeNull();
      expect(result.terms[0].termName).toBeNull();
      expect(result.terms[0].courses[0].offered).toBeNull();
      expect(result.allOffered).toBe(true); // vacuously true
      expect(termRepo.find).not.toHaveBeenCalled();
      expect(offeringRepo.find).not.toHaveBeenCalled();
    });

    it('marks a course offered in its bound term as registrable', async () => {
      const result = await service.evaluate({
        completedCourseIds: ['c100'],
        terms: [{ termId: 'fall26', courseIds: ['c250'] }],
      });

      const cs250 = result.terms[0].courses[0];
      expect(result.terms[0].termName).toBe('Fall 2026');
      expect(cs250.eligible).toBe(true);
      expect(cs250.offered).toBe(true);
      expect(cs250.registrable).toBe(true);
      expect(result.allOffered).toBe(true);
    });

    it('keeps eligible true but registrable false when the course is not offered', async () => {
      // CS250's prerequisite is met, but Spring 2027 does not offer it.
      const result = await service.evaluate({
        completedCourseIds: ['c100'],
        terms: [{ termId: 'spring27', courseIds: ['c250'] }],
      });

      const cs250 = result.terms[0].courses[0];
      expect(cs250.eligible).toBe(true);
      expect(cs250.offered).toBe(false);
      expect(cs250.registrable).toBe(false);
      expect(cs250.reason).toBe(
        'Prerequisites satisfied, but this course is not offered in Spring 2027.',
      );
      expect(result.allEligible).toBe(true);
      expect(result.allOffered).toBe(false);
    });

    it('reports both failures when a course is neither eligible nor offered', async () => {
      // CS300 needs CS200 (not taken) and is offered in no term at all.
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [{ termId: 'fall26', courseIds: ['c300'] }],
      });

      const cs300 = result.terms[0].courses[0];
      expect(cs300.eligible).toBe(false);
      expect(cs300.offered).toBe(false);
      expect(cs300.registrable).toBe(false);
      expect(cs300.reason).toContain('missing prerequisite');
      expect(cs300.reason).toContain('not offered in Fall 2026');
    });

    it('evaluates each term against its own offerings', async () => {
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [
          { termId: 'fall26', courseIds: ['c100'] },
          { termId: 'spring27', courseIds: ['c200', 'lab201'] },
        ],
      });

      expect(result.terms[0].courses[0].offered).toBe(true); // CS100 in Fall
      expect(result.terms[1].courses.map((c) => c.offered)).toEqual([
        true,
        true,
      ]); // CS200 + LAB201 in Spring
      expect(result.allEligible).toBe(true);
      expect(result.allOffered).toBe(true);
    });

    it('supports mixing bound and unbound terms in one plan', async () => {
      const result = await service.evaluate({
        completedCourseIds: ['c100'],
        terms: [
          { termId: 'spring27', courseIds: ['c250'] }, // not offered
          { courseIds: ['c300'] }, // unbound → unknown
        ],
      });

      expect(result.terms[0].courses[0].offered).toBe(false);
      expect(result.terms[1].courses[0].offered).toBeNull();
      expect(result.allOffered).toBe(false);
    });

    it('annotates suggestions with the bound terms that offer them, offered first', async () => {
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [{ termId: 'fall26', courseIds: ['c100'] }],
      });

      const cs250 = result.suggestions.find((s) => s.courseCode === 'CS250');
      const cs200 = result.suggestions.find((s) => s.courseCode === 'CS200');
      expect(cs250?.offeredInTerms).toEqual([
        { termId: 'fall26', termName: 'Fall 2026' },
      ]);
      // CS200 is unlocked by the plan but Fall 2026 does not offer it.
      expect(cs200?.offeredInTerms).toEqual([]);
      // Offerable suggestions are ranked ahead of unofferable ones.
      expect(result.suggestions[0].courseCode).toBe('CS250');
    });

    it('leaves suggestions unannotated when no term is bound', async () => {
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [{ courseIds: ['c100'] }],
      });

      expect(
        result.suggestions.every((s) => s.offeredInTerms.length === 0),
      ).toBe(true);
    });

    it('rejects unknown academic term ids rather than passing vacuously', async () => {
      termRepo.find.mockResolvedValue([]);

      await expect(
        service.evaluate({
          completedCourseIds: [],
          terms: [{ termId: 'ghost-term', courseIds: ['c100'] }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('treats a term with no curated offerings as unknown, not as offering nothing', async () => {
      // An empty schedule means nobody has curated the term yet. Reporting
      // `false` would tell the student every course is unavailable.
      offeringRepo.find.mockResolvedValue([]);

      const result = await service.evaluate({
        completedCourseIds: ['c100'],
        terms: [{ termId: 'fall26', courseIds: ['c250'] }],
      });

      expect(result.terms[0].courses[0].offered).toBeNull();
      expect(result.terms[0].courses[0].registrable).toBe(true);
      expect(result.allOffered).toBe(true);
      // The term is still resolved and named, so the UI can show the binding.
      expect(result.terms[0].termName).toBe('Fall 2026');
    });

    it('still reports offered = false for a curated term that omits the course', async () => {
      // Distinct from the empty-schedule case above: Spring 2027 has a
      // schedule, and CS250 is simply not on it.
      const result = await service.evaluate({
        completedCourseIds: ['c100'],
        terms: [{ termId: 'spring27', courseIds: ['c250'] }],
      });

      expect(result.terms[0].courses[0].offered).toBe(false);
      expect(result.allOffered).toBe(false);
    });
  });

  describe('degree-scoped prerequisites', () => {
    it('blocks on a prerequisite from the same degree', async () => {
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [{ courseIds: ['c300'] }],
        programId: '11111111-1111-4111-8111-111111111111',
      });

      const cs300 = result.terms[0].courses[0];
      expect(cs300.missingPrerequisites.map((p) => p.courseCode)).toEqual([
        'CS200',
      ]);
      expect(cs300.backgroundPrerequisites).toHaveLength(0);
      expect(cs300.eligible).toBe(false);
    });

    it('treats a prerequisite from another degree as background, not a blocker', async () => {
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [{ courseIds: ['c250'] }],
        programId: '11111111-1111-4111-8111-111111111111',
      });

      const cs250 = result.terms[0].courses[0];
      // CS100 is outside the program: reported, but it does not block.
      expect(cs250.missingPrerequisites).toHaveLength(0);
      expect(cs250.backgroundPrerequisites.map((p) => p.courseCode)).toEqual([
        'CS100',
      ]);
      expect(cs250.eligible).toBe(true);
    });

    it('still blocks on that same prerequisite when no degree is given', async () => {
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [{ courseIds: ['c250'] }],
      });

      const cs250 = result.terms[0].courses[0];
      expect(cs250.missingPrerequisites.map((p) => p.courseCode)).toEqual([
        'CS100',
      ]);
      expect(cs250.backgroundPrerequisites).toHaveLength(0);
      expect(cs250.eligible).toBe(false);
    });

    it('does not excuse everything when the degree has no course requirements', async () => {
      // An unmodelled program must not silently clear the whole catalog.
      programCourseIds = [];
      const result = await service.evaluate({
        completedCourseIds: [],
        terms: [{ courseIds: ['c250'] }],
        programId: '11111111-1111-4111-8111-111111111111',
      });

      const cs250 = result.terms[0].courses[0];
      expect(cs250.missingPrerequisites.map((p) => p.courseCode)).toEqual([
        'CS100',
      ]);
      expect(cs250.eligible).toBe(false);
    });
  });
});
