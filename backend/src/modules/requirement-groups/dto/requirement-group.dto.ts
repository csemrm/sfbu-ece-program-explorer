import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryRequirementGroupsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by catalog year ID' })
  @IsOptional()
  @IsUUID()
  catalogYearId?: string;
}
