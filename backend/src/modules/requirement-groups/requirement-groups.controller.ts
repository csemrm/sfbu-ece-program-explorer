import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirementGroupsService } from './requirement-groups.service';
import { QueryRequirementGroupsDto } from './dto/requirement-group.dto';

@ApiTags('requirement-groups')
@Controller('requirement-groups')
export class RequirementGroupsController {
  constructor(private readonly service: RequirementGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List requirement groups' })
  findAll(@Query() query: QueryRequirementGroupsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get requirement group with its course entries' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
