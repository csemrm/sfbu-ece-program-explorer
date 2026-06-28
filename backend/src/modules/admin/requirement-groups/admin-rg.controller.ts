import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirementGroup } from '../../../database/entities/requirement-group.entity';
import { AdminAuditService } from '../admin-audit.service';

class UpsertRgDto {
  @IsUUID() catalogYearId: string;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber() @Min(0) minCredits: number;
  @Type(() => Number) @IsNumber() @Min(0) sortOrder: number;
}

@Controller('admin/requirement-groups')
@UseGuards(JwtAuthGuard)
export class AdminRgController {
  constructor(
    @InjectRepository(RequirementGroup)
    private readonly repo: Repository<RequirementGroup>,
    private readonly audit: AdminAuditService,
  ) {}

  @Get()
  async findAll(
    @Query('catalogYearId') catalogYearId?: string,
    @Query('page') page = '1',
  ) {
    const p = Math.max(1, parseInt(page, 10));
    const where = catalogYearId ? { catalogYearId } : {};
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { sortOrder: 'ASC' },
      skip: (p - 1) * 50,
      take: 50,
    });
    return { data, total, page: p, limit: 50 };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rg = await this.repo.findOne({ where: { id } });
    if (!rg) throw new NotFoundException(`RequirementGroup ${id} not found`);
    return rg;
  }

  @Post()
  async create(
    @Body() dto: UpsertRgDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const rg = this.repo.create(dto);
    await this.repo.save(rg);
    await this.audit.log(req.user, 'create', 'requirement_group', rg.id, {
      name: rg.name,
    });
    return rg;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpsertRgDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const rg = await this.repo.findOne({ where: { id } });
    if (!rg) throw new NotFoundException(`RequirementGroup ${id} not found`);
    Object.assign(rg, dto);
    await this.repo.save(rg);
    await this.audit.log(req.user, 'update', 'requirement_group', id, {
      name: dto.name,
    });
    return rg;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const rg = await this.repo.findOne({ where: { id } });
    if (!rg) throw new NotFoundException(`RequirementGroup ${id} not found`);
    await this.repo.remove(rg);
    await this.audit.log(req.user, 'delete', 'requirement_group', id);
    return { success: true };
  }
}
