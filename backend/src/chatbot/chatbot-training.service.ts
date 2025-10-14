import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingData } from './entities/training-data.entity';
import { Conversation } from './entities/conversation.entity';
import { KnowledgeBase } from './entities/knowledge-base.entity';
import { Intent } from './entities/intent.entity';
import { Entity } from './entities/entity.entity';
import { ChatbotMetrics } from './entities/chatbot-metrics.entity';
import { UserFeedback } from './entities/user-feedback.entity';

@Injectable()
export class ChatbotTrainingService {
  private readonly logger = new Logger(ChatbotTrainingService.name);

  constructor(
    @InjectRepository(TrainingData)
    private trainingDataRepo: Repository<TrainingData>,
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(KnowledgeBase)
    private knowledgeBaseRepo: Repository<KnowledgeBase>,
    @InjectRepository(Intent)
    private intentRepo: Repository<Intent>,
    @InjectRepository(Entity)
    private entityRepo: Repository<Entity>,
    @InjectRepository(ChatbotMetrics)
    private metricsRepo: Repository<ChatbotMetrics>,
    @InjectRepository(UserFeedback)
    private feedbackRepo: Repository<UserFeedback>,
  ) {}

  // =========================================
  // GESTIÓN DE DATOS DE ENTRENAMIENTO
  // =========================================

  async addTrainingExample(question: string, answer: string, category?: string, intent?: string) {
    try {
      const trainingExample = this.trainingDataRepo.create({
        question,
        answer,
        category,
        intent,
        confidence_score: 0.8,
        usage_count: 0,
      });

      const saved = await this.trainingDataRepo.save(trainingExample);
      this.logger.log(`Nuevo ejemplo de entrenamiento añadido: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Error añadiendo ejemplo de entrenamiento: ${error.message}`);
      throw error;
    }
  }

  async getTrainingDataset(limit?: number, category?: string): Promise<TrainingData[]> {
    const query = this.trainingDataRepo.createQueryBuilder('td')
      .orderBy('td.created_at', 'DESC');

    if (category) {
      query.where('td.category = :category', { category });
    }

    if (limit) {
      query.take(limit);
    }

    return query.getMany();
  }

  async updateTrainingExample(id: number, updates: Partial<TrainingData>) {
    await this.trainingDataRepo.update(id, {
      ...updates,
      updated_at: new Date(),
    });
    return this.trainingDataRepo.findOneBy({ id });
  }

  async deleteTrainingExample(id: number) {
    const result = await this.trainingDataRepo.delete(id);
    this.logger.log(`Ejemplo de entrenamiento eliminado: ${id}`);
    return result;
  }

  // =========================================
  // GESTIÓN DE CONVERSACIONES
  // =========================================

  async recordConversation(
    sessionId: string,
    userId: string | null,
    userMessage: string,
    botResponse: string,
    intentDetected?: string,
    entitiesExtracted?: any[],
    responseTimeMs?: number,
  ) {
    try {
      const conversation = this.conversationRepo.create({
        sessionId,
        userId,
        userMessage,
        botResponse,
        intentDetected,
        entitiesExtracted: entitiesExtracted || [],
        responseTimeMs,
      });

      const saved = await this.conversationRepo.save(conversation);

      // Actualizar contador de uso en training data si aplica
      if (intentDetected) {
        await this.updateTrainingUsage(intentDetected);
      }

      return saved;
    } catch (error) {
      this.logger.error(`Error registrando conversación: ${error.message}`);
      throw error;
    }
  }

  async collectUserFeedback(conversationId: number, userId: string, rating: number, comments?: string, suggestedImprovement?: string) {
    try {
      const feedback = this.feedbackRepo.create({
        conversationId,
        userId,
        rating,
        comments,
        suggestedImprovement,
      });

      const saved = await this.feedbackRepo.save(feedback);

      // Actualizar feedback en conversación
      await this.conversationRepo.update(conversationId, {
        userFeedback: rating,
        wasHelpful: rating >= 4,
      });

      this.logger.log(`Feedback registrado para conversación ${conversationId}: ${rating}/5`);
      return saved;
    } catch (error) {
      this.logger.error(`Error registrando feedback: ${error.message}`);
      throw error;
    }
  }

