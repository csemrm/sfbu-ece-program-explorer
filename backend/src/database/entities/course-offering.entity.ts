import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AcademicTerm } from './academic-term.entity';
import { Course } from './course.entity';

/** A course offered in a given academic term. Curated by admins. */
@Entity('course_offerings')
@Index(['termId', 'courseId'], { unique: true })
export class CourseOffering {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'term_id', type: 'uuid' })
  @Index()
  termId: string;

  @Column({ name: 'course_id', type: 'uuid' })
  @Index()
  courseId: string;

  @ManyToOne(() => AcademicTerm, (term) => term.offerings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'term_id' })
  term: AcademicTerm;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
