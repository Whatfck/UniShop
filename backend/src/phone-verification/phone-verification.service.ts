import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhoneVerification } from './entities/phone-verification.entity';

@Injectable()
export class PhoneVerificationService {
  constructor(
    @InjectRepository(PhoneVerification)
    private readonly phoneVerificationRepository: Repository<PhoneVerification>,
  ) {}

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }

  async sendVerificationCode(userId: string, phoneNumber: string): Promise<string> {
    const code = this.generateCode();
    const verification = this.phoneVerificationRepository.create({
      userId,
      phoneNumber,
      verificationCode: code,
    });
    await this.phoneVerificationRepository.save(verification);
    // Simulate sending SMS/WhatsApp
    console.log(`Sending code ${code} to ${phoneNumber}`);
    return 'Código enviado';
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const verification = await this.phoneVerificationRepository.findOne({
      where: { userId, verificationCode: code, isVerified: false },
    });
    if (verification) {
      verification.isVerified = true;
      await this.phoneVerificationRepository.save(verification);
      return true;
    }
    return false;
  }

  async isPhoneVerified(userId: string): Promise<boolean> {
    const verification = await this.phoneVerificationRepository.findOne({
      where: { userId, isVerified: true },
    });
    return !!verification;
  }
}
