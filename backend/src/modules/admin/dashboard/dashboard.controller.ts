import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Program } from '../../../database/entities/program.entity';
import { Course } from '../../../database/entities/course.entity';
import { CatalogYear } from '../../../database/entities/catalog-year.entity';
import { AuditLog } from '../../../database/entities/audit-log.entity';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(CatalogYear)
    private readonly cyRepo: Repository<CatalogYear>,
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  @Get()
  async stats() {
    const [programs, courses, catalogYears, recentActivity] = await Promise.all(
      [
        this.programRepo.count(),
        this.courseRepo.count(),
        this.cyRepo.count(),
        this.auditRepo.find({ order: { createdAt: 'DESC' }, take: 10 }),
      ],
    );
    return { programs, courses, catalogYears, recentActivity };
  }
}
