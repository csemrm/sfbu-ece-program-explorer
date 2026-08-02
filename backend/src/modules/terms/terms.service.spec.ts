import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TermsService } from './terms.service';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import { Course, CourseLevel } from '../../database/entities/course.entity';

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

  beforeEach(async () => {
    termRepo = { find: jest.fn(), findOne: jest.fn() };
    offeringRepo = { find: jest.fn() };
    courseRepo = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TermsService,
        { provide: getRepositoryToken(AcademicTerm), useValue: termRepo },
        { provide: getRepositoryToken(CourseOffering), useValue: offeringRepo },
        { provide: getRepositoryToken(Course), useValue: courseRepo },
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
});
