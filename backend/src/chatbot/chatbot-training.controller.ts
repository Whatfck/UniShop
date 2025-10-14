import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatbotTrainingService } from './chatbot-training.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Chatbot Training')
@Controller('chatbot/training')
export class ChatbotTrainingController {
  constructor(private readonly trainingService: ChatbotTrainingService) {}

  // =========================================
  // ENDPOINTS PARA GESTIÓN DE DATOS DE ENTRENAMIENTO
  // =========================================

  @Post('data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Añadir ejemplo de entrenamiento' })
  @ApiResponse({ status: 201, description: 'Ejemplo añadido exitosamente.' })
  addTrainingExample(
    @Body() body: { question: string; answer: string; category?: string; intent?: string },
  ) {
    return this.trainingService.addTrainingExample(
      body.question,
      body.answer,
      body.category,
      body.intent,
    );
  }

  @Get('data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener dataset de entrenamiento' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false })
  getTrainingDataset(
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.trainingService.getTrainingDataset(
      limit ? parseInt(limit) : undefined,
      category,
    );
  }

  @Patch('data/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar ejemplo de entrenamiento' })
  updateTrainingExample(
    @Param('id') id: string,
    @Body() updates: Partial<{ question: string; answer: string; category: string; intent: string }>,
  ) {
    return this.trainingService.updateTrainingExample(parseInt(id), updates);
  }

  @Delete('data/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar ejemplo de entrenamiento' })
  deleteTrainingExample(@Param('id') id: string) {
    return this.trainingService.deleteTrainingExample(parseInt(id));
  }

  // =========================================
  // ENDPOINTS PARA CONVERSACIONES
  // =========================================

  @Post('conversation')
  @ApiOperation({ summary: 'Registrar conversación del chatbot' })
  recordConversation(
    @Body() body: {
      sessionId: string;
      userId?: string;
      userMessage: string;
      botResponse: string;
      intentDetected?: string;
      entitiesExtracted?: any[];
      responseTimeMs?: number;
    },
  ) {
    return this.trainingService.recordConversation(
      body.sessionId,
      body.userId || null,
      body.userMessage,
      body.botResponse,
      body.intentDetected,
      body.entitiesExtracted,
      body.responseTimeMs,
    );
  }

  @Post('feedback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar feedback de usuario' })
  collectUserFeedback(
    @Body() body: {
      conversationId: number;
      rating: number;
      comments?: string;
      suggestedImprovement?: string;
    },
    @Request() req: any,
  ) {
    return this.trainingService.collectUserFeedback(
      body.conversationId,
      req.user.id,
      body.rating,
      body.comments,
      body.suggestedImprovement,
    );
  }

  // =========================================
  // ENDPOINTS PARA BASE DE CONOCIMIENTOS
  // =========================================

  @Post('knowledge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar base de conocimientos' })
  updateKnowledgeBase(
    @Body() body: {
      topic: string;
      content: string;
      category?: string;
      tags?: string[];
    },
  ) {
    return this.trainingService.updateKnowledgeBase(
      body.topic,
      body.content,
      body.category,
      body.tags,
    );
  }

  @Get('knowledge/search')
  @ApiOperation({ summary: 'Buscar en base de conocimientos' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  searchKnowledgeBase(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.trainingService.searchKnowledgeBase(
      query,
      limit ? parseInt(limit) : undefined,
    );
  }

  // =========================================
  // ENDPOINTS PARA INTENTS Y ENTITIES
  // =========================================

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Añadir nuevo intent' })
  addIntent(
    @Body() body: {
      intentName: string;
      description?: string;
      trainingExamples?: string[];
      responseTemplates?: string[];
    },
  ) {
    return this.trainingService.addIntent(
      body.intentName,
      body.description,
      body.trainingExamples,
      body.responseTemplates,
    );
  }

  @Get('intents')
  @ApiOperation({ summary: 'Obtener todos los intents' })
  getAllIntents() {
    return this.trainingService.getAllIntents();
  }

  @Post('entity')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Añadir nueva entidad' })
  addEntity(
    @Body() body: {
      entityName: string;
      entityType: string;
      entityValue: string;
      synonyms?: string[];
    },
  ) {
    return this.trainingService.addEntity(
      body.entityName,
      body.entityType,
      body.entityValue,
      body.synonyms,
    );
  }

  @Get('entities/:type')
  @ApiOperation({ summary: 'Obtener entidades por tipo' })
  getEntitiesByType(@Param('type') entityType: string) {
    return this.trainingService.getEntitiesByType(entityType);
  }

  // =========================================
  // ENDPOINTS PARA MÉTRICAS Y REPORTES
  // =========================================

  @Post('metrics/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar métricas diarias (ADMIN)' })
  updateDailyMetrics(@Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Solo administradores pueden actualizar métricas');
    }
    return this.trainingService.updateDailyMetrics();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas del chatbot' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getChatbotStats(@Query('days') days?: string) {
    return this.trainingService.getChatbotStats(days ? parseInt(days) : undefined);
  }

  @Get('data/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de datos de entrenamiento' })
  getTrainingDataStats() {
    return this.trainingService.getTrainingDataStats();
  }
}