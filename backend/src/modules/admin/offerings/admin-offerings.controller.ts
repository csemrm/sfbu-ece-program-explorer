import {
  Body,
  ConflictException,
  Controller,
  Delete,
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
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AcademicTerm } from '../../../database/entities/academic-term.entity';
import { CourseOffering } from '../../../database/entities/course-offering.entity';
import { AdminAuditService } from '../admin-audit.service';

class CreateTermDto {
  @IsString() @Length(1, 100) name: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) sortOrder?: number;
}

class CreateOfferingDto {
  @IsUUID() termId: string;
  @IsUUID() courseId: string;
}

function throwIfDuplicate(err: unknown, message: string): never {
  if ((err as { code?: string }).code === '23505')
    throw new ConflictException(message);
  throw err as Error;
}

type Actor = { user: { id: string; email: string } };

@Controller('admin/offerings')
@UseGuards(JwtAuthGuard)
export class AdminOfferingsController {
  constructor(
    @InjectRepository(AcademicTerm)
    private readonly termRepo: Repository<AcademicTerm>,
    @InjectRepository(CourseOffering)
    private readonly offeringRepo: Repository<CourseOffering>,
    private readonly audit: AdminAuditService,
  ) {}

  // ── Terms ─────────────────────────────────────────────────────

  @Get('terms')
  listTerms() {
    return this.termRepo.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
  }

  @Post('terms')
  async createTerm(@Body() dto: CreateTermDto, @Req() req: Actor) {
    const term = this.termRepo.create({
      name: dto.name,
      sortOrder: dto.sortOrder ?? 0,
    });
    try {
      await this.termRepo.save(term);
    } catch (err) {
      throwIfDuplicate(err, `A term named "${dto.name}" already exists.`);
    }
    await this.audit.log(req.user, 'create', 'academic_term', term.id, {
      name: term.name,
    });
    return term;
  }

  @Delete('terms/:id')
  async deleteTerm(@Param('id') id: string, @Req() req: Actor) {
    const term = await this.termRepo.findOne({ where: { id } });
    if (!term) throw new NotFoundException(`Term ${id} not found`);
    await this.termRepo.remove(term); // cascades to its offerings
    await this.audit.log(req.user, 'delete', 'academic_term', id, {
      name: term.name,
    });
    return { success: true };
  }

  // ── Offerings ─────────────────────────────────────────────────

  /** List the courses offered in a term, with course details. */
  @Get()
  async listOfferings(@Query('termId') termId: string) {
    if (!termId) return [];
    const offerings = await this.offeringRepo.find({
      where: { termId },
      relations: { course: true },
    });
    return offerings
      .map((o) => ({
        id: o.id,
        courseId: o.courseId,
        course: {
          id: o.course.id,
          courseCode: o.course.courseCode,
          title: o.course.title,
          creditHours: Number(o.course.creditHours),
          level: o.course.level,
        },
      }))
      .sort((a, b) => a.course.courseCode.localeCompare(b.course.courseCode));
  }

  @Post()
  async addOffering(@Body() dto: CreateOfferingDto, @Req() req: Actor) {
    const offering = this.offeringRepo.create({
      termId: dto.termId,
      courseId: dto.courseId,
    });
    try {
      await this.offeringRepo.save(offering);
    } catch (err) {
      throwIfDuplicate(err, 'That course is already offered in this term.');
    }
    await this.audit.log(
      req.user,
      'add_offering',
      'course_offering',
      offering.id,
      {
        termId: dto.termId,
        courseId: dto.courseId,
      },
    );
    return { id: offering.id };
  }

  @Delete(':id')
  async removeOffering(@Param('id') id: string, @Req() req: Actor) {
    const offering = await this.offeringRepo.findOne({ where: { id } });
    if (!offering) throw new NotFoundException(`Offering ${id} not found`);
    await this.offeringRepo.remove(offering);
    await this.audit.log(req.user, 'remove_offering', 'course_offering', id);
    return { success: true };
  }
}
