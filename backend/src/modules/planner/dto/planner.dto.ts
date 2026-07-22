import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { CourseLevel } from '../../../database/entities/course.entity';

/** One planned semester: the set of courses the user intends to register for. */
export class PlannerTermDto {
  @ApiProperty({
    type: [String],
    description:
      'Course IDs planned for this term (order within a term is irrelevant)',
  })
  @IsArray()
  @ArrayMaxSize(30)
  @IsUUID('4', { each: true })
  courseIds: string[];
}

/** Request body for POST /planner/evaluate. Stateless — nothing is persisted. */
export class EvaluatePlanDto {
  @ApiProperty({
    type: [String],
    description:
      'Course IDs the user has already completed before the plan begins',
  })
  @IsArray()
  @ArrayMaxSize(200)
  @IsUUID('4', { each: true })
  completedCourseIds: string[];

  @ApiProperty({
    type: [PlannerTermDto],
    description:
      'Ordered list of planned terms; earlier terms feed later terms as completed',
  })
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => PlannerTermDto)
  terms: PlannerTermDto[];
}

// ── Response shapes ─────────────────────────────────────────────

export class PlannerCourseRefDto {
  @ApiProperty() id: string;
  @ApiProperty() courseCode: string;
  @ApiProperty() title: string;
  @ApiProperty() creditHours: number;
  @ApiProperty({ enum: CourseLevel }) level: CourseLevel;
}

export class MissingPrerequisiteDto extends PlannerCourseRefDto {
  @ApiProperty({
    nullable: true,
    description:
      'If this unmet prerequisite is itself planned in a later term, its 1-based term number (an ordering conflict); otherwise null',
  })
  plannedInLaterTerm: number | null;
}

export type CorequisiteStatus = 'completed' | 'same-term' | 'unmet';

export class CorequisiteStatusDto extends PlannerCourseRefDto {
  @ApiProperty({
    enum: ['completed', 'same-term', 'unmet'],
    description:
      'completed = already done or in an earlier term; same-term = taken alongside this course; unmet = not scheduled',
  })
  status: CorequisiteStatus;
}

export class EvaluatedCourseDto {
  @ApiProperty() courseId: string;
  @ApiProperty() courseCode: string;
  @ApiProperty() title: string;
  @ApiProperty() creditHours: number;
  @ApiProperty({ enum: CourseLevel }) level: CourseLevel;

  @ApiProperty({
    description:
      'True when every prerequisite is met and no corequisite is unmet',
  })
  eligible: boolean;

  @ApiProperty({
    description:
      'True when this course is also in the completed set (likely a mistake to re-plan)',
  })
  alreadyCompleted: boolean;

  @ApiProperty({ type: [PlannerCourseRefDto] })
  satisfiedPrerequisites: PlannerCourseRefDto[];

  @ApiProperty({ type: [MissingPrerequisiteDto] })
  missingPrerequisites: MissingPrerequisiteDto[];

  @ApiProperty({ type: [CorequisiteStatusDto] })
  corequisites: CorequisiteStatusDto[];

  @ApiProperty({ description: 'Human-readable explanation of the verdict' })
  reason: string;
}

export class EvaluatedTermDto {
  @ApiProperty({ description: '1-based term number' }) term: number;
  @ApiProperty() termCredits: number;
  @ApiProperty({ type: [EvaluatedCourseDto] }) courses: EvaluatedCourseDto[];
}

export class PlanEvaluationDto {
  @ApiProperty({ type: [EvaluatedTermDto] }) terms: EvaluatedTermDto[];

  @ApiProperty({
    type: [PlannerCourseRefDto],
    description:
      'Courses not yet taken whose prerequisites are all satisfied once the whole plan is complete',
  })
  suggestions: PlannerCourseRefDto[];

  @ApiProperty() totalPlannedCredits: number;

  @ApiProperty({
    description: 'True when every planned course in every term is eligible',
  })
  allEligible: boolean;
}
