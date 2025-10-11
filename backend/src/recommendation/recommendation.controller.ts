import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('related/:productId')
  getRelated(@Param('productId') productId: string) {
    return this.recommendationService.getRelatedProducts(+productId);
  }

  @Get('popular')
  getPopular() {
    return this.recommendationService.getPopularProducts();
  }
}
