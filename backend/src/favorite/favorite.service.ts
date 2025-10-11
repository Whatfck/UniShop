import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async addToFavorites(userId: string, productId: number): Promise<Favorite> {
    const favorite = this.favoriteRepository.create({ userId, productId });
    return this.favoriteRepository.save(favorite);
  }

  async removeFromFavorites(userId: string, productId: number): Promise<void> {
    await this.favoriteRepository.delete({ userId, productId });
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async isFavorite(userId: string, productId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOneBy({ userId, productId });
    return !!favorite;
  }
}
