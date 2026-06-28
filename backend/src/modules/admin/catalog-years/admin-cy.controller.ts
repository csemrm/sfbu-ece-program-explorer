import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CatalogYear } from '../../../database/entities/catalog-year.entity';
import { AdminAuditService } from '../admin-audit.service';

class CreateCyDto {
  @IsUUID() programId: string;
  @IsString() academicYear: string;
  @IsOptional() @IsString() effectiveDate?: string;
}

@Controller('admin/catalog-years')
@UseGuards(JwtAuthGuard)
export class AdminCyController {
  constructor(
    @InjectRepository(CatalogYear)
    private readonly repo: Repository<CatalogYear>,
    private readonly audit: AdminAuditService,
  ) {}

  @Get()
  async findAll(@Query('programId') programId?: string) {
    const where = programId ? { programId } : {};
    return this.repo.find({ where, order: { academicYear: 'DESC' } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cy = await this.repo.findOne({
      where: { id },
      relations: { requirementGroups: true },
    });
    if (!cy) throw new NotFoundException(`CatalogYear ${id} not found`);
    return cy;
  }

  @Post()
  async create(
    @Body() dto: CreateCyDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const cy = this.repo.create({
      programId: dto.programId,
      academicYear: dto.academicYear,
      effectiveDate: dto.effectiveDate ?? null,
    });
    await this.repo.save(cy);
    await this.audit.log(req.user, 'create', 'catalog_year', cy.id, {
      academicYear: cy.academicYear,
    });
    return cy;
  }
}
