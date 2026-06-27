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
import { Course } from './course.entity';

@Entity('corequisites')
@Index(['courseId', 'corequisiteCourseId'], { unique: true })
export class Corequisite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  @Index()
  courseId: string;

  @Column({ name: 'corequisite_course_id', type: 'uuid' })
  @Index()
  corequisiteCourseId: string;

  @ManyToOne(() => Course, (course) => course.corequisites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Course, (course) => course.corequisiteOf, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'corequisite_course_id' })
  corequisiteCourse: Course;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
