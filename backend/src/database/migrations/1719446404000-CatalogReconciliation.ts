import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Clears the catalog-derived relationship rows so a reseed rebuilds them from the
 * corrected 2025-2026 catalog data.
 *
 * 59 of 66 seeded courses carried the wrong title — real course codes attached to
 * a generic CS curriculum rather than SFBU's. Courses themselves are repaired in
 * place, because `seed.ts` updates an existing course by code. Everything derived
 * from a course's *identity* is not: prerequisites, corequisites and
 * knowledge-area joins are insert-only, so the links inferred from the wrong
 * titles (CS500 "Advanced Algorithms" requiring CS380 "Analysis of Algorithms",
 * when CS500 is really Object-Oriented Design in Python and CS380 is Operating
 * Systems) would survive a reseed and sit alongside the correct ones.
 *
 * These three tables hold no hand-authored data — there is no admin CRUD for
 * them, they exist only as a projection of the catalog — so clearing and
 * rebuilding is safe and is the only way to drop links that are now wrong.
 */
export class CatalogReconciliation1719446404000 implements MigrationInterface {
  name = 'CatalogReconciliation1719446404000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "prerequisites"`);
    await queryRunner.query(`DELETE FROM "corequisites"`);
    await queryRunner.query(`DELETE FROM "course_knowledge_areas"`);

    // Placeholder requirements (course_id IS NULL) are re-inserted on every
    // reseed because the duplicate check only matches on course_id — so an
    // instance seeded more than once has accumulated copies. Clear them; the
    // seed re-creates exactly one per group.
    await queryRunner.query(
      `DELETE FROM "program_requirements" WHERE "course_id" IS NULL`,
    );

    // The MSEE concentration groups are renamed to the catalog's own wording.
    // Groups are matched by name during seeding, so without this the old groups
    // linger beside the new ones, each still holding its requirements.
    await queryRunner.query(`
      DELETE FROM "requirement_groups"
      WHERE "name" IN (
        'Specialization — IoT and Embedded Systems',
        'Specialization — Multicore and Parallel Computing',
        'Specialization — Modern Integrated Circuits'
      )
    `);
  }

  /**
   * Irreversible by nature: the deleted rows are a projection of seed data, and
   * the pre-migration projection was derived from course titles that no longer
   * exist. Re-running the seed restores the correct rows; restoring the wrong
   * ones is not something a downgrade should do.
   */
  public async down(): Promise<void> {
    // Intentionally empty — see the note above.
  }
}
