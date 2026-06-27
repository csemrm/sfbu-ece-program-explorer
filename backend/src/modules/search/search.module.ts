import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../database/entities/course.entity';
import { Program } from '../../database/entities/program.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Program])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
