import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Metric } from '../metrics/entities/metric.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
  ) {}

  async getRelatedProducts(productId: number): Promise<Product[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });
    if (!product) return [];

    // Recommendation based on category and popularity (views + contacts)
    // Optimized query with proper indexing hints
    const relatedProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoin('product.metrics', 'metrics')
      .where('product.categoryId = :categoryId', { categoryId: product.categoryId })
      .andWhere('product.id != :productId', { productId })
      .andWhere('product.status = :status', { status: 'ACTIVE' })
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.images',
        'product.createdAt',
        'category.name',
        'user.name',
        'COALESCE(metrics.views, 0) + COALESCE(metrics.contacts, 0) as popularity'
      ])
      .orderBy('popularity', 'DESC')
      .addOrderBy('product.createdAt', 'DESC')
      .take(5)
      .cache(true) // Enable query result caching
      .getRawAndEntities();

    return relatedProducts.entities;
  }

  async getPopularProducts(): Promise<Product[]> {
    // Get products ordered by popularity (views + contacts)
    // Optimized with caching for popular products
    const popularProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoin('product.metrics', 'metrics')
      .where('product.status = :status', { status: 'ACTIVE' })
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.images',
        'product.createdAt',
        'category.name',
        'user.name',
        'COALESCE(metrics.views, 0) + COALESCE(metrics.contacts, 0) as popularity'
      ])
      .orderBy('popularity', 'DESC')
      .addOrderBy('product.createdAt', 'DESC')
      .take(10)
      .cache(300000) // Cache for 5 minutes (300,000 ms)
      .getRawAndEntities();

    return popularProducts.entities;
  }
}
