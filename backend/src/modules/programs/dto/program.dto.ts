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
