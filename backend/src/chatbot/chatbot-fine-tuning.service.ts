import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Not } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { TrainingData } from './entities/training-data.entity';
import { ChatbotTrainingService } from './chatbot-training.service';

@Injectable()
export class ChatbotFineTuningService {
  private readonly logger = new Logger(ChatbotFineTuningService.name);

  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(TrainingData)
    private trainingDataRepo: Repository<TrainingData>,
    private trainingService: ChatbotTrainingService,
  ) {}

  // =========================================
  // ANÁLISIS DE CONVERSACIONES PARA MEJORA
  // =========================================

  async analyzeConversationsForImprovement(daysBack: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Obtener conversaciones recientes con feedback
    const conversations = await this.conversationRepo.find({
      where: {
        timestamp: MoreThanOrEqual(startDate),
        userFeedback: MoreThanOrEqual(1),
      },
      order: { timestamp: 'DESC' },
    });

    const analysis = {
      totalConversations: conversations.length,
      averageRating: this.calculateAverageRating(conversations),
      lowRatedConversations: conversations.filter(c => c.userFeedback && c.userFeedback <= 2),
      highRatedConversations: conversations.filter(c => c.userFeedback && c.userFeedback >= 4),
      commonIssues: this.identifyCommonIssues(conversations),
      improvementSuggestions: [] as string[],
    };

    // Generar sugerencias de mejora
    analysis.improvementSuggestions = await this.generateImprovementSuggestions(analysis);

    return analysis;
  }

  // =========================================
  // GENERACIÓN AUTOMÁTICA DE DATOS DE ENTRENAMIENTO
  // =========================================

  async generateTrainingDataFromFeedback(minRating: number = 4, maxExamples: number = 50) {
    const conversations = await this.conversationRepo
      .createQueryBuilder('c')
      .where('c.userFeedback >= :minRating', { minRating })
      .andWhere('c.userMessage IS NOT NULL')
      .andWhere('c.userMessage != :empty', { empty: '' })
      .andWhere('c.botResponse IS NOT NULL')
      .andWhere('c.botResponse != :empty', { empty: '' })
      .orderBy('c.timestamp', 'DESC')
      .take(maxExamples)
      .getMany();

    const newTrainingExamples = [];

    for (const conv of conversations) {
      // Solo crear ejemplos si no existen similares
      const existingSimilar = await this.trainingDataRepo.findOne({
        where: {
          question: conv.userMessage.substring(0, 255), // Limitar longitud
        },
      });

      if (!existingSimilar) {
        const trainingExample = await this.trainingService.addTrainingExample(
          conv.userMessage,
          conv.botResponse,
          'generated_from_feedback',
          conv.intentDetected || 'general',
        );

        newTrainingExamples.push(trainingExample);
        this.logger.log(`Nuevo ejemplo de entrenamiento generado: ${trainingExample.id}`);
      }
    }

    return {
      generated: newTrainingExamples.length,
      skipped: conversations.length - newTrainingExamples.length,
      totalProcessed: conversations.length,
    };
  }

  // =========================================
  // AJUSTE DE MODELOS BASADO EN PATRONES
  // =========================================

  async identifyPatternsAndAdjustResponses() {
    // Analizar intents más comunes con bajo rating
    const lowRatedIntents = await this.conversationRepo
      .createQueryBuilder('c')
      .select('c.intentDetected, AVG(c.userFeedback) as avgRating, COUNT(*) as count')
      .where('c.intentDetected IS NOT NULL')
      .andWhere('c.userFeedback IS NOT NULL')
      .groupBy('c.intentDetected')
      .having('AVG(c.userFeedback) < 3')
      .orderBy('avgRating', 'ASC')
      .getRawMany();

    const adjustments = [];

    for (const intent of lowRatedIntents) {
      // Buscar mejores respuestas para este intent
      const betterResponses = await this.conversationRepo.find({
        where: {
          intentDetected: intent.intentDetected,
          userFeedback: MoreThanOrEqual(4),
        },
        order: { userFeedback: 'DESC' },
        take: 5,
      });

      if (betterResponses.length > 0) {
        // Crear nuevas plantillas de respuesta basadas en respuestas exitosas
        const responseTemplates = betterResponses.map(r => r.botResponse);

        adjustments.push({
          intent: intent.intentDetected,
          currentRating: intent.avgRating,
          conversationCount: intent.count,
          suggestedTemplates: responseTemplates.slice(0, 3),
        });
      }
    }

    return adjustments;
  }

  // =========================================
  // SISTEMA DE APRENDIZAJE CONTINUO
  // =========================================

  async continuousLearningCycle() {
    try {
      this.logger.log('Iniciando ciclo de aprendizaje continuo...');

      // 1. Analizar conversaciones recientes
      const analysis = await this.analyzeConversationsForImprovement(7); // Última semana

      // 2. Generar nuevos datos de entrenamiento
      if (analysis.averageRating < 3.5) {
        const trainingResults = await this.generateTrainingDataFromFeedback(4, 20);
        this.logger.log(`Generados ${trainingResults.generated} nuevos ejemplos de entrenamiento`);
      }

      // 3. Identificar patrones y ajustar respuestas
      const adjustments = await this.identifyPatternsAndAdjustResponses();
      if (adjustments.length > 0) {
        this.logger.log(`Identificados ${adjustments.length} intents que necesitan ajuste`);
      }

      // 4. Actualizar métricas
      await this.trainingService.updateDailyMetrics();

      // 5. Limpiar conversaciones antiguas (mantener últimas 1000)
      await this.cleanupOldConversations(1000);

      this.logger.log('Ciclo de aprendizaje continuo completado');

      return {
        analysis,
        trainingGenerated: analysis.averageRating < 3.5,
        adjustmentsNeeded: adjustments.length,
        cleanupPerformed: true,
      };

    } catch (error) {
      this.logger.error(`Error en ciclo de aprendizaje continuo: ${error.message}`);
      throw error;
    }
  }

  // =========================================
  // MÉTODOS DE MANTENIMIENTO
  // =========================================

  async cleanupOldConversations(keepLast: number = 1000) {
    // Obtener IDs de conversaciones a mantener (las más recientes)
    const conversationsToKeep = await this.conversationRepo.find({
      order: { timestamp: 'DESC' },
      take: keepLast,
      select: ['id'],
    });

    const idsToKeep = conversationsToKeep.map(c => c.id);

    if (idsToKeep.length > 0) {
      // Eliminar conversaciones antiguas
      const deleteResult = await this.conversationRepo
        .createQueryBuilder()
        .delete()
        .where('id NOT IN (:...ids)', { ids: idsToKeep })
        .execute();

      this.logger.log(`Eliminadas ${deleteResult.affected} conversaciones antiguas`);
      return deleteResult.affected;
    }

    return 0;
  }

  async validateAndCleanTrainingData() {
    // Eliminar ejemplos de entrenamiento duplicados
    const duplicates = await this.trainingDataRepo
      .createQueryBuilder('td1')
      .select('td1.id')
      .innerJoin(
        TrainingData,
        'td2',
        'td1.question = td2.question AND td1.id > td2.id'
      )
      .getRawMany();

    if (duplicates.length > 0) {
      const duplicateIds = duplicates.map(d => d.id);
      await this.trainingDataRepo.delete(duplicateIds);
      this.logger.log(`Eliminados ${duplicateIds.length} ejemplos duplicados`);
    }

    // Validar y limpiar datos corruptos
    const invalidExamples = await this.trainingDataRepo.find({
      where: [
        { question: '' },
        { answer: '' },
      ],
    });

    if (invalidExamples.length > 0) {
      await this.trainingDataRepo.remove(invalidExamples);
      this.logger.log(`Eliminados ${invalidExamples.length} ejemplos inválidos`);
    }

    return {
      duplicatesRemoved: duplicates.length,
      invalidRemoved: invalidExamples.length,
    };
  }

  // =========================================
  // MÉTODOS AUXILIARES
  // =========================================

  private calculateAverageRating(conversations: Conversation[]): number {
    const ratings = conversations
      .filter(c => c.userFeedback)
      .map(c => c.userFeedback!);

    return ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
  }

  private identifyCommonIssues(conversations: Conversation[]) {
    const issues = {
      slowResponses: conversations.filter(c => c.responseTimeMs && c.responseTimeMs > 5000).length,
      lowRatedResponses: conversations.filter(c => c.userFeedback && c.userFeedback <= 2).length,
      emptyResponses: conversations.filter(c => !c.botResponse || c.botResponse.trim() === '').length,
      intentNotDetected: conversations.filter(c => !c.intentDetected).length,
    };

    return issues;
  }

  private async generateImprovementSuggestions(analysis: any): Promise<string[]> {
    const suggestions = [];

    if (analysis.averageRating < 3.0) {
      suggestions.push('El rating promedio es bajo. Considera revisar las respuestas del chatbot.');
    }

    if (analysis.commonIssues.slowResponses > analysis.totalConversations * 0.1) {
      suggestions.push('Muchas respuestas son lentas. Optimiza el rendimiento del chatbot.');
    }

    if (analysis.commonIssues.intentNotDetected > analysis.totalConversations * 0.2) {
      suggestions.push('Muchos mensajes no detectan intent. Mejora el entrenamiento de intents.');
    }

    if (analysis.lowRatedConversations.length > 10) {
      suggestions.push('Hay muchas conversaciones con bajo rating. Revisa patrones de respuestas fallidas.');
    }

    return suggestions;
  }
}