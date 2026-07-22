import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseOfferings1719446403000 implements MigrationInterface {
  name = 'CourseOfferings1719446403000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "academic_terms" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_academic_terms_name" UNIQUE ("name"),
        CONSTRAINT "PK_academic_terms" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "course_offerings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "term_id" uuid NOT NULL,
        "course_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_course_offerings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_course_offerings_term_course" UNIQUE ("term_id", "course_id"),
        CONSTRAINT "FK_course_offerings_term" FOREIGN KEY ("term_id")
          REFERENCES "academic_terms" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_course_offerings_course" FOREIGN KEY ("course_id")
          REFERENCES "courses" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_course_offerings_term_id" ON "course_offerings" ("term_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_course_offerings_course_id" ON "course_offerings" ("course_id")`,
    );

    // Seed two starter terms so the offerings tool is usable immediately.
    await queryRunner.query(`
      INSERT INTO "academic_terms" ("name", "sort_order") VALUES
        ('Fall 2026', 1),
        ('Spring 2027', 2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "course_offerings"`);
    await queryRunner.query(`DROP TABLE "academic_terms"`);
  }
}
