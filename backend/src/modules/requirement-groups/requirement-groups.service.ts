import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequirementGroup } from '../../database/entities/requirement-group.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';
import { paginate, PaginatedResult } from '../../common/dto/pagination.dto';
import { QueryRequirementGroupsDto } from './dto/requirement-group.dto';

@Injectable()
export class RequirementGroupsService {
  constructor(
    @InjectRepository(RequirementGroup)
    private readonly rgRepo: Repository<RequirementGroup>,
    @InjectRepository(ProgramRequirement)
    private readonly prRepo: Repository<ProgramRequirement>,
  ) {}

  async findAll(
    query: QueryRequirementGroupsDto,
  ): Promise<PaginatedResult<RequirementGroup>> {
    const qb = this.rgRepo.createQueryBuilder('rg');
    if (query.catalogYearId) {
      qb.andWhere('rg.catalogYearId = :cyId', { cyId: query.catalogYearId });
    }
    qb.orderBy('rg.sortOrder', 'ASC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const data = await qb.getMany();
    return paginate(data, total, query.page, query.limit);
  }

  async findOne(
    id: string,
  ): Promise<RequirementGroup & { requirements: ProgramRequirement[] }> {
    const rg = await this.rgRepo.findOne({ where: { id } });
    if (!rg) throw new NotFoundException(`Requirement group ${id} not found`);
    const requirements = await this.prRepo.find({
      where: { requirementGroupId: id },
      relations: { course: true },
      order: { sortOrder: 'ASC' },
    });
    return Object.assign(rg, { requirements });
  }
}
