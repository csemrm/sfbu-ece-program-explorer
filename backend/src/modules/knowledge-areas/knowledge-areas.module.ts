import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeArea } from '../../database/entities/knowledge-area.entity';
import { KnowledgeAreasController } from './knowledge-areas.controller';
import { KnowledgeAreasService } from './knowledge-areas.service';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeArea])],
  controllers: [KnowledgeAreasController],
  providers: [KnowledgeAreasService],
  exports: [KnowledgeAreasService],
})
export class KnowledgeAreasModule {}
