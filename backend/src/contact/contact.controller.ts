import { Controller, Get, Query } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('whatsapp')
  getWhatsAppLink(@Query('phone') phone: string, @Query('message') message: string) {
    return { link: this.contactService.generateWhatsAppLink(phone, message) };
  }
}
