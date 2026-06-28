import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CatalogYear } from './catalog-year.entity';
import { ProgramRequirement } from './program-requirement.entity';

@Entity('requirement_groups')
@Index(['catalogYearId', 'name'], { unique: true })
export class RequirementGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'catalog_year_id', type: 'uuid' })
  @Index()
  catalogYearId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'min_credits',
    type: 'numeric',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  minCredits: number | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => CatalogYear, (cy) => cy.requirementGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'catalog_year_id' })
  catalogYear: CatalogYear;

  @OneToMany(() => ProgramRequirement, (pr) => pr.requirementGroup)
  programRequirements: ProgramRequirement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
