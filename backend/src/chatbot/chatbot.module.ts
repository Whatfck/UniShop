import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ChatbotTrainingController } from './chatbot-training.controller';
import { ChatbotFineTuningController } from './chatbot-fine-tuning.controller';
import { ChatbotTrainingService } from './chatbot-training.service';
import { ChatbotFineTuningService } from './chatbot-fine-tuning.service';
import { TrainingData } from './entities/training-data.entity';
import { Conversation } from './entities/conversation.entity';
import { KnowledgeBase } from './entities/knowledge-base.entity';
import { Intent } from './entities/intent.entity';
import { Entity } from './entities/entity.entity';
import { ChatbotMetrics } from './entities/chatbot-metrics.entity';
import { UserFeedback } from './entities/user-feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingData,
      Conversation,
      KnowledgeBase,
      Intent,
      Entity,
      ChatbotMetrics,
      UserFeedback,
    ])
  ],
  controllers: [
    ChatbotController,
    ChatbotTrainingController,
    ChatbotFineTuningController,
  ],
  providers: [
    ChatbotService,
    ChatbotTrainingService,
    ChatbotFineTuningService,
  ],
  exports: [
    ChatbotService,
    ChatbotTrainingService,
    ChatbotFineTuningService,
  ],
})
export class ChatbotModule {}
