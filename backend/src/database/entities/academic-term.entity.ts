import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseOffering } from './course-offering.entity';

/**
 * A semester/term in which courses can be offered (e.g. "Fall 2026").
 * `sortOrder` gives chronological ordering so the admin tool can pick a
 * "this semester" and "next semester" pair.
 */
@Entity('academic_terms')
export class AcademicTerm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => CourseOffering, (offering) => offering.term)
  offerings: CourseOffering[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
