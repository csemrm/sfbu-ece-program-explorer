import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the registration status the official schedule carries but the model did
 * not: whether registration is open, how many sections run, and the registrar's
 * note when a course is cancelled.
 *
 * Until now a seeded offering meant only "runs this term". The Fall 2026 list
 * shows why that is not enough — 32 of its 96 courses run while closed to
 * registration and 16 are cancelled outright, so a planner built on presence
 * alone tells a student to enrol in courses that will not accept them.
 *
 * `open_for_registration` defaults to true so offerings curated before this
 * column existed keep exactly the meaning they were given.
 */
export class OfferingRegistrationStatus1719446405000 implements MigrationInterface {
  name = 'OfferingRegistrationStatus1719446405000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "course_offerings"
        ADD COLUMN "open_for_registration" boolean NOT NULL DEFAULT true,
        ADD COLUMN "section_count" integer,
        ADD COLUMN "status_note" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "course_offerings"
        DROP COLUMN "status_note",
        DROP COLUMN "section_count",
        DROP COLUMN "open_for_registration"
    `);
  }
}
