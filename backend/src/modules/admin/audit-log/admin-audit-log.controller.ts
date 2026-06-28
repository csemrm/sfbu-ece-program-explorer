import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminAuditService } from '../admin-audit.service';

@Controller('admin/audit-log')
@UseGuards(JwtAuthGuard)
export class AdminAuditLogController {
  constructor(private readonly audit: AdminAuditService) {}

  @Get()
  findAll(@Query('page') page = '1') {
    return this.audit.findAll(Math.max(1, parseInt(page, 10)));
  }
}
