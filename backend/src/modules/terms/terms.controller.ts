import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
