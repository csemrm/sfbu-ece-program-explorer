import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto, SearchResultItemDto } from './dto/search.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Full-text search across programs and courses' })
  @ApiOkResponse({ description: 'Paginated search results' })
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }
}
