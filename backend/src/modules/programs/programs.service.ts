import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Program } from '../../database/entities/program.entity';
import { CatalogYear } from '../../database/entities/catalog-year.entity';
import { RequirementGroup } from '../../database/entities/requirement-group.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { CourseKnowledgeArea } from '../../database/entities/course-knowledge-area.entity';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';
import { paginate, PaginatedResult } from '../../common/dto/pagination.dto';
import { QueryProgramsDto } from './dto/program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
    @InjectRepository(CatalogYear)
    private readonly cyRepo: Repository<CatalogYear>,
    @InjectRepository(RequirementGroup)
    private readonly rgRepo: Repository<RequirementGroup>,
    @InjectRepository(ProgramRequirement)
    private readonly prRepo: Repository<ProgramRequirement>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Prerequisite)
    private readonly prereqRepo: Repository<Prerequisite>,
    @InjectRepository(Corequisite)
    private readonly coreqRepo: Repository<Corequisite>,
    @InjectRepository(CourseKnowledgeArea)
    private readonly ckaRepo: Repository<CourseKnowledgeArea>,
    @InjectRepository(KnowledgeArea)
    private readonly kaRepo: Repository<KnowledgeArea>,
  ) {}

  async findAll(query: QueryProgramsDto): Promise<PaginatedResult<Program>> {
    const qb = this.programRepo.createQueryBuilder('p');
    if (query.abbreviation) {
      qb.andWhere('p.abbreviation = :abbr', { abbr: query.abbreviation });
    }
    qb.orderBy('p.name', 'ASC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const data = await qb.getMany();
    return paginate(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<Program> {
    const program = await this.programRepo.findOne({ where: { id } });
    if (!program) throw new NotFoundException(`Program ${id} not found`);
    return program;
  }

  async findGraph(programId: string) {
    const program = await this.findOne(programId);

    const years = await this.cyRepo.find({
      where: { programId },
      order: { academicYear: 'DESC' },
    });
    if (!years.length) {
      return {
        programId: program.id,
        programName: program.name,
        programAbbreviation: program.abbreviation,
        academicYear: null,
        nodes: [],
        edges: [],
      };
    }
    const cy = years[0];

    const groups = await this.rgRepo.find({ where: { catalogYearId: cy.id } });
    const groupIds = groups.map((g) => g.id);

    const pReqs = await this.prRepo.find({
      where: { requirementGroupId: In(groupIds) },
    });
    const programCourseIds = [
      ...new Set(
        pReqs.filter((r) => r.courseId != null).map((r) => r.courseId!),
      ),
    ];

    if (programCourseIds.length === 0) {
      return {
        programId: program.id,
        programName: program.name,
        programAbbreviation: program.abbreviation,
        academicYear: cy.academicYear,
        nodes: [],
        edges: [],
      };
    }

    const [prereqs, coreqs] = await Promise.all([
      this.prereqRepo.find({
        where: [
          { courseId: In(programCourseIds) },
          { prerequisiteCourseId: In(programCourseIds) },
        ],
      }),
      this.coreqRepo.find({
        where: [
          { courseId: In(programCourseIds) },
          { corequisiteCourseId: In(programCourseIds) },
        ],
      }),
    ]);

    const allIds = new Set<string>(programCourseIds);
    prereqs.forEach((p) => {
      allIds.add(p.courseId);
      allIds.add(p.prerequisiteCourseId);
    });
    coreqs.forEach((c) => {
      allIds.add(c.courseId);
      allIds.add(c.corequisiteCourseId);
    });

    const courses = await this.courseRepo.find({
      where: { id: In([...allIds]) },
    });
    const programSet = new Set(programCourseIds);

    const nodes = courses.map((c) => ({
      id: c.id,
      courseCode: c.courseCode,
      title: c.title,
      creditHours: c.creditHours,
      level: c.level,
      description: c.description,
      inProgram: programSet.has(c.id),
    }));

    const edges = [
      ...prereqs.map((p) => ({
        id: `prereq-${p.id}`,
        sourceId: p.prerequisiteCourseId,
        targetId: p.courseId,
        type: 'prerequisite' as const,
      })),
      ...coreqs.map((c) => ({
        id: `coreq-${c.id}`,
        sourceId: c.corequisiteCourseId,
        targetId: c.courseId,
        type: 'corequisite' as const,
      })),
    ];

    return {
      programId: program.id,
      programName: program.name,
      programAbbreviation: program.abbreviation,
      academicYear: cy.academicYear,
      nodes,
      edges,
    };
  }

  async findRoadmap(programId: string) {
    const program = await this.findOne(programId);

    const years = await this.cyRepo.find({
      where: { programId },
      order: { academicYear: 'DESC' },
    });
    if (!years.length) {
      return {
        programId: program.id,
        programName: program.name,
        programAbbreviation: program.abbreviation,
        catalogYearId: null,
        academicYear: null,
        phases: [],
      };
    }
    const cy = years[0];

    const groups = await this.rgRepo.find({
      where: { catalogYearId: cy.id },
      order: { sortOrder: 'ASC' },
    });

    const phases = await Promise.all(
      groups.map(async (rg) => {
        const reqs = await this.prRepo.find({
          where: { requirementGroupId: rg.id },
          relations: { course: true },
          order: { sortOrder: 'ASC' },
        });
        const courses = reqs
          .filter((r) => r.course != null)
          .map((r) => {
            const c = r.course!;
            return {
              id: c.id,
              courseCode: c.courseCode,
              title: c.title,
              creditHours: c.creditHours,
              level: c.level,
              description: c.description,
            };
          });
        return {
          id: rg.id,
          name: rg.name,
          description: rg.description,
          minCredits: rg.minCredits,
          sortOrder: rg.sortOrder,
          courses,
        };
      }),
    );

    return {
      programId: program.id,
      programName: program.name,
      programAbbreviation: program.abbreviation,
      catalogYearId: cy.id,
      academicYear: cy.academicYear,
      phases,
    };
  }

  /**
   * Knowledge-area distribution for a program's latest catalog year.
   *
   * Counts every distinct course reachable from the program's requirement
   * groups, including all specialization tracks. Students choose only one
   * track, so this describes subject *coverage* offered by the program —
   * not the areas a single student's degree plan will span.
   */
  async findKnowledgeAreas(programId: string) {
    const program = await this.findOne(programId);

    const years = await this.cyRepo.find({
      where: { programId },
      order: { academicYear: 'DESC' },
    });

    const empty = {
      programId: program.id,
      programName: program.name,
      programAbbreviation: program.abbreviation,
      academicYear: null as string | null,
      totalCourses: 0,
      knowledgeAreas: [] as Array<{
        id: string;
        name: string;
        description: string | null;
        courseCount: number;
        percentage: number;
      }>,
    };
    if (!years.length) return empty;
    const cy = years[0];

    const groups = await this.rgRepo.find({ where: { catalogYearId: cy.id } });
    if (!groups.length) return { ...empty, academicYear: cy.academicYear };

    const pReqs = await this.prRepo.find({
      where: { requirementGroupId: In(groups.map((g) => g.id)) },
    });
    const courseIds = [
      ...new Set(
        pReqs.filter((r) => r.courseId != null).map((r) => r.courseId!),
      ),
    ];
    if (!courseIds.length) return { ...empty, academicYear: cy.academicYear };

    const links = await this.ckaRepo.find({
      where: { courseId: In(courseIds) },
    });
    if (!links.length) {
      return {
        ...empty,
        academicYear: cy.academicYear,
        totalCourses: courseIds.length,
      };
    }

    const areas = await this.kaRepo.find({
      where: { id: In([...new Set(links.map((l) => l.knowledgeAreaId))]) },
    });

    const countByArea = new Map<string, number>();
    for (const l of links) {
      countByArea.set(
        l.knowledgeAreaId,
        (countByArea.get(l.knowledgeAreaId) ?? 0) + 1,
      );
    }

    const knowledgeAreas = areas
      .map((a) => {
        const courseCount = countByArea.get(a.id) ?? 0;
        return {
          id: a.id,
          name: a.name,
          description: a.description,
          courseCount,
          percentage: Math.round((courseCount / courseIds.length) * 100),
        };
      })
      .sort(
        (a, b) => b.courseCount - a.courseCount || a.name.localeCompare(b.name),
      );

    return {
      programId: program.id,
      programName: program.name,
      programAbbreviation: program.abbreviation,
      academicYear: cy.academicYear,
      totalCourses: courseIds.length,
      knowledgeAreas,
    };
  }

  async findRequirements(id: string) {
    const program = await this.findOne(id);
    const catalogYears = await this.cyRepo.find({
      where: { programId: id },
      relations: { requirementGroups: true },
      order: { academicYear: 'DESC' },
    });
    return {
      programId: program.id,
      programName: program.name,
      catalogYears: catalogYears.map((cy) => ({
        id: cy.id,
        academicYear: cy.academicYear,
        effectiveDate: cy.effectiveDate,
        requirementGroups: (cy.requirementGroups ?? [])
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((rg) => ({
            id: rg.id,
            name: rg.name,
            description: rg.description,
            minCredits: rg.minCredits,
            sortOrder: rg.sortOrder,
          })),
      })),
    };
  }
}
