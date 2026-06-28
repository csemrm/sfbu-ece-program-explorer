import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1719446400000 implements MigrationInterface {
  name = 'InitialSchema1719446400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // programs
    await queryRunner.query(`
      CREATE TABLE "programs" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "abbreviation" varchar(20) NOT NULL,
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_programs" PRIMARY KEY ("id")
      )
    `);

    // catalog_years
    await queryRunner.query(`
      CREATE TABLE "catalog_years" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "program_id" uuid NOT NULL,
        "academic_year" varchar(20) NOT NULL,
        "effective_date" date,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_catalog_years" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_catalog_years_program_year" UNIQUE ("program_id", "academic_year")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_years_program_id" ON "catalog_years" ("program_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_years_academic_year" ON "catalog_years" ("academic_year")`,
    );
    await queryRunner.query(`
      ALTER TABLE "catalog_years"
        ADD CONSTRAINT "FK_catalog_years_program_id"
        FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT
    `);

    // courses
    await queryRunner.query(`
      CREATE TYPE "courses_level_enum" AS ENUM ('undergraduate', 'graduate')
    `);
    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "course_code" varchar(20) NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text,
        "credit_hours" numeric(4,1) NOT NULL,
        "level" "courses_level_enum" NOT NULL DEFAULT 'undergraduate',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_courses_course_code" UNIQUE ("course_code")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_courses_course_code" ON "courses" ("course_code")`,
    );

    // knowledge_areas
    await queryRunner.query(`
      CREATE TABLE "knowledge_areas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_knowledge_areas" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_knowledge_areas_name" UNIQUE ("name")
      )
    `);

    // requirement_groups
    await queryRunner.query(`
      CREATE TABLE "requirement_groups" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "catalog_year_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "min_credits" numeric(5,1),
        "sort_order" int NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_requirement_groups" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_requirement_groups_catalog_year_id" ON "requirement_groups" ("catalog_year_id")`,
    );
    await queryRunner.query(`
      ALTER TABLE "requirement_groups"
        ADD CONSTRAINT "FK_requirement_groups_catalog_year_id"
        FOREIGN KEY ("catalog_year_id") REFERENCES "catalog_years"("id") ON DELETE CASCADE
    `);

    // course_knowledge_areas
    await queryRunner.query(`
      CREATE TABLE "course_knowledge_areas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "course_id" uuid NOT NULL,
        "knowledge_area_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_course_knowledge_areas" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_course_knowledge_areas" UNIQUE ("course_id", "knowledge_area_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_course_knowledge_areas_course_id" ON "course_knowledge_areas" ("course_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_course_knowledge_areas_knowledge_area_id" ON "course_knowledge_areas" ("knowledge_area_id")`,
    );
    await queryRunner.query(`
      ALTER TABLE "course_knowledge_areas"
        ADD CONSTRAINT "FK_course_knowledge_areas_course_id"
        FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "course_knowledge_areas"
        ADD CONSTRAINT "FK_course_knowledge_areas_knowledge_area_id"
        FOREIGN KEY ("knowledge_area_id") REFERENCES "knowledge_areas"("id") ON DELETE CASCADE
    `);

    // program_requirements
    await queryRunner.query(`
      CREATE TABLE "program_requirements" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "requirement_group_id" uuid NOT NULL,
        "course_id" uuid,
        "min_credits" numeric(5,1),
        "description" text,
        "sort_order" int NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_program_requirements" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_program_requirements_group_id" ON "program_requirements" ("requirement_group_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_program_requirements_course_id" ON "program_requirements" ("course_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_program_requirements_group_course" ON "program_requirements" ("requirement_group_id", "course_id")`,
    );
    await queryRunner.query(`
      ALTER TABLE "program_requirements"
        ADD CONSTRAINT "FK_program_requirements_group_id"
        FOREIGN KEY ("requirement_group_id") REFERENCES "requirement_groups"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "program_requirements"
        ADD CONSTRAINT "FK_program_requirements_course_id"
        FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT
    `);

    // prerequisites
    await queryRunner.query(`
      CREATE TABLE "prerequisites" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "course_id" uuid NOT NULL,
        "prerequisite_course_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_prerequisites" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_prerequisites" UNIQUE ("course_id", "prerequisite_course_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_prerequisites_course_id" ON "prerequisites" ("course_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_prerequisites_prerequisite_course_id" ON "prerequisites" ("prerequisite_course_id")`,
    );
    await queryRunner.query(`
      ALTER TABLE "prerequisites"
        ADD CONSTRAINT "FK_prerequisites_course_id"
        FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "prerequisites"
        ADD CONSTRAINT "FK_prerequisites_prerequisite_course_id"
        FOREIGN KEY ("prerequisite_course_id") REFERENCES "courses"("id") ON DELETE CASCADE
    `);

    // corequisites
    await queryRunner.query(`
      CREATE TABLE "corequisites" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "course_id" uuid NOT NULL,
        "corequisite_course_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_corequisites" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_corequisites" UNIQUE ("course_id", "corequisite_course_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_corequisites_course_id" ON "corequisites" ("course_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_corequisites_corequisite_course_id" ON "corequisites" ("corequisite_course_id")`,
    );
    await queryRunner.query(`
      ALTER TABLE "corequisites"
        ADD CONSTRAINT "FK_corequisites_course_id"
        FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "corequisites"
        ADD CONSTRAINT "FK_corequisites_corequisite_course_id"
        FOREIGN KEY ("corequisite_course_id") REFERENCES "courses"("id") ON DELETE CASCADE
    `);

    // catalog_imports
    await queryRunner.query(`
      CREATE TYPE "catalog_imports_status_enum" AS ENUM ('pending', 'completed', 'failed')
    `);
    await queryRunner.query(`
      CREATE TABLE "catalog_imports" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "catalog_year_id" uuid NOT NULL,
        "imported_at" TIMESTAMP WITH TIME ZONE,
        "source_file" varchar(500),
        "status" "catalog_imports_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_catalog_imports" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_catalog_imports_catalog_year_id" UNIQUE ("catalog_year_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_imports_catalog_year_id" ON "catalog_imports" ("catalog_year_id")`,
    );
    await queryRunner.query(`
      ALTER TABLE "catalog_imports"
        ADD CONSTRAINT "FK_catalog_imports_catalog_year_id"
        FOREIGN KEY ("catalog_year_id") REFERENCES "catalog_years"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "catalog_imports" DROP CONSTRAINT "FK_catalog_imports_catalog_year_id"`,
    );
    await queryRunner.query(`DROP TABLE "catalog_imports"`);
    await queryRunner.query(`DROP TYPE "catalog_imports_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "corequisites" DROP CONSTRAINT "FK_corequisites_corequisite_course_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "corequisites" DROP CONSTRAINT "FK_corequisites_course_id"`,
    );
    await queryRunner.query(`DROP TABLE "corequisites"`);
    await queryRunner.query(
      `ALTER TABLE "prerequisites" DROP CONSTRAINT "FK_prerequisites_prerequisite_course_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prerequisites" DROP CONSTRAINT "FK_prerequisites_course_id"`,
    );
    await queryRunner.query(`DROP TABLE "prerequisites"`);
    await queryRunner.query(
      `ALTER TABLE "program_requirements" DROP CONSTRAINT "FK_program_requirements_course_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_requirements" DROP CONSTRAINT "FK_program_requirements_group_id"`,
    );
    await queryRunner.query(`DROP TABLE "program_requirements"`);
    await queryRunner.query(
      `ALTER TABLE "course_knowledge_areas" DROP CONSTRAINT "FK_course_knowledge_areas_knowledge_area_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_knowledge_areas" DROP CONSTRAINT "FK_course_knowledge_areas_course_id"`,
    );
    await queryRunner.query(`DROP TABLE "course_knowledge_areas"`);
    await queryRunner.query(
      `ALTER TABLE "requirement_groups" DROP CONSTRAINT "FK_requirement_groups_catalog_year_id"`,
    );
    await queryRunner.query(`DROP TABLE "requirement_groups"`);
    await queryRunner.query(`DROP TABLE "knowledge_areas"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TYPE "courses_level_enum"`);
    await queryRunner.query(
      `ALTER TABLE "catalog_years" DROP CONSTRAINT "FK_catalog_years_program_id"`,
    );
    await queryRunner.query(`DROP TABLE "catalog_years"`);
    await queryRunner.query(`DROP TABLE "programs"`);
  }
}
