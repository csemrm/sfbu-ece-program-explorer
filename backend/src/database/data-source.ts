import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
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
  AdminUser,
  AuditLog,
} from './entities';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
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
    AdminUser,
    AuditLog,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
