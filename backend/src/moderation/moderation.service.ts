import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moderation, ModerationStatus } from './entities/moderation.entity';
import { CustomLogger } from '../common/logger.service';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(Moderation)
    private readonly moderationRepository: Repository<Moderation>,
    private readonly logger: CustomLogger,
  ) {}

  async submitForModeration(productId: number): Promise<Moderation> {
    const moderation = this.moderationRepository.create({ productId });
    return this.moderationRepository.save(moderation);
  }

  async approveProduct(productId: number, moderatorId: string, comment?: string): Promise<Moderation> {
    const moderation = await this.moderationRepository.findOneBy({ productId });
    if (!moderation) {
      throw new BadRequestException('Moderación no encontrada para este producto');
    }

    moderation.status = ModerationStatus.APPROVED;
    moderation.moderatorId = moderatorId;
    moderation.comment = comment;

    const savedModeration = await this.moderationRepository.save(moderation);
    this.logger.logUserAction(moderatorId, 'approve_product', { productId, comment });
    return savedModeration;
  }

  async rejectProduct(productId: number, moderatorId: string, comment?: string): Promise<Moderation> {
    const moderation = await this.moderationRepository.findOneBy({ productId });
    if (!moderation) {
      throw new BadRequestException('Moderación no encontrada para este producto');
    }

    moderation.status = ModerationStatus.REJECTED;
    moderation.moderatorId = moderatorId;
    moderation.comment = comment;

    const savedModeration = await this.moderationRepository.save(moderation);
    this.logger.logUserAction(moderatorId, 'reject_product', { productId, comment });
    return savedModeration;
  }

  async getPendingModerations(): Promise<Moderation[]> {
    return this.moderationRepository.find({
      where: { status: ModerationStatus.PENDING },
      relations: ['product'],
    });
  }

  async getModerationStatus(productId: number): Promise<Moderation | null> {
    return this.moderationRepository.findOne({
      where: { productId },
      relations: ['product', 'moderator'],
    });
  }

  async getPendingModerationsWithDetails(): Promise<Moderation[]> {
    return this.moderationRepository.find({
      where: { status: ModerationStatus.PENDING },
      relations: ['product', 'product.user', 'product.category'],
      order: { createdAt: 'ASC' },
    });
  }
}
