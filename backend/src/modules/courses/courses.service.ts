import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { paginate, PaginatedResult } from '../../common/dto/pagination.dto';
import { QueryCoursesDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Prerequisite)
    private readonly prereqRepo: Repository<Prerequisite>,
    @InjectRepository(Corequisite)
    private readonly coreqRepo: Repository<Corequisite>,
  ) {}

  async findAll(query: QueryCoursesDto): Promise<PaginatedResult<Course>> {
    const qb = this.courseRepo.createQueryBuilder('c');
    if (query.q) {
      qb.andWhere('(c.courseCode ILIKE :q OR c.title ILIKE :q)', {
        q: `%${query.q}%`,
      });
    }
    if (query.level) {
      qb.andWhere('c.level = :level', { level: query.level });
    }
    qb.orderBy('c.courseCode', 'ASC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const data = await qb.getMany();
    return paginate(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }

  async findPrerequisites(id: string) {
    const course = await this.findOne(id);

    const prereqs = await this.prereqRepo.find({
      where: { courseId: id },
      relations: { prerequisiteCourse: true },
    });

    const coreqs = await this.coreqRepo.find({
      where: { courseId: id },
      relations: { corequisiteCourse: true },
    });

    const toDto = (c: Course) => ({
      id: c.id,
      courseCode: c.courseCode,
      title: c.title,
      creditHours: c.creditHours,
      level: c.level,
    });

    return {
      courseId: course.id,
      courseCode: course.courseCode,
      prerequisites: prereqs.map((p) => toDto(p.prerequisiteCourse)),
      corequisites: coreqs.map((c) => toDto(c.corequisiteCourse)),
    };
  }
}
