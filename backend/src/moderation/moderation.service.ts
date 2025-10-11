import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moderation, ModerationStatus } from './entities/moderation.entity';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(Moderation)
    private readonly moderationRepository: Repository<Moderation>,
  ) {}

  async submitForModeration(productId: number): Promise<Moderation> {
    const moderation = this.moderationRepository.create({ productId });
    return this.moderationRepository.save(moderation);
  }

  async approveProduct(productId: number, moderatorId: string, comment?: string): Promise<Moderation> {
    const moderation = await this.moderationRepository.findOneBy({ productId });
    if (moderation) {
      moderation.status = ModerationStatus.APPROVED;
      moderation.moderatorId = moderatorId;
      moderation.comment = comment;
      return this.moderationRepository.save(moderation);
    }
    throw new Error('Moderation not found');
  }

  async rejectProduct(productId: number, moderatorId: string, comment?: string): Promise<Moderation> {
    const moderation = await this.moderationRepository.findOneBy({ productId });
    if (moderation) {
      moderation.status = ModerationStatus.REJECTED;
      moderation.moderatorId = moderatorId;
      moderation.comment = comment;
      return this.moderationRepository.save(moderation);
    }
    throw new Error('Moderation not found');
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
}
