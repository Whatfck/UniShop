import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './src/auth/auth.module';
import { UserModule } from './src/user/user.module';
import { ProductModule } from './src/product/product.module';
import { CategoryModule } from './src/category/category.module';
import { FavoriteModule } from './src/favorite/favorite.module';
import { MetricsModule } from './src/metrics/metrics.module';
import { ModerationModule } from './src/moderation/moderation.module';
import { ContactModule } from './src/contact/contact.module';
import { PhoneVerificationModule } from './src/phone-verification/phone-verification.module';
import { TagModule } from './src/tag/tag.module';
import { RecommendationModule } from './src/recommendation/recommendation.module';
import { ChatbotModule } from './src/chatbot/chatbot.module';
import { CustomLogger } from './src/common/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    FavoriteModule,
    MetricsModule,
    ModerationModule,
    ContactModule,
    PhoneVerificationModule,
    TagModule,
    RecommendationModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLogger],
  exports: [CustomLogger],
})
export class AppModule {}
