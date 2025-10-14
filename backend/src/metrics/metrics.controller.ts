import { Controller, Post, Get, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post('view/:productId')
  @ApiOperation({ summary: 'Incrementar contador de vistas de un producto' })
  incrementView(@Param('productId') productId: string) {
    return this.metricsService.incrementViews(+productId);
  }

  @Post('contact/:productId')
  @ApiOperation({ summary: 'Incrementar contador de contactos de un producto' })
  incrementContact(@Param('productId') productId: string) {
    return this.metricsService.incrementContacts(+productId);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Obtener métricas de un producto' })
  getMetrics(@Param('productId') productId: string) {
    return this.metricsService.getMetrics(+productId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las métricas (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Métricas obtenidas exitosamente.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos de administrador.' })
  getAllMetrics(@Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden ver todas las métricas');
    }
    return this.metricsService.getAllMetrics();
  }
}
