import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Lets a course state alternative prerequisites — "CS250 or CS360".
 *
 * The model was a plain (course, prerequisite) pair evaluated as a hard AND, so
 * the eight alternatives the catalog states could not be expressed. Recording
 * both sides would have demanded both courses and blocked a student who had
 * satisfied either, so they were omitted entirely — which left CS480, CS480L,
 * CS556, DS520 and DS565 looking as though they had no prerequisites at all.
 * Both readings are wrong; this is the fix.
 *
 * Rows sharing a non-null `alternative_group` for the same course are
 * alternatives: satisfying any one of them satisfies the group. Separate groups
 * are still ANDed, as are rows with a null group — so every prerequisite that
 * existed before this migration keeps exactly its current meaning.
 *
 * The group is scoped per course, not globally, so a small integer suffices and
 * the existing (course_id, prerequisite_course_id) uniqueness still holds: a
 * course may not name the same prerequisite twice whichever group it is in.
 */
export class DisjunctivePrerequisites1719446406000 implements MigrationInterface {
  name = 'DisjunctivePrerequisites1719446406000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prerequisites" ADD COLUMN "alternative_group" smallint`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_prerequisites_alternative_group" ON "prerequisites" ("course_id", "alternative_group")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_prerequisites_alternative_group"`);
    await queryRunner.query(
      `ALTER TABLE "prerequisites" DROP COLUMN "alternative_group"`,
    );
  }
}
