import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { PhoneVerificationModule } from '../phone-verification/phone-verification.module';
import { MetricsModule } from '../metrics/metrics.module';
import { CustomLogger } from '../common/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    UserModule,
    PhoneVerificationModule,
    MetricsModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, CustomLogger],
  exports: [ProductService],
})
export class ProductModule {}
