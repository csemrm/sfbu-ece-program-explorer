import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { KnowledgeArea } from './knowledge-area.entity';

@Entity('course_knowledge_areas')
@Index(['courseId', 'knowledgeAreaId'], { unique: true })
export class CourseKnowledgeArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  @Index()
  courseId: string;

  @Column({ name: 'knowledge_area_id', type: 'uuid' })
  @Index()
  knowledgeAreaId: string;

  @ManyToOne(() => Course, (course) => course.courseKnowledgeAreas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => KnowledgeArea, (ka) => ka.courseKnowledgeAreas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'knowledge_area_id' })
  knowledgeArea: KnowledgeArea;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