  async getConversationsForTraining(limit: number = 1000): Promise<Conversation[]> {
    return this.conversationRepo.find({
      where: { userFeedback: 4 }, // Solo conversaciones con buen feedback
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  // =========================================
  // GESTIÓN DE BASE DE CONOCIMIENTOS
  // =========================================

  async updateKnowledgeBase(topic: string, content: string, category?: string, tags?: string[], embedding?: number[]) {
    try {
      const existing = await this.knowledgeBaseRepo.findOneBy({ topic });

      const data: any = {
        content,
        category,
        tags: tags || [],
        updated_at: new Date(),
      };

      if (embedding) {
        data.embedding = embedding;
      }

      if (existing) {
        await this.knowledgeBaseRepo.update(existing.id, data);
        this.logger.log(`Base de conocimientos actualizada: ${topic}`);
        return this.knowledgeBaseRepo.findOneBy({ id: existing.id });
      } else {
        const newEntry = this.knowledgeBaseRepo.create({
          topic,
          ...data,
          source: 'manual',
          priority: 1,
          isActive: true,
        });
        const saved = await this.knowledgeBaseRepo.save(newEntry);
        this.logger.log(`Nueva entrada en base de conocimientos: ${topic}`);
        return saved;
      }
    } catch (error) {
      this.logger.error(`Error actualizando base de conocimientos: ${error.message}`);
      throw error;
    }
  }

  async searchKnowledgeBase(query: string, limit: number = 5): Promise<KnowledgeBase[]> {
    // Búsqueda simple por texto (se puede mejorar con embeddings)
    return this.knowledgeBaseRepo
      .createQueryBuilder('kb')
      .where('kb.isActive = true')
      .andWhere('kb.content ILIKE :query OR kb.topic ILIKE :query', { query: `%${query}%` })
      .orderBy('kb.priority', 'DESC')
      .take(limit)
      .getMany();
  }

  // =========================================
  // GESTIÓN DE INTENTS Y ENTITIES
  // =========================================

  async addIntent(intentName: string, description?: string, trainingExamples?: string[], responseTemplates?: string[]) {
    try {
      const intent = this.intentRepo.create({
        intentName,
        description,
        trainingExamples: trainingExamples || [],
        responseTemplates: responseTemplates || [],
        priority: 1,
      });

      const saved = await this.intentRepo.save(intent);
      this.logger.log(`Nuevo intent añadido: ${intentName}`);
      return saved;
    } catch (error) {
      this.logger.error(`Error añadiendo intent: ${error.message}`);
      throw error;
    }
  }

  async getAllIntents(): Promise<Intent[]> {
    return this.intentRepo.find({
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async addEntity(entityName: string, entityType: string, entityValue: string, synonyms?: string[]) {
    try {
      const entity = this.entityRepo.create({
        entityName,
        entityType,
        entityValue,
        synonyms: synonyms || [],
        confidence: 1.0,
      });

      const saved = await this.entityRepo.save(entity);
      this.logger.log(`Nueva entidad añadida: ${entityName} (${entityType})`);
      return saved;
    } catch (error) {
      this.logger.error(`Error añadiendo entidad: ${error.message}`);
      throw error;
    }
  }

  async getEntitiesByType(entityType: string): Promise<Entity[]> {
    return this.entityRepo.find({
      where: { entityType },
      order: { confidence: 'DESC' },
    });
  }

  // =========================================
  // MÉTRICAS Y REPORTES
  // =========================================

  async updateDailyMetrics(targetDate?: Date) {
    const date = targetDate || new Date();

    try {
      // Esta función se ejecutaría periódicamente para actualizar métricas
      // Por ahora, solo registramos que se llamó
      this.logger.log(`Actualizando métricas para fecha: ${date.toISOString().split('T')[0]}`);

      // En una implementación real, aquí iría la lógica para calcular métricas
      // usando las funciones SQL definidas en el schema

    } catch (error) {
      this.logger.error(`Error actualizando métricas: ${error.message}`);
      throw error;
    }
  }

  async getChatbotStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const conversations = await this.conversationRepo
      .createQueryBuilder('c')
      .where('c.timestamp >= :startDate', { startDate })
      .getMany();

    const totalConversations = conversations.length;
    const averageRating = conversations
      .filter(c => c.userFeedback)
      .reduce((sum, c) => sum + c.userFeedback, 0) / conversations.filter(c => c.userFeedback).length || 0;

    const averageResponseTime = conversations
      .filter(c => c.responseTimeMs)
      .reduce((sum, c) => sum + c.responseTimeMs, 0) / conversations.filter(c => c.responseTimeMs).length || 0;

    return {
      totalConversations,
      averageRating: Math.round(averageRating * 10) / 10,
      averageResponseTime: Math.round(averageResponseTime),
      periodDays: days,
    };
  }

  // =========================================
  // MÉTODOS AUXILIARES
  // =========================================

  private async updateTrainingUsage(intent: string) {
    // Actualizar contador de uso en training data
    await this.trainingDataRepo
      .createQueryBuilder()
      .update(TrainingData)
      .set({
        usageCount: () => 'usage_count + 1',
        lastUsed: new Date(),
      })
      .where('intent = :intent', { intent })
      .execute();
  }

  async getTrainingDataStats() {
    const total = await this.trainingDataRepo.count();
    const byCategory = await this.trainingDataRepo
      .createQueryBuilder('td')
      .select('td.category, COUNT(*) as count')
      .where('td.category IS NOT NULL')
      .groupBy('td.category')
      .getRawMany();

    const byIntent = await this.trainingDataRepo
      .createQueryBuilder('td')
      .select('td.intent, COUNT(*) as count')
      .where('td.intent IS NOT NULL')
      .groupBy('td.intent')
      .getRawMany();

    return {
      total,
      byCategory,
      byIntent,
    };
  }
}