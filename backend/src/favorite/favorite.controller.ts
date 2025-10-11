import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  add(@Body() body: { userId: string; productId: number }) {
    return this.favoriteService.addToFavorites(body.userId, body.productId);
  }

  @Delete(':userId/:productId')
  remove(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.favoriteService.removeFromFavorites(userId, +productId);
  }

  @Get(':userId')
  getUserFavorites(@Param('userId') userId: string) {
    return this.favoriteService.getUserFavorites(userId);
  }
}
