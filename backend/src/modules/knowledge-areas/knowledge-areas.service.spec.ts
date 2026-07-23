import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { KnowledgeAreasService } from './knowledge-areas.service';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';
import { CourseKnowledgeArea } from '../../database/entities/course-knowledge-area.entity';
import { Course } from '../../database/entities/course.entity';

const mockArea = (overrides: Partial<KnowledgeArea> = {}): KnowledgeArea =>
  ({
    id: 'ka-1',
    name: 'Computer Networks',
    description: 'Protocols and routing.',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as KnowledgeArea;

const mockCourse = (overrides: Partial<Course> = {}): Course =>
  ({
    id: 'c-1',
    courseCode: 'CS360',
    title: 'Computer Networks',
    creditHours: 3,
    level: 'undergraduate',
    description: 'Network architecture.',
    ...overrides,
  }) as unknown as Course;

describe('KnowledgeAreasService', () => {
  let service: KnowledgeAreasService;
  let kaRepo: any;
  let ckaRepo: any;
  let courseRepo: any;
  let countQb: any;

  beforeEach(async () => {
    countQb = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    kaRepo = { createQueryBuilder: jest.fn(), findOne: jest.fn() };
    ckaRepo = { find: jest.fn(), createQueryBuilder: jest.fn(() => countQb) };
    courseRepo = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeAreasService,
        { provide: getRepositoryToken(KnowledgeArea), useValue: kaRepo },
        {
          provide: getRepositoryToken(CourseKnowledgeArea),
          useValue: ckaRepo,
        },
        { provide: getRepositoryToken(Course), useValue: courseRepo },
      ],
    }).compile();

    service = module.get<KnowledgeAreasService>(KnowledgeAreasService);
  });

  describe('findAll()', () => {
    const listQb = (rows: KnowledgeArea[], count: number) => ({
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(count),
      getMany: jest.fn().mockResolvedValue(rows),
    });

    it('attaches course counts split by level', async () => {
      kaRepo.createQueryBuilder.mockReturnValue(listQb([mockArea()], 1));
      countQb.getRawMany.mockResolvedValue([
        { areaId: 'ka-1', total: '5', undergrad: '2', grad: '3' },
      ]);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.total).toBe(1);
      expect(result.data[0]).toMatchObject({
        id: 'ka-1',
        name: 'Computer Networks',
        courseCount: 5,
        undergraduateCount: 2,
        graduateCount: 3,
      });
    });

    it('reports zero counts for an area with no courses', async () => {
      kaRepo.createQueryBuilder.mockReturnValue(listQb([mockArea()], 1));
      countQb.getRawMany.mockResolvedValue([]);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data[0]).toMatchObject({
        courseCount: 0,
        undergraduateCount: 0,
        graduateCount: 0,
      });
    });

    it('skips the count query when no areas exist', async () => {
      kaRepo.createQueryBuilder.mockReturnValue(listQb([], 0));

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toEqual([]);
      expect(ckaRepo.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('returns the area with its courses', async () => {
      kaRepo.findOne.mockResolvedValue(mockArea());
      ckaRepo.find.mockResolvedValue([
        { courseId: 'c-1', knowledgeAreaId: 'ka-1' },
        { courseId: 'c-2', knowledgeAreaId: 'ka-1' },
      ]);
      courseRepo.find.mockResolvedValue([
        mockCourse(),
        mockCourse({
          id: 'c-2',
          courseCode: 'CS515',
          level: 'graduate',
        } as Partial<Course>),
      ]);

      const result = await service.findOne('ka-1');

      expect(result.courseCount).toBe(2);
      expect(result.undergraduateCount).toBe(1);
      expect(result.graduateCount).toBe(1);
      expect(result.courses.map((c) => c.courseCode)).toEqual([
        'CS360',
        'CS515',
      ]);
    });

    it('coerces decimal creditHours to a number', async () => {
      kaRepo.findOne.mockResolvedValue(mockArea());
      ckaRepo.find.mockResolvedValue([
        { courseId: 'c-1', knowledgeAreaId: 'ka-1' },
      ]);
      courseRepo.find.mockResolvedValue([
        mockCourse({ creditHours: '3.0' } as unknown as Partial<Course>),
      ]);

      const result = await service.findOne('ka-1');

      expect(result.courses[0].creditHours).toBe(3);
    });

    it('does not query courses when the area has none', async () => {
      kaRepo.findOne.mockResolvedValue(mockArea());
      ckaRepo.find.mockResolvedValue([]);

      const result = await service.findOne('ka-1');

      expect(result.courses).toEqual([]);
      expect(result.courseCount).toBe(0);
      expect(courseRepo.find).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for an unknown area', async () => {
      kaRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
