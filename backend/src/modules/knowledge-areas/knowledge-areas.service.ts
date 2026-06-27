import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';
import {
  paginate,
  PaginatedResult,
  PaginationDto,
} from '../../common/dto/pagination.dto';

@Injectable()
export class KnowledgeAreasService {
  constructor(
    @InjectRepository(KnowledgeArea)
    private readonly kaRepo: Repository<KnowledgeArea>,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<KnowledgeArea>> {
    const qb = this.kaRepo.createQueryBuilder('ka').orderBy('ka.name', 'ASC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const data = await qb.getMany();
    return paginate(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<KnowledgeArea> {
    const ka = await this.kaRepo.findOne({ where: { id } });
    if (!ka) throw new NotFoundException(`Knowledge area ${id} not found`);
    return ka;
  }
}
