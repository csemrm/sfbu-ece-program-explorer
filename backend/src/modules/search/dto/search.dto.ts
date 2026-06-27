import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CourseLevel } from '../../../database/entities/course.entity';

export enum SearchResultType {
  PROGRAM = 'program',
  COURSE = 'course',
}

export class SearchQueryDto extends PaginationDto {
  @ApiProperty({ description: 'Search keyword (min 2 chars)' })
  @IsString()
  @MinLength(2)
  q: string;

  @ApiPropertyOptional({
    enum: SearchResultType,
    description: 'Limit to programs or courses',
  })
  @IsOptional()
  @IsEnum(SearchResultType)
  type?: SearchResultType;

  @ApiPropertyOptional({
    enum: CourseLevel,
    description: 'Filter courses by level',
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;
}

export class SearchResultItemDto {
  @ApiProperty({ enum: SearchResultType }) type: SearchResultType;
  @ApiProperty() id: string;
  @ApiProperty() code: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiPropertyOptional() creditHours?: number;
  @ApiPropertyOptional({ enum: CourseLevel }) level?: CourseLevel;
}
