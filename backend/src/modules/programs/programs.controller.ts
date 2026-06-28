import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import {
  ProgramDto,
  ProgramRequirementsDto,
  ProgramRoadmapDto,
  QueryProgramsDto,
} from './dto/program.dto';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @ApiOperation({ summary: 'List all programs' })
  @ApiOkResponse({ description: 'Paginated list of programs' })
  findAll(@Query() query: QueryProgramsDto) {
    return this.programsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID' })
  @ApiOkResponse({ type: ProgramDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.programsService.findOne(id);
  }

  @Get(':id/requirements')
  @ApiOperation({
    summary: 'Get all requirement groups for a program (all catalog years)',
  })
  @ApiOkResponse({ type: ProgramRequirementsDto })
  findRequirements(@Param('id', ParseUUIDPipe) id: string) {
    return this.programsService.findRequirements(id);
  }

  @Get(':id/roadmap')
  @ApiOperation({
    summary: 'Get curriculum roadmap for a program (latest catalog year)',
  })
  @ApiOkResponse({ type: ProgramRoadmapDto })
  findRoadmap(@Param('id', ParseUUIDPipe) id: string) {
    return this.programsService.findRoadmap(id);
  }
}
