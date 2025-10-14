import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva categoría (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos de administrador.' })
  create(@Body() body: { name: string; description?: string }, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden crear categorías');
    }
    return this.categoryService.create(body.name, body.description);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar categoría (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos de administrador.' })
  update(@Param('id') id: string, @Body() body: { name?: string; description?: string }, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden actualizar categorías');
    }
    return this.categoryService.update(+id, body.name, body.description);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar categoría (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos de administrador.' })
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden eliminar categorías');
    }
    return this.categoryService.remove(+id);
  }
}
