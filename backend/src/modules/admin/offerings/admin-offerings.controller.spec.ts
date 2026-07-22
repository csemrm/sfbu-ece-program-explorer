import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AdminOfferingsController } from './admin-offerings.controller';
import { AcademicTerm } from '../../../database/entities/academic-term.entity';
import { CourseOffering } from '../../../database/entities/course-offering.entity';
import { AdminAuditService } from '../admin-audit.service';

const actor = { user: { id: 'admin-1', email: 'admin@sfbu.edu' } };

describe('AdminOfferingsController', () => {
  let controller: AdminOfferingsController;
  let termRepo: any;
  let offeringRepo: any;
  let audit: { log: jest.Mock };

  beforeEach(async () => {
    termRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((x) => x),
      save: jest.fn(),
      remove: jest.fn(),
    };
    offeringRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((x) => ({ id: 'off-1', ...x })),
      save: jest.fn(),
      remove: jest.fn(),
    };
    audit = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOfferingsController],
      providers: [
        { provide: getRepositoryToken(AcademicTerm), useValue: termRepo },
        { provide: getRepositoryToken(CourseOffering), useValue: offeringRepo },
        { provide: AdminAuditService, useValue: audit },
      ],
    }).compile();

    controller = module.get(AdminOfferingsController);
  });

  it('lists terms ordered by sortOrder', async () => {
    termRepo.find.mockResolvedValue([]);
    await controller.listTerms();
    expect(termRepo.find).toHaveBeenCalledWith({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  });

  it('returns [] for offerings when no termId', async () => {
    const result = await controller.listOfferings('');
    expect(result).toEqual([]);
    expect(offeringRepo.find).not.toHaveBeenCalled();
  });

  it('maps and sorts offerings by course code', async () => {
    offeringRepo.find.mockResolvedValue([
      {
        id: 'o2',
        courseId: 'c2',
        course: {
          id: 'c2',
          courseCode: 'CS300',
          title: 'B',
          creditHours: '3.0',
          level: 'undergraduate',
        },
      },
      {
        id: 'o1',
        courseId: 'c1',
        course: {
          id: 'c1',
          courseCode: 'CS100',
          title: 'A',
          creditHours: '4.0',
          level: 'undergraduate',
        },
      },
    ]);
    const result = await controller.listOfferings('term-1');
    expect(result.map((r) => r.course.courseCode)).toEqual(['CS100', 'CS300']);
    expect(result[0].course.creditHours).toBe(4); // coerced to number
  });

  it('rejects a duplicate offering with a conflict', async () => {
    offeringRepo.save.mockRejectedValue({ code: '23505' });
    await expect(
      controller.addOffering({ termId: 't1', courseId: 'c1' }, actor),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects a duplicate term name with a conflict', async () => {
    termRepo.save.mockRejectedValue({ code: '23505' });
    await expect(
      controller.createTerm({ name: 'Fall 2026' }, actor),
    ).rejects.toThrow(ConflictException);
  });

  it('adds an offering and writes an audit entry', async () => {
    offeringRepo.save.mockResolvedValue(undefined);
    const res = await controller.addOffering(
      { termId: 't1', courseId: 'c1' },
      actor,
    );
    expect(res).toEqual({ id: 'off-1' });
    expect(audit.log).toHaveBeenCalledWith(
      actor.user,
      'add_offering',
      'course_offering',
      'off-1',
      { termId: 't1', courseId: 'c1' },
    );
  });

  it('404s when deleting a missing term', async () => {
    termRepo.findOne.mockResolvedValue(null);
    await expect(controller.deleteTerm('nope', actor)).rejects.toThrow(
      NotFoundException,
    );
  });
});
