import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Program } from '../../database/entities/program.entity';
import { Course } from '../../database/entities/course.entity';
import { CatalogYear } from '../../database/entities/catalog-year.entity';
import { RequirementGroup } from '../../database/entities/requirement-group.entity';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { AdminAuditService } from './admin-audit.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { AdminProgramsController } from './programs/admin-programs.controller';
import { AdminCoursesController } from './courses/admin-courses.controller';
import { AdminRgController } from './requirement-groups/admin-rg.controller';
import { AdminKaController } from './knowledge-areas/admin-ka.controller';
import { AdminCyController } from './catalog-years/admin-cy.controller';
import { AdminAuditLogController } from './audit-log/admin-audit-log.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Program,
      Course,
      CatalogYear,
      RequirementGroup,
      KnowledgeArea,
      Prerequisite,
      Corequisite,
      AuditLog,
    ]),
    AuthModule,
  ],
  controllers: [
    DashboardController,
    AdminProgramsController,
    AdminCoursesController,
    AdminRgController,
    AdminKaController,
    AdminCyController,
    AdminAuditLogController,
  ],
  providers: [AdminAuditService],
})
export class AdminModule {}
