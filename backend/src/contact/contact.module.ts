import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './entities/contact.entity';
import { PhoneVerificationModule } from '../phone-verification/phone-verification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    PhoneVerificationModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
