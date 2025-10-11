import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';

@Controller('phone-verification')
export class PhoneVerificationController {
  constructor(private readonly phoneVerificationService: PhoneVerificationService) {}

  @Post('send-code')
  sendCode(@Body() body: { userId: string; phoneNumber: string }) {
    return this.phoneVerificationService.sendVerificationCode(body.userId, body.phoneNumber);
  }

  @Post('verify-code')
  verifyCode(@Body() body: { userId: string; code: string }) {
    return this.phoneVerificationService.verifyCode(body.userId, body.code);
  }

  @Get('is-verified/:userId')
  isVerified(@Param('userId') userId: string) {
    return this.phoneVerificationService.isPhoneVerified(userId);
  }
}
