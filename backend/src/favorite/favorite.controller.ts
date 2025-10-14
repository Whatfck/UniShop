import { Controller, Post, Delete, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Añadir producto a favoritos' })
  @ApiResponse({ status: 201, description: 'Producto añadido a favoritos.' })
  add(@Body() body: { productId: number }, @Request() req: any) {
    const userId = req.user.id;
    return this.favoriteService.addToFavorites(userId, body.productId);
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover producto de favoritos' })
  @ApiResponse({ status: 200, description: 'Producto removido de favoritos.' })
  remove(@Param('productId') productId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.favoriteService.removeFromFavorites(userId, +productId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis productos favoritos' })
  getMyFavorites(@Request() req: any) {
    const userId = req.user.id;
    return this.favoriteService.getUserFavorites(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener productos favoritos de un usuario (público)' })
  getUserFavorites(@Param('userId') userId: string) {
    return this.favoriteService.getUserFavorites(userId);
  }
}
