import { Controller, Post, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatbotFineTuningService } from './chatbot-fine-tuning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Chatbot Fine-tuning')
@Controller('chatbot/fine-tuning')
export class ChatbotFineTuningController {
  constructor(private readonly fineTuningService: ChatbotFineTuningService) {}

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Analizar conversaciones para identificar mejoras' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Días hacia atrás para analizar' })
  @ApiResponse({ status: 200, description: 'Análisis completado.' })
  async analyzeConversations(@Query('days') days?: string) {
    const daysBack = days ? parseInt(days) : 30;
    return this.fineTuningService.analyzeConversationsForImprovement(daysBack);
  }

  @Post('generate-training-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generar datos de entrenamiento desde conversaciones exitosas' })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'maxExamples', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Datos de entrenamiento generados.' })
  async generateTrainingData(
    @Query('minRating') minRating?: string,
    @Query('maxExamples') maxExamples?: string,
  ) {
    const rating = minRating ? parseInt(minRating) : 4;
    const max = maxExamples ? parseInt(maxExamples) : 50;
    return this.fineTuningService.generateTrainingDataFromFeedback(rating, max);
  }

  @Post('identify-patterns')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Identificar patrones y sugerir ajustes de respuestas' })
  @ApiResponse({ status: 200, description: 'Patrones identificados.' })
  async identifyPatterns() {
    return this.fineTuningService.identifyPatternsAndAdjustResponses();
  }

  @Post('learning-cycle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ejecutar ciclo completo de aprendizaje continuo (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Ciclo de aprendizaje completado.' })
  async runLearningCycle(@Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Solo administradores pueden ejecutar ciclos de aprendizaje');
    }
    return this.fineTuningService.continuousLearningCycle();
  }

  @Post('cleanup/conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Limpiar conversaciones antiguas (ADMIN)' })
  @ApiQuery({ name: 'keep', required: false, type: Number, description: 'Número de conversaciones a mantener' })
  @ApiResponse({ status: 200, description: 'Limpieza completada.' })
  async cleanupConversations(@Request() req: any, @Query('keep') keep?: string) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Solo administradores pueden limpiar conversaciones');
    }
    const keepCount = keep ? parseInt(keep) : 1000;
    const deletedCount = await this.fineTuningService.cleanupOldConversations(keepCount);
    return { message: `Eliminadas ${deletedCount} conversaciones antiguas` };
  }

  @Post('cleanup/training-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Limpiar y validar datos de entrenamiento (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Limpieza completada.' })
  async cleanupTrainingData(@Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Solo administradores pueden limpiar datos de entrenamiento');
    }
    return this.fineTuningService.validateAndCleanTrainingData();
  }

  @Get('performance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener métricas de rendimiento del fine-tuning' })
  @ApiResponse({ status: 200, description: 'Métricas obtenidas.' })
  async getPerformanceMetrics() {
    const analysis = await this.fineTuningService.analyzeConversationsForImprovement(30);
    return {
      currentPerformance: {
        averageRating: analysis.averageRating,
        totalConversations: analysis.totalConversations,
        improvementAreas: analysis.commonIssues,
      },
      suggestions: analysis.improvementSuggestions,
    };
  }
}