import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TermsService } from './terms.service';

@ApiTags('terms')
@Controller('terms')
export class TermsController {
  constructor(private readonly service: TermsService) {}

  @Get()
  @ApiOperation({
    summary: 'List academic terms with the courses offered in each',
    description:
      'Public read-only view of admin-curated offerings. Returns terms in chronological (sortOrder) order, each with the IDs of the courses offered in it — enough for the planner to bind a slot to a real semester.',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one academic term with its offered courses',
    description:
      'Each course carries its registration status (openForRegistration, sectionCount, statusNote). With programId, every course also reports inProgram — the whole term is still returned so the caller can show how many offerings fall outside the degree and offer to reveal them.',
  })
  @ApiQuery({
    name: 'programId',
    required: false,
    description:
      'Scope the offerings to a degree. Courses outside it are still returned, flagged inProgram: false.',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('programId', new ParseUUIDPipe({ optional: true }))
    programId?: string,
  ) {
    return this.service.findOne(id, programId);
  }
}
