import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseKnowledgeArea } from './course-knowledge-area.entity';
import { Prerequisite } from './prerequisite.entity';
import { Corequisite } from './corequisite.entity';
import { ProgramRequirement } from './program-requirement.entity';

export enum CourseLevel {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_code', type: 'varchar', length: 20, unique: true })
  @Index()
  courseCode: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'credit_hours', type: 'numeric', precision: 4, scale: 1 })
  creditHours: number;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.UNDERGRADUATE,
  })
  level: CourseLevel;

  @OneToMany(() => ProgramRequirement, (pr) => pr.course)
  programRequirements: ProgramRequirement[];

  @OneToMany(() => CourseKnowledgeArea, (cka) => cka.course)
  courseKnowledgeAreas: CourseKnowledgeArea[];

  @OneToMany(() => Prerequisite, (p) => p.course)
  prerequisites: Prerequisite[];

  @OneToMany(() => Prerequisite, (p) => p.prerequisiteCourse)
  prerequisiteOf: Prerequisite[];

  @OneToMany(() => Corequisite, (c) => c.course)
  corequisites: Corequisite[];

  @OneToMany(() => Corequisite, (c) => c.corequisiteCourse)
  corequisiteOf: Corequisite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
