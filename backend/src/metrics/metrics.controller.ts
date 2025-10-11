import { Controller, Post, Get, Param } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post('view/:productId')
  incrementView(@Param('productId') productId: string) {
    return this.metricsService.incrementViews(+productId);
  }

  @Post('contact/:productId')
  incrementContact(@Param('productId') productId: string) {
    return this.metricsService.incrementContacts(+productId);
  }

  @Get(':productId')
  getMetrics(@Param('productId') productId: string) {
    return this.metricsService.getMetrics(+productId);
  }

  @Get()
  getAllMetrics() {
    return this.metricsService.getAllMetrics();
  }
}
