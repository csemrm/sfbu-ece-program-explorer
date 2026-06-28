import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogYearsService } from './catalog-years.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('catalog-years')
@Controller('catalog-years')
export class CatalogYearsController {
  constructor(private readonly service: CatalogYearsService) {}

  @Get()
  @ApiOperation({ summary: 'List catalog years' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get catalog year by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
