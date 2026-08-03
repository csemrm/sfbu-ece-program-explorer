import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Prerequisite,
      Corequisite,
      AcademicTerm,
      CourseOffering,
      ProgramRequirement,
    ]),
  ],
  controllers: [PlannerController],
  providers: [PlannerService],
})
export class PlannerModule {}
