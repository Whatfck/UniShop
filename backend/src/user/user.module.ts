import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Metric } from '../metrics/entities/metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Metric])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}