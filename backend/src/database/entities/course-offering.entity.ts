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

  /**
   * Whether registration is actually open.
   *
   * Distinct from the offering existing at all: the registration list carries
   * courses that run but are closed, and a planner that conflates the two tells
   * a student they can enrol in something they cannot. Defaults true so
   * offerings curated before this column existed keep their prior meaning.
   */
  @Column({ name: 'open_for_registration', type: 'boolean', default: true })
  openForRegistration: boolean;

  /** Sections on the published schedule. Null when not stated. */
  @Column({ name: 'section_count', type: 'integer', nullable: true })
  sectionCount: number | null;

  /**
   * Registrar's note, verbatim — "Cancelled due to low enrollment" and the like.
   * Kept as free text rather than an enum because it is the registrar's wording
   * and a student is better served by the actual reason than by a category.
   */
  @Column({ name: 'status_note', type: 'text', nullable: true })
  statusNote: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
