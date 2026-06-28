import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CatalogYear } from './catalog-year.entity';

export enum ImportStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('catalog_imports')
export class CatalogImport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'catalog_year_id', type: 'uuid' })
  @Index()
  catalogYearId: string;

  @Column({
    name: 'imported_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  importedAt: Date | null;

  @Column({ name: 'source_file', type: 'varchar', length: 500, nullable: true })
  sourceFile: string | null;

  @Column({ type: 'enum', enum: ImportStatus, default: ImportStatus.PENDING })
  status: ImportStatus;

  @OneToOne(() => CatalogYear, (cy) => cy.catalogImport, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'catalog_year_id' })
  catalogYear: CatalogYear;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
