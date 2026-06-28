import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import {
  CourseDto,
  CoursePrerequisitesDto,
  QueryCoursesDto,
} from './dto/course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List courses with optional filtering' })
  @ApiOkResponse({ description: 'Paginated list of courses' })
  findAll(@Query() query: QueryCoursesDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiOkResponse({ type: CourseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/prerequisites')
  @ApiOperation({ summary: 'Get prerequisites and corequisites for a course' })
  @ApiOkResponse({ type: CoursePrerequisitesDto })
  findPrerequisites(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findPrerequisites(id);
  }
}
