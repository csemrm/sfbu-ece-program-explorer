import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

function throwIfDuplicate(err: unknown, message: string): never {
  if ((err as { code?: string }).code === '23505')
    throw new ConflictException(message);
  throw err as Error;
}
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { KnowledgeArea } from '../../../database/entities/knowledge-area.entity';
import { AdminAuditService } from '../admin-audit.service';

class UpsertKaDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
}

@Controller('admin/knowledge-areas')
@UseGuards(JwtAuthGuard)
export class AdminKaController {
  constructor(
    @InjectRepository(KnowledgeArea)
    private readonly repo: Repository<KnowledgeArea>,
    private readonly audit: AdminAuditService,
  ) {}

  @Get()
  async findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ka = await this.repo.findOne({ where: { id } });
    if (!ka) throw new NotFoundException(`KnowledgeArea ${id} not found`);
    return ka;
  }

  @Post()
  async create(
    @Body() dto: UpsertKaDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const ka = this.repo.create(dto);
    try {
      await this.repo.save(ka);
    } catch (err) {
      throwIfDuplicate(
        err,
        `A knowledge area named "${dto.name}" already exists.`,
      );
    }
    await this.audit.log(req.user, 'create', 'knowledge_area', ka.id, {
      name: ka.name,
    });
    return ka;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpsertKaDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const ka = await this.repo.findOne({ where: { id } });
    if (!ka) throw new NotFoundException(`KnowledgeArea ${id} not found`);
    Object.assign(ka, dto);
    try {
      await this.repo.save(ka);
    } catch (err) {
      throwIfDuplicate(
        err,
        `A knowledge area named "${dto.name}" already exists.`,
      );
    }
    await this.audit.log(req.user, 'update', 'knowledge_area', id, {
      name: dto.name,
    });
    return ka;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const ka = await this.repo.findOne({ where: { id } });
    if (!ka) throw new NotFoundException(`KnowledgeArea ${id} not found`);
    await this.repo.remove(ka);
    await this.audit.log(req.user, 'delete', 'knowledge_area', id);
    return { success: true };
  }
}
