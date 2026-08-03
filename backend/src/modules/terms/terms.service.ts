import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import { Course } from '../../database/entities/course.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';

export interface TermSummary {
  id: string;
  name: string;
  sortOrder: number;
  courseCount: number;
  offeredCourseIds: string[];
}

export interface OfferedCourse {
  id: string;
  courseCode: string;
  title: string;
  creditHours: number;
  level: string;
  /** Registration status as published by the registrar. */
  openForRegistration: boolean;
  sectionCount: number | null;
  statusNote: string | null;
  /**
   * Whether the course belongs to the requested program. Always true when no
   * programId is supplied.
   *
   * Both in-program and out-of-program courses are returned, rather than the
   * server filtering: the planner shows "N of M offered courses are outside
   * <degree>" with an escape hatch to see them, and that needs both counts from
   * one request.
   */
  inProgram: boolean;
}

export interface TermDetail {
  id: string;
  name: string;
  sortOrder: number;
  /** Offerings in this term, before any program scoping. */
  courseCount: number;
  /** Offerings that belong to the requested program; equals courseCount without one. */
  inProgramCount: number;
  courses: OfferedCourse[];
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
    @InjectRepository(ProgramRequirement)
    private readonly requirementRepo: Repository<ProgramRequirement>,
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

  async findOne(id: string, programId?: string): Promise<TermDetail> {
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

    const byCourse = new Map(offerings.map((o) => [o.courseId, o]));
    const programCourses = await this.loadProgramCourses(programId);

    const mapped = courses.map((c) => {
      const offering = byCourse.get(c.id);
      return {
        id: c.id,
        courseCode: c.courseCode,
        title: c.title,
        creditHours: Number(c.creditHours),
        level: c.level,
        openForRegistration: offering?.openForRegistration ?? true,
        sectionCount: offering?.sectionCount ?? null,
        statusNote: offering?.statusNote ?? null,
        inProgram: programCourses ? programCourses.has(c.id) : true,
      };
    });

    return {
      id: term.id,
      name: term.name,
      sortOrder: term.sortOrder,
      courseCount: mapped.length,
      inProgramCount: mapped.filter((c) => c.inProgram).length,
      courses: mapped,
    };
  }

  /**
   * Course ids belonging to a program, or null when none was requested.
   *
   * Read from the program's requirement rows — the same source the roadmap is
   * built from, since there is no "courses in this program" table. A program
   * with no course-bearing requirements yields null rather than an empty set,
   * so an unmodelled degree shows the whole term instead of nothing at all.
   */
  private async loadProgramCourses(
    programId?: string,
  ): Promise<Set<string> | null> {
    if (!programId) return null;

    const rows = await this.requirementRepo
      .createQueryBuilder('req')
      .innerJoin('req.requirementGroup', 'rg')
      .innerJoin('rg.catalogYear', 'cy')
      .where('cy.program_id = :programId', { programId })
      .andWhere('req.course_id IS NOT NULL')
      .select('req.course_id', 'courseId')
      .getRawMany<{ courseId: string }>();

    if (!rows.length) return null;
    return new Set(rows.map((r) => r.courseId));
  }
}
