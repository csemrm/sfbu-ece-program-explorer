import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryProgramsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by abbreviation (e.g. BSCS)' })
  @IsOptional()
  @IsString()
  abbreviation?: string;
}

export class ProgramDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() abbreviation: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class RequirementGroupSummaryDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiPropertyOptional({ nullable: true }) minCredits: number | null;
  @ApiProperty() sortOrder: number;
}

export class CatalogYearWithGroupsDto {
  @ApiProperty() id: string;
  @ApiProperty() academicYear: string;
  @ApiPropertyOptional({ nullable: true }) effectiveDate: string | null;
  @ApiProperty({ type: [RequirementGroupSummaryDto] })
  requirementGroups: RequirementGroupSummaryDto[];
}

export class ProgramRequirementsDto {
  @ApiProperty() programId: string;
  @ApiProperty() programName: string;
  @ApiProperty({ type: [CatalogYearWithGroupsDto] })
  catalogYears: CatalogYearWithGroupsDto[];
}

export class RoadmapCourseDto {
  @ApiProperty() id: string;
  @ApiProperty() courseCode: string;
  @ApiProperty() title: string;
  @ApiProperty() creditHours: number;
  @ApiProperty() level: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
}

export class RoadmapPhaseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiPropertyOptional({ nullable: true }) minCredits: number | null;
  @ApiProperty() sortOrder: number;
  @ApiProperty({ type: [RoadmapCourseDto] }) courses: RoadmapCourseDto[];
}

export class ProgramRoadmapDto {
  @ApiProperty() programId: string;
  @ApiProperty() programName: string;
  @ApiProperty() programAbbreviation: string;
  @ApiProperty() catalogYearId: string;
  @ApiProperty() academicYear: string;
  @ApiProperty({ type: [RoadmapPhaseDto] }) phases: RoadmapPhaseDto[];
}

export class GraphNodeDto {
  @ApiProperty() id: string;
  @ApiProperty() courseCode: string;
  @ApiProperty() title: string;
  @ApiProperty() creditHours: number;
  @ApiProperty() level: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiProperty() inProgram: boolean;
}

export class GraphEdgeDto {
  @ApiProperty() id: string;
  @ApiProperty() sourceId: string;
  @ApiProperty() targetId: string;
  @ApiProperty({ enum: ['prerequisite', 'corequisite'] }) type: string;
}

export class ProgramGraphDto {
  @ApiProperty() programId: string;
  @ApiProperty() programName: string;
  @ApiProperty() programAbbreviation: string;
  @ApiPropertyOptional({ nullable: true }) academicYear: string | null;
  @ApiProperty({ type: [GraphNodeDto] }) nodes: GraphNodeDto[];
  @ApiProperty({ type: [GraphEdgeDto] }) edges: GraphEdgeDto[];
}
