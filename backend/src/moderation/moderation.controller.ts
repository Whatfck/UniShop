import { Controller, Post, Patch, Get, Param, Body } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('submit/:productId')
  submit(@Param('productId') productId: string) {
    return this.moderationService.submitForModeration(+productId);
  }

  @Patch('approve/:productId')
  approve(@Param('productId') productId: string, @Body() body: { moderatorId: string; comment?: string }) {
    return this.moderationService.approveProduct(+productId, body.moderatorId, body.comment);
  }

  @Patch('reject/:productId')
  reject(@Param('productId') productId: string, @Body() body: { moderatorId: string; comment?: string }) {
    return this.moderationService.rejectProduct(+productId, body.moderatorId, body.comment);
  }

  @Get('pending')
  getPending() {
    return this.moderationService.getPendingModerations();
  }

  @Get('status/:productId')
  getStatus(@Param('productId') productId: string) {
    return this.moderationService.getModerationStatus(+productId);
  }
}
