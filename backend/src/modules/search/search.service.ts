import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import { Program } from '../../database/entities/program.entity';
import { paginate, PaginatedResult } from '../../common/dto/pagination.dto';
import {
  SearchQueryDto,
  SearchResultItemDto,
  SearchResultType,
} from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async search(
    query: SearchQueryDto,
  ): Promise<PaginatedResult<SearchResultItemDto>> {
    const results: SearchResultItemDto[] = [];
    const keyword = `%${query.q}%`;

    if (!query.type || query.type === SearchResultType.PROGRAM) {
      const programs = await this.programRepo
        .createQueryBuilder('p')
        .where(
          '(p.name ILIKE :q OR p.abbreviation ILIKE :q OR p.description ILIKE :q)',
          { q: keyword },
        )
        .orderBy('p.name', 'ASC')
        .getMany();

      for (const p of programs) {
        results.push({
          type: SearchResultType.PROGRAM,
          id: p.id,
          code: p.abbreviation,
          title: p.name,
          description: p.description,
        });
      }
    }

    if (!query.type || query.type === SearchResultType.COURSE) {
      const qb = this.courseRepo
        .createQueryBuilder('c')
        .where(
          '(c.courseCode ILIKE :q OR c.title ILIKE :q OR c.description ILIKE :q)',
          { q: keyword },
        );

      if (query.level) {
        qb.andWhere('c.level = :level', { level: query.level });
      }

      const courses = await qb.orderBy('c.courseCode', 'ASC').getMany();

      for (const c of courses) {
        results.push({
          type: SearchResultType.COURSE,
          id: c.id,
          code: c.courseCode,
          title: c.title,
          description: c.description,
          creditHours: Number(c.creditHours),
          level: c.level,
        });
      }
    }

    const total = results.length;
    const start = (query.page - 1) * query.limit;
    const data = results.slice(start, start + query.limit);
    return paginate(data, total, query.page, query.limit);
  }
}
