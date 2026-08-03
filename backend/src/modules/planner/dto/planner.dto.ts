import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CourseLevel } from '../../../database/entities/course.entity';

/** One planned semester: the set of courses the user intends to register for. */
export class PlannerTermDto {
  @ApiProperty({
    type: [String],
    description:
      "Course IDs to evaluate for this term (order within a term is irrelevant). This is not only what the student has selected: the planner evaluates every course on offer so it can show what is blocked before the student commits, so the bound is a term's full published schedule rather than a plausible course load.",
  })
  @IsArray()
  // Sized for a whole term schedule, not a student's course load. The original
  // limit of 30 was the latter, and rejected every degree the moment Fall 2026
  // was seeded in full — 96 offerings, of which BSCS alone matches 55.
  @ArrayMaxSize(200)
  @IsUUID('4', { each: true })
  courseIds: string[];

  @ApiPropertyOptional({
    description:
      "Optional academic term to bind this slot to. When supplied, each course is also checked against that term's curated offerings. When omitted the term stays offering-agnostic and every course reports offered = null.",
  })
  @IsOptional()
  @IsUUID('4')
  termId?: string;
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

  @ApiPropertyOptional({
    description:
      "Optional degree to evaluate within. Prerequisites outside this program's own course set are treated as background preparation — cleared before admission — and no longer block eligibility. Omit to evaluate against the whole catalog.",
  })
  @IsOptional()
  @IsUUID('4')
  programId?: string;
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
      'True when every prerequisite is met and no corequisite is unmet. Deliberately independent of course availability — see `offered`.',
  })
  eligible: boolean;

  @ApiProperty({
    nullable: true,
    description:
      'Whether this course is offered in the bound academic term. Null when the term has no termId, i.e. offering data does not apply.',
  })
  offered: boolean | null;

  @ApiProperty({
    nullable: true,
    description:
      'Whether the registrar has registration open for this offering. Distinct from `offered`: a cancelled or closed course still runs on the schedule but cannot be enrolled in. Null when offering data does not apply.',
  })
  openForRegistration: boolean | null;

  @ApiProperty({
    nullable: true,
    description:
      'Sections on the published schedule, or null when the schedule does not state one.',
  })
  sectionCount: number | null;

  @ApiProperty({
    nullable: true,
    description:
      "The registrar's note on this offering, verbatim — e.g. 'Cancelled due to low enrollment'. Null when there is none.",
  })
  statusNote: string | null;

  @ApiProperty({
    description:
      'True when the student could actually register: eligible AND not known to be unoffered AND registration is not closed.',
  })
  registrable: boolean;

  @ApiProperty({
    description:
      'True when this course is also in the completed set (likely a mistake to re-plan)',
  })
  alreadyCompleted: boolean;

  @ApiProperty({ type: [PlannerCourseRefDto] })
  satisfiedPrerequisites: PlannerCourseRefDto[];

  @ApiProperty({ type: [MissingPrerequisiteDto] })
  missingPrerequisites: MissingPrerequisiteDto[];

  @ApiProperty({
    type: [PlannerCourseRefDto],
    description:
      "Unmet prerequisites that belong to a different program than the one being evaluated. Reported for transparency but excluded from `eligible`: a graduate programme's admission requirements already cover this ground, so blocking an MSCS student on an undergraduate BSCS course would be wrong. Always empty when no programId is supplied.",
  })
  backgroundPrerequisites: PlannerCourseRefDto[];

  @ApiProperty({ type: [CorequisiteStatusDto] })
  corequisites: CorequisiteStatusDto[];

  @ApiProperty({ description: 'Human-readable explanation of the verdict' })
  reason: string;
}

export class EvaluatedTermDto {
  @ApiProperty({ description: '1-based term number' }) term: number;

  @ApiProperty({
    nullable: true,
    description: 'The academic term this slot was bound to, if any',
  })
  termId: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Display name of the bound academic term (e.g. "Fall 2026")',
  })
  termName: string | null;

  @ApiProperty() termCredits: number;
  @ApiProperty({ type: [EvaluatedCourseDto] }) courses: EvaluatedCourseDto[];
}

export class OfferedTermRefDto {
  @ApiProperty() termId: string;
  @ApiProperty() termName: string;
}

export class SuggestedCourseDto extends PlannerCourseRefDto {
  @ApiProperty({
    type: [OfferedTermRefDto],
    description:
      "Bound terms in this plan that actually offer the course. Empty when no term is bound, or when none of the plan's terms offer it.",
  })
  offeredInTerms: OfferedTermRefDto[];
}

export class PlanEvaluationDto {
  @ApiProperty({ type: [EvaluatedTermDto] }) terms: EvaluatedTermDto[];

  @ApiProperty({
    type: [SuggestedCourseDto],
    description:
      'Courses not yet taken whose prerequisites are all satisfied once the whole plan is complete',
  })
  suggestions: SuggestedCourseDto[];

  @ApiProperty() totalPlannedCredits: number;

  @ApiProperty({
    description: 'True when every planned course in every term is eligible',
  })
  allEligible: boolean;

  @ApiProperty({
    description:
      'True when no planned course is known to be unoffered in its bound term. Vacuously true when no term is bound.',
  })
  allOffered: boolean;
}
