import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import { Course } from '../../database/entities/course.entity';

export interface TermSummary {
  id: string;
  name: string;
  sortOrder: number;
  courseCount: number;
  offeredCourseIds: string[];
}

export interface TermDetail {
  id: string;
  name: string;
  sortOrder: number;
  courseCount: number;
  courses: Array<{
    id: string;
    courseCode: string;
    title: string;
    creditHours: number;
    level: string;
  }>;
}

/**
 * Public, read-only view of the academic terms and course offerings curated
 * through the admin offerings tool. The planner needs this data without a
 * JWT, so it is exposed separately from `/admin/offerings` rather than by
 * relaxing the guard there.
 */
@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(AcademicTerm)
    private readonly termRepo: Repository<AcademicTerm>,
    @InjectRepository(CourseOffering)
    private readonly offeringRepo: Repository<CourseOffering>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findAll(): Promise<TermSummary[]> {
    const terms = await this.termRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    if (!terms.length) return [];

    const offerings = await this.offeringRepo.find({
      where: { termId: In(terms.map((t) => t.id)) },
    });

    const byTerm = new Map<string, string[]>();
    for (const o of offerings) {
      const list = byTerm.get(o.termId);
      if (list) list.push(o.courseId);
      else byTerm.set(o.termId, [o.courseId]);
    }

    return terms.map((t) => {
      const offeredCourseIds = byTerm.get(t.id) ?? [];
      return {
        id: t.id,
        name: t.name,
        sortOrder: t.sortOrder,
        courseCount: offeredCourseIds.length,
        offeredCourseIds,
      };
    });
  }

  async findOne(id: string): Promise<TermDetail> {
    const term = await this.termRepo.findOne({ where: { id } });
    if (!term) throw new NotFoundException(`Academic term ${id} not found`);

    const offerings = await this.offeringRepo.find({ where: { termId: id } });
    const courseIds = offerings.map((o) => o.courseId);

    const courses = courseIds.length
      ? await this.courseRepo.find({
          where: { id: In(courseIds) },
          order: { courseCode: 'ASC' },
        })
      : [];

    return {
      id: term.id,
      name: term.name,
      sortOrder: term.sortOrder,
      courseCount: courses.length,
      courses: courses.map((c) => ({
        id: c.id,
        courseCode: c.courseCode,
        title: c.title,
        creditHours: Number(c.creditHours),
        level: c.level,
      })),
    };
  }
}
