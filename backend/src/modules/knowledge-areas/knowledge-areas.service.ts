import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';
import { CourseKnowledgeArea } from '../../database/entities/course-knowledge-area.entity';
import { Course, CourseLevel } from '../../database/entities/course.entity';
import {
  paginate,
  PaginatedResult,
  PaginationDto,
} from '../../common/dto/pagination.dto';

export interface KnowledgeAreaSummary {
  id: string;
  name: string;
  description: string | null;
  courseCount: number;
  undergraduateCount: number;
  graduateCount: number;
}

export interface KnowledgeAreaDetail extends KnowledgeAreaSummary {
  courses: Array<{
    id: string;
    courseCode: string;
    title: string;
    creditHours: number;
    level: string;
    description: string | null;
  }>;
}

@Injectable()
export class KnowledgeAreasService {
  constructor(
    @InjectRepository(KnowledgeArea)
    private readonly kaRepo: Repository<KnowledgeArea>,
    @InjectRepository(CourseKnowledgeArea)
    private readonly ckaRepo: Repository<CourseKnowledgeArea>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findAll(
    query: PaginationDto,
  ): Promise<PaginatedResult<KnowledgeAreaSummary>> {
    const qb = this.kaRepo.createQueryBuilder('ka').orderBy('ka.name', 'ASC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const areas = await qb.getMany();

    const counts = await this.countsByArea(areas.map((a) => a.id));
    const data = areas.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      ...(counts.get(a.id) ?? {
        courseCount: 0,
        undergraduateCount: 0,
        graduateCount: 0,
      }),
    }));

    return paginate(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<KnowledgeAreaDetail> {
    const ka = await this.kaRepo.findOne({ where: { id } });
    if (!ka) throw new NotFoundException(`Knowledge area ${id} not found`);

    const links = await this.ckaRepo.find({ where: { knowledgeAreaId: id } });
    const courseIds = links.map((l) => l.courseId);

    const courses = courseIds.length
      ? await this.courseRepo.find({
          where: { id: In(courseIds) },
          order: { courseCode: 'ASC' },
        })
      : [];

    return {
      id: ka.id,
      name: ka.name,
      description: ka.description,
      courseCount: courses.length,
      undergraduateCount: courses.filter(
        (c) => c.level === CourseLevel.UNDERGRADUATE,
      ).length,
      graduateCount: courses.filter((c) => c.level === CourseLevel.GRADUATE)
        .length,
      courses: courses.map((c) => ({
        id: c.id,
        courseCode: c.courseCode,
        title: c.title,
        creditHours: Number(c.creditHours),
        level: c.level,
        description: c.description,
      })),
    };
  }

  /**
   * Course counts per knowledge area, split by level.
   * Returns an empty map when no area ids are supplied.
   */
  private async countsByArea(areaIds: string[]): Promise<
    Map<
      string,
      {
        courseCount: number;
        undergraduateCount: number;
        graduateCount: number;
      }
    >
  > {
    const result = new Map<
      string,
      {
        courseCount: number;
        undergraduateCount: number;
        graduateCount: number;
      }
    >();
    if (!areaIds.length) return result;

    const rows = await this.ckaRepo
      .createQueryBuilder('cka')
      .innerJoin(Course, 'c', 'c.id = cka.course_id')
      .select('cka.knowledge_area_id', 'areaId')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        "COUNT(*) FILTER (WHERE c.level = 'undergraduate')",
        'undergrad',
      )
      .addSelect("COUNT(*) FILTER (WHERE c.level = 'graduate')", 'grad')
      .where('cka.knowledge_area_id IN (:...areaIds)', { areaIds })
      .groupBy('cka.knowledge_area_id')
      .getRawMany<{
        areaId: string;
        total: string;
        undergrad: string;
        grad: string;
      }>();

    for (const r of rows) {
      result.set(r.areaId, {
        courseCount: Number(r.total),
        undergraduateCount: Number(r.undergrad),
        graduateCount: Number(r.grad),
      });
    }
    return result;
  }
}
