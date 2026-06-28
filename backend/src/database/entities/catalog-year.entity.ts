import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Program } from './program.entity';
import { RequirementGroup } from './requirement-group.entity';
import { CatalogImport } from './catalog-import.entity';

@Entity('catalog_years')
@Index(['programId', 'academicYear'], { unique: true })
export class CatalogYear {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'program_id', type: 'uuid' })
  @Index()
  programId: string;

  @Column({ name: 'academic_year', type: 'varchar', length: 20 })
  @Index()
  academicYear: string;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate: string | null;

  @ManyToOne(() => Program, (program) => program.catalogYears, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @OneToMany(() => RequirementGroup, (group) => group.catalogYear)
  requirementGroups: RequirementGroup[];

  @OneToOne(() => CatalogImport, (ci) => ci.catalogYear)
  catalogImport: CatalogImport;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
