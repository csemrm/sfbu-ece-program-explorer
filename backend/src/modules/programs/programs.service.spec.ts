import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { Program } from '../../database/entities/program.entity';
import { CatalogYear } from '../../database/entities/catalog-year.entity';
import { RequirementGroup } from '../../database/entities/requirement-group.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { CourseKnowledgeArea } from '../../database/entities/course-knowledge-area.entity';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';

const mockProgram = (overrides: Partial<Program> = {}): Program =>
  ({
    id: 'prog-1',
    name: 'Bachelor of Science in Computer Science',
    abbreviation: 'BSCS',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Program;

const makeQb = (rows: Program[] = [], count = 0) => ({
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getCount: jest.fn().mockResolvedValue(count),
  getMany: jest.fn().mockResolvedValue(rows),
});

describe('ProgramsService', () => {
  let service: ProgramsService;
  let programRepo: any;
  let cyRepo: any;
  let rgRepo: any;
  let prRepo: any;
  let courseRepo: any;
  let prereqRepo: any;
  let coreqRepo: any;
  let ckaRepo: any;
  let kaRepo: any;

  beforeEach(async () => {
    programRepo = { createQueryBuilder: jest.fn(), findOne: jest.fn() };
    cyRepo = { find: jest.fn(), findOne: jest.fn() };
    rgRepo = { find: jest.fn() };
    prRepo = { find: jest.fn() };
    courseRepo = { find: jest.fn() };
    prereqRepo = { find: jest.fn() };
    coreqRepo = { find: jest.fn() };
    ckaRepo = { find: jest.fn() };
    kaRepo = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        { provide: getRepositoryToken(Program), useValue: programRepo },
        { provide: getRepositoryToken(CatalogYear), useValue: cyRepo },
        { provide: getRepositoryToken(RequirementGroup), useValue: rgRepo },
        {
          provide: getRepositoryToken(ProgramRequirement),
          useValue: prRepo,
        },
        { provide: getRepositoryToken(Course), useValue: courseRepo },
        { provide: getRepositoryToken(Prerequisite), useValue: prereqRepo },
        { provide: getRepositoryToken(Corequisite), useValue: coreqRepo },
        {
          provide: getRepositoryToken(CourseKnowledgeArea),
          useValue: ckaRepo,
        },
        { provide: getRepositoryToken(KnowledgeArea), useValue: kaRepo },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
  });

  describe('findAll()', () => {
    it('returns paginated programs', async () => {
      const programs = [mockProgram()];
      const qb = makeQb(programs, 1);
      programRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(programs);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('applies abbreviation filter when provided', async () => {
      const qb = makeQb([], 0);
      programRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ abbreviation: 'MSCS', page: 1, limit: 10 });

      expect(qb.andWhere).toHaveBeenCalledWith('p.abbreviation = :abbr', {
        abbr: 'MSCS',
      });
    });

    it('does not apply abbreviation filter when not provided', async () => {
      const qb = makeQb([], 0);
      programRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ page: 1, limit: 10 });

      expect(qb.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('returns program when found', async () => {
      const program = mockProgram();
      programRepo.findOne.mockResolvedValue(program);

      const result = await service.findOne('prog-1');
      expect(result).toBe(program);
    });

    it('throws NotFoundException when program not found', async () => {
      programRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findRequirements()', () => {
    it('returns program with catalog years and requirement groups', async () => {
      const program = mockProgram();
      programRepo.findOne.mockResolvedValue(program);

      const rg = {
        id: 'rg-1',
        name: 'Core',
        description: null,
        minCredits: 30,
        sortOrder: 1,
      };
      const cy = {
        id: 'cy-1',
        academicYear: '2025-2026',
        effectiveDate: null,
        requirementGroups: [rg],
      };
      cyRepo.find.mockResolvedValue([cy]);

      const result = await service.findRequirements('prog-1');

      expect(result.programId).toBe('prog-1');
      expect(result.programName).toBe(program.name);
      expect(result.catalogYears).toHaveLength(1);
      expect(result.catalogYears[0].academicYear).toBe('2025-2026');
      expect(result.catalogYears[0].requirementGroups).toHaveLength(1);
      expect(result.catalogYears[0].requirementGroups[0].name).toBe('Core');
    });

    it('returns empty catalogYears when none exist', async () => {
      programRepo.findOne.mockResolvedValue(mockProgram());
      cyRepo.find.mockResolvedValue([]);

      const result = await service.findRequirements('prog-1');
      expect(result.catalogYears).toHaveLength(0);
    });

    it('throws NotFoundException when program not found', async () => {
      programRepo.findOne.mockResolvedValue(null);
      await expect(service.findRequirements('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findKnowledgeAreas()', () => {
    const setupProgramWithCourses = (courseIds: string[]) => {
      programRepo.findOne.mockResolvedValue(mockProgram());
      cyRepo.find.mockResolvedValue([
        { id: 'cy-1', academicYear: '2025-2026' },
      ]);
      rgRepo.find.mockResolvedValue([{ id: 'rg-1' }]);
      prRepo.find.mockResolvedValue(
        courseIds.map((courseId) => ({ courseId })),
      );
    };

    it('ranks areas by course count and computes percentage of program courses', async () => {
      setupProgramWithCourses(['c-1', 'c-2', 'c-3', 'c-4']);
      ckaRepo.find.mockResolvedValue([
        { courseId: 'c-1', knowledgeAreaId: 'ka-net' },
        { courseId: 'c-2', knowledgeAreaId: 'ka-net' },
        { courseId: 'c-3', knowledgeAreaId: 'ka-net' },
        { courseId: 'c-4', knowledgeAreaId: 'ka-ai' },
      ]);
      kaRepo.find.mockResolvedValue([
        { id: 'ka-ai', name: 'Artificial Intelligence', description: null },
        { id: 'ka-net', name: 'Computer Networks', description: null },
      ]);

      const result = await service.findKnowledgeAreas('prog-1');

      expect(result.totalCourses).toBe(4);
      expect(result.academicYear).toBe('2025-2026');
      expect(result.knowledgeAreas[0]).toMatchObject({
        name: 'Computer Networks',
        courseCount: 3,
        percentage: 75,
      });
      expect(result.knowledgeAreas[1]).toMatchObject({
        name: 'Artificial Intelligence',
        courseCount: 1,
        percentage: 25,
      });
    });

    it('counts a course once per area it belongs to', async () => {
      setupProgramWithCourses(['c-1']);
      ckaRepo.find.mockResolvedValue([
        { courseId: 'c-1', knowledgeAreaId: 'ka-a' },
        { courseId: 'c-1', knowledgeAreaId: 'ka-b' },
      ]);
      kaRepo.find.mockResolvedValue([
        { id: 'ka-a', name: 'Area A', description: null },
        { id: 'ka-b', name: 'Area B', description: null },
      ]);

      const result = await service.findKnowledgeAreas('prog-1');

      expect(result.totalCourses).toBe(1);
      expect(result.knowledgeAreas).toHaveLength(2);
      expect(result.knowledgeAreas.every((a) => a.percentage === 100)).toBe(
        true,
      );
    });

    it('deduplicates a course required by more than one requirement group', async () => {
      programRepo.findOne.mockResolvedValue(mockProgram());
      cyRepo.find.mockResolvedValue([
        { id: 'cy-1', academicYear: '2025-2026' },
      ]);
      rgRepo.find.mockResolvedValue([{ id: 'rg-1' }, { id: 'rg-2' }]);
      prRepo.find.mockResolvedValue([
        { courseId: 'c-1' },
        { courseId: 'c-1' },
        { courseId: null },
      ]);
      ckaRepo.find.mockResolvedValue([
        { courseId: 'c-1', knowledgeAreaId: 'ka-a' },
      ]);
      kaRepo.find.mockResolvedValue([
        { id: 'ka-a', name: 'Area A', description: null },
      ]);

      const result = await service.findKnowledgeAreas('prog-1');

      expect(result.totalCourses).toBe(1);
    });

    it('returns totalCourses with no areas when courses are unmapped', async () => {
      setupProgramWithCourses(['c-1', 'c-2']);
      ckaRepo.find.mockResolvedValue([]);

      const result = await service.findKnowledgeAreas('prog-1');

      expect(result.totalCourses).toBe(2);
      expect(result.knowledgeAreas).toEqual([]);
      expect(kaRepo.find).not.toHaveBeenCalled();
    });

    it('returns an empty result when the program has no catalog years', async () => {
      programRepo.findOne.mockResolvedValue(mockProgram());
      cyRepo.find.mockResolvedValue([]);

      const result = await service.findKnowledgeAreas('prog-1');

      expect(result.academicYear).toBeNull();
      expect(result.knowledgeAreas).toEqual([]);
      expect(result.totalCourses).toBe(0);
    });

    it('throws NotFoundException when program not found', async () => {
      programRepo.findOne.mockResolvedValue(null);
      await expect(service.findKnowledgeAreas('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
