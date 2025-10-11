import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  getResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hola') || lowerMessage.includes('hello')) {
      return '¡Hola! ¿En qué puedo ayudarte con Unishop?';
    }

    if (lowerMessage.includes('publicar') || lowerMessage.includes('vender')) {
      return 'Para publicar un producto, necesitas registrarte, verificar tu teléfono y subir fotos con descripción.';
    }

    if (lowerMessage.includes('comprar')) {
      return 'Puedes buscar productos por nombre o categoría. ¡Contacta al vendedor por WhatsApp!';
    }

    if (lowerMessage.includes('favoritos')) {
      return 'Puedes guardar productos en favoritos para verlos después.';
    }

    return 'Lo siento, no entiendo tu pregunta. ¿Puedes reformularla?';
  }
}
