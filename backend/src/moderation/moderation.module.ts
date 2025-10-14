import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { Moderation } from './entities/moderation.entity';
import { CustomLogger } from '../common/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Moderation])],
  controllers: [ModerationController],
  providers: [ModerationService, CustomLogger],
  exports: [ModerationService],
})
export class ModerationModule {}
