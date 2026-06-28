import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProgramsController } from '../src/modules/programs/programs.controller';
import { ProgramsService } from '../src/modules/programs/programs.service';

const PROGRAM_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

const mockProgram = {
  id: PROGRAM_ID,
  name: 'Bachelor of Science in Computer Science',
  abbreviation: 'BSCS',
  description: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockPaginatedPrograms = {
  data: [mockProgram],
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
};

const mockService = {
  findAll: jest.fn().mockResolvedValue(mockPaginatedPrograms),
  findOne: jest.fn().mockResolvedValue(mockProgram),
  findRequirements: jest.fn().mockResolvedValue({
    programId: PROGRAM_ID,
    programName: mockProgram.name,
    catalogYears: [],
  }),
  findRoadmap: jest.fn().mockResolvedValue({
    programId: PROGRAM_ID,
    programName: mockProgram.name,
    programAbbreviation: 'BSCS',
    catalogYearId: null,
    academicYear: null,
    phases: [],
  }),
  findGraph: jest.fn().mockResolvedValue({
    programId: PROGRAM_ID,
    programName: mockProgram.name,
    programAbbreviation: 'BSCS',
    academicYear: null,
    nodes: [],
    edges: [],
  }),
};

describe('ProgramsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProgramsController],
      providers: [{ provide: ProgramsService, useValue: mockService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockService.findAll.mockResolvedValue(mockPaginatedPrograms);
    mockService.findOne.mockResolvedValue(mockProgram);
  });

  describe('GET /api/v1/programs', () => {
    it('returns 200 with paginated result', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/programs')
        .expect(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
      expect(res.body.page).toBe(1);
    });

    it('passes query params to service', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/programs?abbreviation=BSCS&page=1&limit=10')
        .expect(200);
      expect(mockService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ abbreviation: 'BSCS', page: 1, limit: 10 }),
      );
    });

    it('returns 400 for invalid query param types', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/programs?page=abc')
        .expect(400);
    });
  });

  describe('GET /api/v1/programs/:id', () => {
    it('returns 200 with program', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/programs/${PROGRAM_ID}`)
        .expect(200);
      expect(res.body.id).toBe(PROGRAM_ID);
      expect(res.body.abbreviation).toBe('BSCS');
    });

    it('returns 400 for non-UUID id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/programs/not-a-uuid')
        .expect(400);
    });

    it('returns 404 when service throws NotFoundException', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('Not found'));
      await request(app.getHttpServer())
        .get(`/api/v1/programs/${PROGRAM_ID}`)
        .expect(404);
    });
  });

  describe('GET /api/v1/programs/:id/requirements', () => {
    it('returns 200 with requirements', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/programs/${PROGRAM_ID}/requirements`)
        .expect(200);
      expect(res.body.programId).toBe(PROGRAM_ID);
    });

    it('returns 400 for non-UUID id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/programs/bad-id/requirements')
        .expect(400);
    });
  });

  describe('GET /api/v1/programs/:id/roadmap', () => {
    it('returns 200 with roadmap', async () => {
      mockService.findRoadmap.mockResolvedValue({
        programId: PROGRAM_ID,
        programName: mockProgram.name,
        programAbbreviation: 'BSCS',
        catalogYearId: null,
        academicYear: null,
        phases: [],
      });
      const res = await request(app.getHttpServer())
        .get(`/api/v1/programs/${PROGRAM_ID}/roadmap`)
        .expect(200);
      expect(res.body.programId).toBe(PROGRAM_ID);
    });
  });

  describe('GET /api/v1/programs/:id/graph', () => {
    it('returns 200 with graph data', async () => {
      mockService.findGraph.mockResolvedValue({
        programId: PROGRAM_ID,
        programName: mockProgram.name,
        programAbbreviation: 'BSCS',
        academicYear: null,
        nodes: [],
        edges: [],
      });
      const res = await request(app.getHttpServer())
        .get(`/api/v1/programs/${PROGRAM_ID}/graph`)
        .expect(200);
      expect(res.body.nodes).toBeDefined();
      expect(res.body.edges).toBeDefined();
    });
  });
});
