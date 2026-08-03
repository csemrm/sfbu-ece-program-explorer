import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TermsService } from './terms.service';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import { Course, CourseLevel } from '../../database/entities/course.entity';
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

describe('TermsService', () => {
  let service: TermsService;
  let termRepo: { find: jest.Mock; findOne: jest.Mock };
  let offeringRepo: { find: jest.Mock };
  let courseRepo: { find: jest.Mock };
  /** Course ids the mocked program "contains"; drives the scoping tests. */
  let programCourseIds: string[];

  beforeEach(async () => {
    programCourseIds = [];
    termRepo = { find: jest.fn(), findOne: jest.fn() };
    offeringRepo = { find: jest.fn() };
    courseRepo = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TermsService,
        { provide: getRepositoryToken(AcademicTerm), useValue: termRepo },
        { provide: getRepositoryToken(CourseOffering), useValue: offeringRepo },
        { provide: getRepositoryToken(Course), useValue: courseRepo },
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

    service = module.get<TermsService>(TermsService);
  });

  describe('findAll()', () => {
    it('returns terms with their offered course ids and counts', async () => {
      termRepo.find.mockResolvedValue([
        { id: 'fall26', name: 'Fall 2026', sortOrder: 1 },
        { id: 'spring27', name: 'Spring 2027', sortOrder: 2 },
      ]);
      offeringRepo.find.mockResolvedValue([
        { termId: 'fall26', courseId: 'c100' },
        { termId: 'fall26', courseId: 'c250' },
        { termId: 'spring27', courseId: 'c200' },
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        name: 'Fall 2026',
        courseCount: 2,
        offeredCourseIds: ['c100', 'c250'],
      });
      expect(result[1]).toMatchObject({
        name: 'Spring 2027',
        courseCount: 1,
      });
    });

    it('returns a term with no offerings as an empty list, not a missing key', async () => {
      termRepo.find.mockResolvedValue([
        { id: 'fall26', name: 'Fall 2026', sortOrder: 1 },
      ]);
      offeringRepo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result[0].offeredCourseIds).toEqual([]);
      expect(result[0].courseCount).toBe(0);
    });

    it('short-circuits the offerings query when there are no terms', async () => {
      termRepo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(offeringRepo.find).not.toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('returns the term with its courses', async () => {
      termRepo.findOne.mockResolvedValue({
        id: 'fall26',
        name: 'Fall 2026',
        sortOrder: 1,
      });
      offeringRepo.find.mockResolvedValue([
        { termId: 'fall26', courseId: 'c100' },
      ]);
      courseRepo.find.mockResolvedValue([course('c100', 'CS100')]);

      const result = await service.findOne('fall26');

      expect(result.name).toBe('Fall 2026');
      expect(result.courseCount).toBe(1);
      expect(result.courses[0].courseCode).toBe('CS100');
    });

    it('coerces decimal creditHours to a number', async () => {
      termRepo.findOne.mockResolvedValue({
        id: 'fall26',
        name: 'Fall 2026',
        sortOrder: 1,
      });
      offeringRepo.find.mockResolvedValue([
        { termId: 'fall26', courseId: 'c100' },
      ]);
      // TypeORM returns decimal columns as strings.
      courseRepo.find.mockResolvedValue([
        { ...course('c100', 'CS100'), creditHours: '3.00' },
      ]);

      const result = await service.findOne('fall26');

      expect(result.courses[0].creditHours).toBe(3);
    });

    it('skips the course lookup when the term offers nothing', async () => {
      termRepo.findOne.mockResolvedValue({
        id: 'fall26',
        name: 'Fall 2026',
        sortOrder: 1,
      });
      offeringRepo.find.mockResolvedValue([]);

      const result = await service.findOne('fall26');

      expect(result.courses).toEqual([]);
      expect(courseRepo.find).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for an unknown term', async () => {
      termRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('ghost')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne() program scoping', () => {
    const TERM = { id: 't1', name: 'Fall 2026', sortOrder: 1 };

    beforeEach(() => {
      termRepo.findOne.mockResolvedValue(TERM);
      offeringRepo.find.mockResolvedValue([
        {
          termId: 't1',
          courseId: 'c1',
          openForRegistration: true,
          sectionCount: 2,
          statusNote: null,
        },
        {
          termId: 't1',
          courseId: 'c2',
          openForRegistration: false,
          sectionCount: 1,
          statusNote: 'Cancelled due to low enrollment',
        },
      ]);
      courseRepo.find.mockResolvedValue([
        course('c1', 'CS500'),
        course('c2', 'MGT510'),
      ]);
    });

    it('carries the registration status published by the registrar', async () => {
      const detail = await service.findOne('t1');
      const [cs500, mgt510] = detail.courses;

      expect(cs500.openForRegistration).toBe(true);
      expect(cs500.sectionCount).toBe(2);
      expect(mgt510.openForRegistration).toBe(false);
      expect(mgt510.statusNote).toBe('Cancelled due to low enrollment');
    });

    it('treats every course as in-program when no degree is requested', async () => {
      const detail = await service.findOne('t1');
      expect(detail.courses.every((c) => c.inProgram)).toBe(true);
      expect(detail.inProgramCount).toBe(2);
      expect(detail.courseCount).toBe(2);
    });

    it('flags out-of-degree courses but still returns them', async () => {
      programCourseIds = ['c1'];
      const detail = await service.findOne('t1', 'p1');

      // Both are returned: the planner reports how many fall outside the degree
      // and offers to reveal them, which needs the whole term in one response.
      expect(detail.courseCount).toBe(2);
      expect(detail.inProgramCount).toBe(1);
      expect(
        detail.courses.find((c) => c.courseCode === 'CS500')?.inProgram,
      ).toBe(true);
      expect(
        detail.courses.find((c) => c.courseCode === 'MGT510')?.inProgram,
      ).toBe(false);
    });

    it('shows the whole term when the degree has no course requirements', async () => {
      // An unmodelled programme must not blank the column.
      programCourseIds = [];
      const detail = await service.findOne('t1', 'p1');
      expect(detail.inProgramCount).toBe(2);
    });
  });
});
