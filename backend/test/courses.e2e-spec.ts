import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CoursesController } from '../src/modules/courses/courses.controller';
import { CoursesService } from '../src/modules/courses/courses.service';

const COURSE_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

const mockCourse = {
  id: COURSE_ID,
  courseCode: 'CS101',
  title: 'Introduction to Computer Science',
  level: 'undergraduate',
  creditHours: '3',
  description: 'Intro course.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockPaginated = {
  data: [mockCourse],
  total: 1,
  page: 1,
  limit: 18,
  totalPages: 1,
};

const mockPrereqs = {
  courseId: COURSE_ID,
  courseCode: 'CS101',
  courseTitle: mockCourse.title,
  prerequisites: [],
  corequisites: [],
};

const mockService = {
  findAll: jest.fn().mockResolvedValue(mockPaginated),
  findOne: jest.fn().mockResolvedValue(mockCourse),
  findPrerequisites: jest.fn().mockResolvedValue(mockPrereqs),
};

describe('CoursesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [{ provide: CoursesService, useValue: mockService }],
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
    mockService.findAll.mockResolvedValue(mockPaginated);
    mockService.findOne.mockResolvedValue(mockCourse);
    mockService.findPrerequisites.mockResolvedValue(mockPrereqs);
  });

  describe('GET /api/v1/courses', () => {
    it('returns 200 with paginated courses', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/courses')
        .expect(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
    });

    it('passes q param to service', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/courses?q=algorithm')
        .expect(200);
      expect(mockService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'algorithm' }),
      );
    });

    it('passes level filter to service', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/courses?level=undergraduate')
        .expect(200);
      expect(mockService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'undergraduate' }),
      );
    });

    it('returns 400 for invalid page param', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/courses?page=xyz')
        .expect(400);
    });
  });

  describe('GET /api/v1/courses/:id', () => {
    it('returns 200 with course', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/courses/${COURSE_ID}`)
        .expect(200);
      expect(res.body.id).toBe(COURSE_ID);
      expect(res.body.courseCode).toBe('CS101');
    });

    it('returns 400 for non-UUID id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/courses/bad-uuid')
        .expect(400);
    });

    it('returns 404 when service throws NotFoundException', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('Not found'));
      await request(app.getHttpServer())
        .get(`/api/v1/courses/${COURSE_ID}`)
        .expect(404);
    });
  });

  describe('GET /api/v1/courses/:id/prerequisites', () => {
    it('returns 200 with prerequisites data', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/courses/${COURSE_ID}/prerequisites`)
        .expect(200);
      expect(res.body.courseId).toBe(COURSE_ID);
      expect(Array.isArray(res.body.prerequisites)).toBe(true);
      expect(Array.isArray(res.body.corequisites)).toBe(true);
    });

    it('returns 400 for non-UUID id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/courses/not-valid/prerequisites')
        .expect(400);
    });

    it('returns 404 when course not found', async () => {
      mockService.findPrerequisites.mockRejectedValue(
        new NotFoundException('Not found'),
      );
      await request(app.getHttpServer())
        .get(`/api/v1/courses/${COURSE_ID}/prerequisites`)
        .expect(404);
    });
  });
});
