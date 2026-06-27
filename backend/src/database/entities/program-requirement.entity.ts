import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequirementGroup } from './requirement-group.entity';
import { Course } from './course.entity';

@Entity('program_requirements')
@Index(['requirementGroupId', 'courseId'])
export class ProgramRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'requirement_group_id', type: 'uuid' })
  @Index()
  requirementGroupId: string;

  @Column({ name: 'course_id', type: 'uuid', nullable: true })
  @Index()
  courseId: string | null;

  @Column({
    name: 'min_credits',
    type: 'numeric',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  minCredits: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => RequirementGroup, (rg) => rg.programRequirements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requirement_group_id' })
  requirementGroup: RequirementGroup;

  @ManyToOne(() => Course, (course) => course.programRequirements, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'course_id' })
  course: Course | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
