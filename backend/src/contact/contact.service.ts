import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { PhoneVerificationService } from '../phone-verification/phone-verification.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly phoneVerificationService: PhoneVerificationService,
  ) {}

  generateWhatsAppLink(phoneNumber: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  async recordContact(userId: string, productId: number, message: string): Promise<Contact> {
    // Verificar que el usuario tenga teléfono verificado para contactar
    const isVerified = await this.phoneVerificationService.isPhoneVerified(userId);
    if (!isVerified) {
      throw new Error('Debes verificar tu número de teléfono para contactar vendedores');
    }

    const contact = this.contactRepository.create({
      userId,
      productId,
      message,
    });

    return this.contactRepository.save(contact);
  }

  async getContactsByProduct(productId: number): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getContactsByUser(userId: string): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { userId },
      relations: ['product', 'product.user'],
      order: { createdAt: 'DESC' },
    });
  }
}
