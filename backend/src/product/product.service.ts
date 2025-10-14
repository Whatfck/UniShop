import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PhoneVerificationService } from '../phone-verification/phone-verification.service';
import { MetricsService } from '../metrics/metrics.service';
import { CustomLogger } from '../common/logger.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly phoneVerificationService: PhoneVerificationService,
    private readonly metricsService: MetricsService,
    private readonly logger: CustomLogger,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    // Verificar que el usuario tenga el teléfono verificado
    const isVerified = await this.phoneVerificationService.isPhoneVerified(userId);
    if (!isVerified) {
      throw new ForbiddenException('Debes verificar tu número de teléfono para publicar productos');
    }

    // Moderación automática básica: verificar contenido de descripción
    const moderationResult = this.moderateContent(createProductDto.description);
    if (!moderationResult.approved) {
      this.logger.logProductModeration(0, 'rejected', moderationResult.reason);
      throw new BadRequestException(`Publicación rechazada: ${moderationResult.reason}`);
    }

    this.logger.logProductModeration(0, 'approved', 'Contenido aprobado por moderación automática');

    const product = this.productRepository.create({ ...createProductDto, userId });
    return this.productRepository.save(product);
  }

  async findAll(query?: {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: 'ACTIVE' | 'SOLD' | 'INACTIVE';
    sortBy?: 'price' | 'createdAt' | 'views';
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
  }): Promise<Product[]> {
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoin('product.metrics', 'metrics')
      .where('product.status = :status', { status: 'ACTIVE' });

    // Aplicar ordenamiento personalizado
    if (query?.sortBy) {
      let orderField = 'product.createdAt';
      let orderDirection: 'ASC' | 'DESC' = 'DESC';

      switch (query.sortBy) {
        case 'price':
          orderField = 'product.price';
          break;
        case 'createdAt':
          orderField = 'product.createdAt';
          break;
        case 'views':
          orderField = 'COALESCE(metrics.views, 0)';
          break;
      }

      if (query.sortOrder) {
        orderDirection = query.sortOrder;
      }

      qb.orderBy(orderField, orderDirection);
    } else {
      qb.orderBy('product.createdAt', 'DESC');
    }

    // Aplicar límite personalizado o por defecto
    const limit = Math.min(query?.limit || 100, 100); // Máximo 100 resultados
    qb.take(limit);

    if (query?.search) {
      qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${query.search}%`
      });
    }

    if (query?.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query?.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query?.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    if (query?.status) {
      qb.andWhere('product.status = :status', { status: query.status });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });

    // Incrementar contador de vistas si el producto existe
    if (product) {
      await this.metricsService.incrementViews(id);
    }

    return product;
  }

  async findByUser(userId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { userId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 50, // Limitar resultados por usuario
    });
  }

  async findSoldByUser(userId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { userId, status: 'SOLD' },
      relations: ['category'],
      order: { updatedAt: 'DESC' },
      take: 50, // Limitar resultados de productos vendidos
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: string): Promise<Product | null> {
    const product = await this.findOne(id);
    if (!product) {
      throw new BadRequestException('Producto no encontrado');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para editar este producto');
    }

    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: string): Promise<void> {
    const product = await this.findOne(id);
    if (!product) {
      throw new BadRequestException('Producto no encontrado');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este producto');
    }

    await this.productRepository.delete(id);
  }

  async markAsSold(id: number, userId: string): Promise<Product | null> {
    const product = await this.findOne(id);
    if (!product) {
      throw new BadRequestException('Producto no encontrado');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para marcar este producto como vendido');
    }

    await this.productRepository.update(id, { status: 'SOLD' });
    return this.findOne(id);
  }

  async recordContact(id: number): Promise<void> {
    await this.metricsService.incrementContacts(id);
  }

  private moderateContent(description: string): { approved: boolean; reason?: string } {
    const lowerDescription = description.toLowerCase();

    // Lista de palabras clave que indican información de contacto no permitida
    const contactKeywords = [
      'whatsapp', 'telefono', 'teléfono', 'celular', 'móvil', 'número',
      'contacto', 'llamar', 'llame', 'comunicarse', 'gmail', 'hotmail',
      'yahoo', 'outlook', '@', 'facebook', 'instagram', 'twitter',
      'telegram', 'discord', 'skype', 'zoom', 'meet', 'hangouts'
    ];

    // Verificar si contiene información de contacto
    for (const keyword of contactKeywords) {
      if (lowerDescription.includes(keyword)) {
        return {
          approved: false,
          reason: 'La descripción no debe contener información de contacto. Usa el sistema de contacto de la plataforma.'
        };
      }
    }

    // Verificar longitud mínima
    if (description.length < 10) {
      return {
        approved: false,
        reason: 'La descripción debe tener al menos 10 caracteres.'
      };
    }

    // Verificar si parece spam (repetitivo)
    const words = description.split(' ');
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    if (words.length > 20 && uniqueWords.size < words.length * 0.3) {
      return {
        approved: false,
        reason: 'La descripción parece contener contenido repetitivo o spam.'
      };
    }

    return { approved: true };
  }
}
