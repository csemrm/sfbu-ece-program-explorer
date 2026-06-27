import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  CatalogImport,
  CatalogYear,
  Corequisite,
  Course,
  CourseKnowledgeArea,
  KnowledgeArea,
  Prerequisite,
  Program,
  ProgramRequirement,
  RequirementGroup,
} from './entities';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return {
    type: 'postgres',
    url,
    entities: [
      Program,
      CatalogYear,
      RequirementGroup,
      Course,
      KnowledgeArea,
      CourseKnowledgeArea,
      ProgramRequirement,
      Prerequisite,
      Corequisite,
      CatalogImport,
    ],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
  };
}
