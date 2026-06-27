import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { KnowledgeAreasService } from './knowledge-areas.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('knowledge-areas')
@Controller('knowledge-areas')
export class KnowledgeAreasController {
  constructor(private readonly service: KnowledgeAreasService) {}

  @Get()
  @ApiOperation({ summary: 'List knowledge areas' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get knowledge area by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
