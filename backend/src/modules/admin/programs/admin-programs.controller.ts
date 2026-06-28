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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

function throwIfDuplicate(err: unknown, message: string): never {
  if ((err as { code?: string }).code === '23505')
    throw new ConflictException(message);
  throw err as Error;
}
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Program } from '../../../database/entities/program.entity';
import { AdminAuditService } from '../admin-audit.service';

class UpsertProgramDto {
  @IsString() name: string;
  @IsString() abbreviation: string;
  @IsOptional() @IsString() description?: string;
}

class QueryDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() page?: string;
}

@Controller('admin/programs')
@UseGuards(JwtAuthGuard)
export class AdminProgramsController {
  constructor(
    @InjectRepository(Program) private readonly repo: Repository<Program>,
    private readonly audit: AdminAuditService,
  ) {}

  @Get()
  async findAll(@Query() q: QueryDto) {
    const page = Math.max(1, parseInt(q.page ?? '1', 10));
    const limit = 20;
    const where = q.q ? { name: ILike(`%${q.q}%`) } : {};
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Program ${id} not found`);
    return p;
  }

  @Post()
  async create(
    @Body() dto: UpsertProgramDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const program = this.repo.create(dto);
    try {
      await this.repo.save(program);
    } catch (err) {
      throwIfDuplicate(
        err,
        `A program with abbreviation "${dto.abbreviation}" already exists.`,
      );
    }
    await this.audit.log(req.user, 'create', 'program', program.id, {
      name: program.name,
    });
    return program;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpsertProgramDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const program = await this.repo.findOne({ where: { id } });
    if (!program) throw new NotFoundException(`Program ${id} not found`);
    Object.assign(program, dto);
    try {
      await this.repo.save(program);
    } catch (err) {
      throwIfDuplicate(
        err,
        `A program with abbreviation "${dto.abbreviation}" already exists.`,
      );
    }
    await this.audit.log(req.user, 'update', 'program', id, { name: dto.name });
    return program;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const program = await this.repo.findOne({ where: { id } });
    if (!program) throw new NotFoundException(`Program ${id} not found`);
    await this.repo.remove(program);
    await this.audit.log(req.user, 'delete', 'program', id);
    return { success: true };
  }
}
