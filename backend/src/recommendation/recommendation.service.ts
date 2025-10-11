import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getRelatedProducts(productId: number): Promise<Product[]> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) return [];

    // Simple recommendation: products in same category, excluding itself
    return this.productRepository.find({
      where: { categoryId: product.categoryId },
      take: 5,
    }).then(products => products.filter(p => p.id !== productId));
  }

  async getPopularProducts(): Promise<Product[]> {
    // For now, just return some products, in future integrate with metrics
    return this.productRepository.find({ take: 10 });
  }
}
