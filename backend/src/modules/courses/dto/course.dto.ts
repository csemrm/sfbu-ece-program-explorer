import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CourseLevel } from '../../../database/entities/course.entity';

export class QueryCoursesDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by code or title keyword' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: CourseLevel })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;
}

export class CourseDto {
  @ApiProperty() id: string;
  @ApiProperty() courseCode: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiProperty() creditHours: number;
  @ApiProperty({ enum: CourseLevel }) level: CourseLevel;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class PrerequisiteDto {
  @ApiProperty() id: string;
  @ApiProperty() courseCode: string;
  @ApiProperty() title: string;
  @ApiProperty() creditHours: number;
  @ApiProperty({ enum: CourseLevel }) level: CourseLevel;
}

export class CoursePrerequisitesDto {
  @ApiProperty() courseId: string;
  @ApiProperty() courseCode: string;
  @ApiProperty({ type: [PrerequisiteDto] }) prerequisites: PrerequisiteDto[];
  @ApiProperty({ type: [PrerequisiteDto] }) corequisites: PrerequisiteDto[];
}
