import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogYear } from '../../database/entities/catalog-year.entity';
import {
  paginate,
  PaginatedResult,
  PaginationDto,
} from '../../common/dto/pagination.dto';

@Injectable()
export class CatalogYearsService {
  constructor(
    @InjectRepository(CatalogYear)
    private readonly cyRepo: Repository<CatalogYear>,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<CatalogYear>> {
    const qb = this.cyRepo
      .createQueryBuilder('cy')
      .leftJoinAndSelect('cy.program', 'program')
      .orderBy('cy.academicYear', 'DESC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const data = await qb.getMany();
    return paginate(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<CatalogYear> {
    const cy = await this.cyRepo.findOne({
      where: { id },
      relations: { program: true },
    });
    if (!cy) throw new NotFoundException(`Catalog year ${id} not found`);
    return cy;
  }
}
