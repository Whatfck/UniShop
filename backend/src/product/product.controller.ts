import { Controller, Get, Post, Body, Param, Patch, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Crear un nuevo producto' })
	@ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
	@ApiResponse({ status: 403, description: 'Teléfono no verificado.' })
	create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
		const userId = req.user.id;
		return this.productService.create(createProductDto, userId);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener lista de productos con filtros avanzados' })
	@ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre o descripción' })
	@ApiQuery({ name: 'categoryId', required: false, type: Number, description: 'Filtrar por categoría' })
	@ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Precio mínimo' })
	@ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Precio máximo' })
	@ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'SOLD', 'INACTIVE'], description: 'Estado del producto' })
	@ApiQuery({ name: 'sortBy', required: false, enum: ['price', 'createdAt', 'views'], description: 'Ordenar por campo' })
	@ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Orden ascendente o descendente' })
	@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados (máx 100)' })
	findAll(
		@Query('search') search?: string,
		@Query('categoryId') categoryId?: string,
		@Query('minPrice') minPrice?: string,
		@Query('maxPrice') maxPrice?: string,
		@Query('status') status?: 'ACTIVE' | 'SOLD' | 'INACTIVE',
		@Query('sortBy') sortBy?: 'price' | 'createdAt' | 'views',
		@Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
		@Query('limit') limit?: string,
	) {
		return this.productService.findAll({
			search,
			categoryId: categoryId ? +categoryId : undefined,
			minPrice: minPrice ? +minPrice : undefined,
			maxPrice: maxPrice ? +maxPrice : undefined,
			status,
			sortBy,
			sortOrder,
			limit: limit ? Math.min(+limit, 100) : undefined, // Máximo 100 resultados
		});
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener un producto por ID' })
	@ApiResponse({ status: 200, description: 'Producto encontrado.' })
	@ApiResponse({ status: 404, description: 'Producto no encontrado.' })
	findOne(@Param('id') id: string) {
		return this.productService.findOne(+id);
	}

	@Post(':id/contact')
	@ApiOperation({ summary: 'Registrar contacto con un producto' })
	@ApiResponse({ status: 200, description: 'Contacto registrado.' })
	async recordContact(@Param('id') id: string) {
	  await this.productService.recordContact(+id);
	  return { message: 'Contacto registrado' };
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Actualizar un producto' })
	@ApiResponse({ status: 200, description: 'Producto actualizado.' })
	@ApiResponse({ status: 403, description: 'No tienes permiso para editar este producto.' })
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Request() req: any) {
		const userId = req.user.id;
		return this.productService.update(+id, updateProductDto, userId);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Eliminar un producto' })
	@ApiResponse({ status: 200, description: 'Producto eliminado.' })
	@ApiResponse({ status: 403, description: 'No tienes permiso para eliminar este producto.' })
	remove(@Param('id') id: string, @Request() req: any) {
		const userId = req.user.id;
		return this.productService.remove(+id, userId);
	}

	@Patch(':id/mark-sold')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Marcar producto como vendido' })
	markAsSold(@Param('id') id: string, @Request() req: any) {
		const userId = req.user.id;
		return this.productService.markAsSold(+id, userId);
	}

	@Get('user/:userId')
	@ApiOperation({ summary: 'Obtener productos de un usuario' })
	findByUser(@Param('userId') userId: string) {
		return this.productService.findByUser(userId);
	}

	@Get('user/:userId/sold')
	@ApiOperation({ summary: 'Obtener productos vendidos de un usuario' })
	findSoldByUser(@Param('userId') userId: string) {
		return this.productService.findSoldByUser(userId);
	}
}
