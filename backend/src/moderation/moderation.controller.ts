import { Controller, Post, Patch, Get, Param, Body, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Moderation')
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('submit/:productId')
  @ApiOperation({ summary: 'Enviar producto para moderación' })
  @ApiParam({ name: 'productId', description: 'ID del producto a moderar' })
  submit(@Param('productId') productId: string) {
    return this.moderationService.submitForModeration(+productId);
  }

  @Patch('approve/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar producto (solo MODERADOR)' })
  @ApiResponse({ status: 200, description: 'Producto aprobado exitosamente.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos de moderador.' })
  approve(@Param('productId') productId: string, @Body() body: { comment?: string }, @Request() req: any) {
    if (req.user.role !== UserRole.MODERATOR && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los moderadores pueden aprobar productos');
    }
    return this.moderationService.approveProduct(+productId, req.user.id, body.comment);
  }

  @Patch('reject/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rechazar producto (solo MODERADOR)' })
  @ApiResponse({ status: 200, description: 'Producto rechazado exitosamente.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos de moderador.' })
  reject(@Param('productId') productId: string, @Body() body: { comment?: string }, @Request() req: any) {
    if (req.user.role !== UserRole.MODERATOR && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los moderadores pueden rechazar productos');
    }
    return this.moderationService.rejectProduct(+productId, req.user.id, body.comment);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Panel de moderación - Lista productos pendientes (solo MODERADOR)' })
  @ApiResponse({ status: 200, description: 'Lista de productos pendientes de moderación.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos de moderador.' })
  getDashboard(@Request() req: any) {
    if (req.user.role !== UserRole.MODERATOR && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los moderadores pueden acceder al panel de moderación');
    }
    return this.moderationService.getPendingModerationsWithDetails();
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener moderaciones pendientes (solo MODERADOR)' })
  getPending(@Request() req: any) {
    if (req.user.role !== UserRole.MODERATOR && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los moderadores pueden ver moderaciones pendientes');
    }
    return this.moderationService.getPendingModerations();
  }

  @Get('status/:productId')
  @ApiOperation({ summary: 'Obtener estado de moderación de un producto' })
  getStatus(@Param('productId') productId: string) {
    return this.moderationService.getModerationStatus(+productId);
  }
}
