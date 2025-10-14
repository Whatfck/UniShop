import { ConflictException, Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Metric } from '../metrics/entities/metric.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, ...userData } = createUserDto;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`El correo '${email}' ya está en uso.`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({ ...userData, email, password: hashedPassword });
    await this.userRepository.save(user);

    delete user.password; // Nunca devolver la contraseña en la respuesta
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ user: User; message: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    delete user.password; // No devolver la contraseña
    return { user, message: 'Inicio de sesión exitoso.' };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    delete user.password; // Nunca devolver la contraseña
    return user;
  }

  async updateProfile(userId: string, updateData: { name?: string; profilePictureUrl?: string }): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.update(userId, updateData);
    return this.getProfile(userId);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: 'Contraseña cambiada exitosamente' };
  }

  async getUserStatistics(userId: string): Promise<any> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Estadísticas de productos
    const totalProducts = await this.productRepository.count({ where: { userId } });
    const activeProducts = await this.productRepository.count({ where: { userId, status: 'ACTIVE' } });
    const soldProducts = await this.productRepository.count({ where: { userId, status: 'SOLD' } });

    // Estadísticas de métricas (vistas y contactos)
    const metrics = await this.metricRepository
      .createQueryBuilder('metric')
      .select('SUM(metric.views)', 'totalViews')
      .addSelect('SUM(metric.contacts)', 'totalContacts')
      .where('metric.productId IN (SELECT id FROM products WHERE userId = :userId)', { userId })
      .getRawOne();

    // Productos más populares (por vistas)
    const topProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.metrics', 'metrics')
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.status',
        'product.createdAt',
        'category.name as categoryName',
        'COALESCE(metrics.views, 0) as views',
        'COALESCE(metrics.contacts, 0) as contacts'
      ])
      .where('product.userId = :userId', { userId })
      .orderBy('COALESCE(metrics.views, 0)', 'DESC')
      .take(5)
      .getRawAndEntities();

    // Estadísticas por categoría
    const categoryStats = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(*)', 'count')
      .where('product.userId = :userId', { userId })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        sold: soldProducts,
      },
      metrics: {
        totalViews: parseInt(metrics?.totalViews || '0'),
        totalContacts: parseInt(metrics?.totalContacts || '0'),
        averageViewsPerProduct: totalProducts > 0 ? Math.round(parseInt(metrics?.totalViews || '0') / totalProducts) : 0,
        averageContactsPerProduct: totalProducts > 0 ? Math.round(parseInt(metrics?.totalContacts || '0') / totalProducts) : 0,
      },
      topProducts: topProducts.entities.map((product, index) => ({
        ...product,
        views: parseInt(topProducts.raw[index]?.views || '0'),
        contacts: parseInt(topProducts.raw[index]?.contacts || '0'),
        categoryName: topProducts.raw[index]?.categoryName,
      })),
      categoryBreakdown: categoryStats.map(stat => ({
        category: stat.categoryName,
        count: parseInt(stat.count),
      })),
    };
  }
}
