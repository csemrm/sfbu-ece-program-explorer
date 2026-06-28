import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course, CourseLevel } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';

const mockCourse = (overrides: Partial<Course> = {}): Course =>
  ({
    id: 'course-1',
    courseCode: 'CS101',
    title: 'Intro to CS',
    description: null,
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Course;

const makeQb = (rows: Course[] = [], count = 0) => {
  const qb: any = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(count),
    getMany: jest.fn().mockResolvedValue(rows),
  };
  return qb;
};

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepo: any;
  let prereqRepo: any;
  let coreqRepo: any;

  beforeEach(async () => {
    courseRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };
    prereqRepo = { find: jest.fn() };
    coreqRepo = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useValue: courseRepo },
        { provide: getRepositoryToken(Prerequisite), useValue: prereqRepo },
        { provide: getRepositoryToken(Corequisite), useValue: coreqRepo },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  describe('findAll()', () => {
    it('returns paginated result with no filters', async () => {
      const courses = [mockCourse()];
      const qb = makeQb(courses, 1);
      courseRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(courses);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('applies ILIKE filter when q is provided', async () => {
      const qb = makeQb([], 0);
      courseRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ q: 'algo', page: 1, limit: 10 });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(c.courseCode ILIKE :q OR c.title ILIKE :q)',
        { q: '%algo%' },
      );
    });

    it('applies level filter when level is provided', async () => {
      const qb = makeQb([], 0);
      courseRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({
        level: CourseLevel.GRADUATE,
        page: 1,
        limit: 10,
      });

      expect(qb.andWhere).toHaveBeenCalledWith('c.level = :level', {
        level: CourseLevel.GRADUATE,
      });
    });

    it('applies both q and level filters together', async () => {
      const qb = makeQb([], 0);
      courseRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({
        q: 'networks',
        level: CourseLevel.GRADUATE,
        page: 1,
        limit: 10,
      });

      expect(qb.andWhere).toHaveBeenCalledTimes(2);
    });
  });

  describe('findOne()', () => {
    it('returns course when found', async () => {
      const course = mockCourse();
      courseRepo.findOne.mockResolvedValue(course);

      const result = await service.findOne('course-1');
      expect(result).toBe(course);
      expect(courseRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'course-1' },
      });
    });

    it('throws NotFoundException when not found', async () => {
      courseRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findPrerequisites()', () => {
    it('returns prerequisites and corequisites', async () => {
      const course = mockCourse();
      const prereqCourse = mockCourse({ id: 'prereq-1', courseCode: 'CS100' });
      const coreqCourse = mockCourse({ id: 'coreq-1', courseCode: 'CS102' });

      courseRepo.findOne.mockResolvedValue(course);
      prereqRepo.find.mockResolvedValue([{ prerequisiteCourse: prereqCourse }]);
      coreqRepo.find.mockResolvedValue([{ corequisiteCourse: coreqCourse }]);

      const result = await service.findPrerequisites('course-1');

      expect(result.courseId).toBe(course.id);
      expect(result.courseCode).toBe(course.courseCode);
      expect(result.prerequisites).toHaveLength(1);
      expect(result.prerequisites[0].courseCode).toBe('CS100');
      expect(result.corequisites).toHaveLength(1);
      expect(result.corequisites[0].courseCode).toBe('CS102');
    });

    it('returns empty arrays when no prereqs or coreqs', async () => {
      courseRepo.findOne.mockResolvedValue(mockCourse());
      prereqRepo.find.mockResolvedValue([]);
      coreqRepo.find.mockResolvedValue([]);

      const result = await service.findPrerequisites('course-1');
      expect(result.prerequisites).toHaveLength(0);
      expect(result.corequisites).toHaveLength(0);
    });

    it('throws NotFoundException when course not found', async () => {
      courseRepo.findOne.mockResolvedValue(null);
      await expect(service.findPrerequisites('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
