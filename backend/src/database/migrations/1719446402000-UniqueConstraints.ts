import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueConstraints1719446402000 implements MigrationInterface {
  name = 'UniqueConstraints1719446402000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "programs"
        ADD CONSTRAINT "UQ_programs_abbreviation" UNIQUE ("abbreviation")
    `);

    await queryRunner.query(`
      ALTER TABLE "requirement_groups"
        ADD CONSTRAINT "UQ_rg_catalog_year_name" UNIQUE ("catalog_year_id", "name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "requirement_groups"
        DROP CONSTRAINT "UQ_rg_catalog_year_name"
    `);

    await queryRunner.query(`
      ALTER TABLE "programs"
        DROP CONSTRAINT "UQ_programs_abbreviation"
    `);
  }
}
