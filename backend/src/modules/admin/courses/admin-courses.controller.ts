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
import { ILike, Repository } from 'typeorm';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Course, CourseLevel } from '../../../database/entities/course.entity';
import { Prerequisite } from '../../../database/entities/prerequisite.entity';
import { Corequisite } from '../../../database/entities/corequisite.entity';
import { AdminAuditService } from '../admin-audit.service';

class UpsertCourseDto {
  @IsString() courseCode: string;
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber() @Min(0) creditHours: number;
  @IsEnum(CourseLevel) level: CourseLevel;
}

class QueryDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() level?: string;
  @IsOptional() @IsString() page?: string;
}

class PrereqDto {
  @IsUUID() prerequisiteCourseId: string;
}

class CoreqDto {
  @IsUUID() corequisiteCourseId: string;
}

@Controller('admin/courses')
@UseGuards(JwtAuthGuard)
export class AdminCoursesController {
  constructor(
    @InjectRepository(Course) private readonly repo: Repository<Course>,
    @InjectRepository(Prerequisite)
    private readonly prereqRepo: Repository<Prerequisite>,
    @InjectRepository(Corequisite)
    private readonly coreqRepo: Repository<Corequisite>,
    private readonly audit: AdminAuditService,
  ) {}

  @Get()
  async findAll(@Query() q: QueryDto) {
    const page = Math.max(1, parseInt(q.page ?? '1', 10));
    const limit = 20;
    const where: Record<string, unknown> = {};
    if (q.q) where.title = ILike(`%${q.q}%`);
    if (q.level) where.level = q.level;
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { courseCode: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Course ${id} not found`);
    const [prerequisites, corequisites] = await Promise.all([
      this.prereqRepo.find({ where: { courseId: id } }),
      this.coreqRepo.find({ where: { courseId: id } }),
    ]);
    return { ...c, prerequisites, corequisites };
  }

  @Post()
  async create(
    @Body() dto: UpsertCourseDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const course = this.repo.create(dto);
    await this.repo.save(course);
    await this.audit.log(req.user, 'create', 'course', course.id, {
      code: course.courseCode,
    });
    return course;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpsertCourseDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    Object.assign(course, dto);
    await this.repo.save(course);
    await this.audit.log(req.user, 'update', 'course', id, {
      code: dto.courseCode,
    });
    return course;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    await this.repo.remove(course);
    await this.audit.log(req.user, 'delete', 'course', id);
    return { success: true };
  }

  @Post(':id/prerequisites')
  async addPrereq(
    @Param('id') id: string,
    @Body() dto: PrereqDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const existing = await this.prereqRepo.findOne({
      where: { courseId: id, prerequisiteCourseId: dto.prerequisiteCourseId },
    });
    if (!existing) {
      await this.prereqRepo.save(
        this.prereqRepo.create({
          courseId: id,
          prerequisiteCourseId: dto.prerequisiteCourseId,
        }),
      );
    }
    await this.audit.log(req.user, 'add_prereq', 'course', id, {
      prerequisiteCourseId: dto.prerequisiteCourseId,
    });
    return { success: true };
  }

  @Delete(':id/prerequisites/:prereqId')
  async removePrereq(
    @Param('id') id: string,
    @Param('prereqId') prereqId: string,
    @Req() req: { user: { id: string; email: string } },
  ) {
    await this.prereqRepo.delete({
      courseId: id,
      prerequisiteCourseId: prereqId,
    });
    await this.audit.log(req.user, 'remove_prereq', 'course', id, { prereqId });
    return { success: true };
  }

  @Post(':id/corequisites')
  async addCoreq(
    @Param('id') id: string,
    @Body() dto: CoreqDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    const existing = await this.coreqRepo.findOne({
      where: { courseId: id, corequisiteCourseId: dto.corequisiteCourseId },
    });
    if (!existing) {
      await this.coreqRepo.save(
        this.coreqRepo.create({
          courseId: id,
          corequisiteCourseId: dto.corequisiteCourseId,
        }),
      );
    }
    await this.audit.log(req.user, 'add_coreq', 'course', id, {
      corequisiteCourseId: dto.corequisiteCourseId,
    });
    return { success: true };
  }

  @Delete(':id/corequisites/:coreqId')
  async removeCoreq(
    @Param('id') id: string,
    @Param('coreqId') coreqId: string,
    @Req() req: { user: { id: string; email: string } },
  ) {
    await this.coreqRepo.delete({ courseId: id, corequisiteCourseId: coreqId });
    await this.audit.log(req.user, 'remove_coreq', 'course', id, { coreqId });
    return { success: true };
  }
}
