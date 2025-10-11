import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  generateWhatsAppLink(phoneNumber: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }
}
