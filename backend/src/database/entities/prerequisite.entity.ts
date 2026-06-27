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

@Entity('prerequisites')
@Index(['courseId', 'prerequisiteCourseId'], { unique: true })
export class Prerequisite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  @Index()
  courseId: string;

  @Column({ name: 'prerequisite_course_id', type: 'uuid' })
  @Index()
  prerequisiteCourseId: string;

  @ManyToOne(() => Course, (course) => course.prerequisites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Course, (course) => course.prerequisiteOf, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prerequisite_course_id' })
  prerequisiteCourse: Course;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
