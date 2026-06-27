import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RequirementGroupsModule } from './modules/requirement-groups/requirement-groups.module';
import { KnowledgeAreasModule } from './modules/knowledge-areas/knowledge-areas.module';
import { CatalogYearsModule } from './modules/catalog-years/catalog-years.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProgramsModule,
    CoursesModule,
    RequirementGroupsModule,
    KnowledgeAreasModule,
    CatalogYearsModule,
    SearchModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
