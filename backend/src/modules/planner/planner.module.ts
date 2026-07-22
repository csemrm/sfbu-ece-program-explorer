import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Prerequisite, Corequisite])],
  controllers: [PlannerController],
  providers: [PlannerService],
})
export class PlannerModule {}
