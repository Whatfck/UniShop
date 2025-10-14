import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Product } from '../product/entities/product.entity';
import { Metric } from '../metrics/entities/metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Metric])],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
