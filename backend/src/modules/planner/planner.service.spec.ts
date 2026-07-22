import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { Course, CourseLevel } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';

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

describe('PlannerService', () => {
  let service: PlannerService;

  beforeEach(async () => {
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
});
