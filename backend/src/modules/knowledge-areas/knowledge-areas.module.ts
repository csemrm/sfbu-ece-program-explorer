import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';
import { CourseKnowledgeArea } from '../../database/entities/course-knowledge-area.entity';
import { Course } from '../../database/entities/course.entity';
import { KnowledgeAreasController } from './knowledge-areas.controller';
import { KnowledgeAreasService } from './knowledge-areas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KnowledgeArea, CourseKnowledgeArea, Course]),
  ],
  controllers: [KnowledgeAreasController],
  providers: [KnowledgeAreasService],
  exports: [KnowledgeAreasService],
})
export class KnowledgeAreasModule {}
