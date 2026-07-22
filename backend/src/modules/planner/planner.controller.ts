import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlannerService } from './planner.service';
import { EvaluatePlanDto, PlanEvaluationDto } from './dto/planner.dto';

@ApiTags('planner')
@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Evaluate a multi-term registration plan against prerequisite rules',
    description:
      'Stateless. Given completed courses and an ordered list of planned terms, returns per-course eligibility, explanations, and suggested next courses. Nothing is persisted.',
  })
  @ApiOkResponse({ type: PlanEvaluationDto })
  evaluate(@Body() dto: EvaluatePlanDto): Promise<PlanEvaluationDto> {
    return this.plannerService.evaluate(dto);
  }
}
