import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequirementGroup } from '../../database/entities/requirement-group.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';
import { RequirementGroupsController } from './requirement-groups.controller';
import { RequirementGroupsService } from './requirement-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequirementGroup, ProgramRequirement])],
  controllers: [RequirementGroupsController],
  providers: [RequirementGroupsService],
  exports: [RequirementGroupsService],
})
export class RequirementGroupsModule {}
