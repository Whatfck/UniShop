import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../common/logger.service';
import { ChatbotTrainingService } from './chatbot-training.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly trainingService: ChatbotTrainingService,
  ) {}

  // =========================================
  // CHATBOT PRINCIPAL - IA LOCAL/GRATUITA
  // =========================================

  async processMessage(userId: string, message: string, sessionId?: string): Promise<{
    response: string;
    intent: string;
    confidence: number;
    source: string;
  }> {
    try {
      const currentSessionId = sessionId || this.generateSessionId();

      // 1. Registrar conversación
      await this.trainingService.recordConversation(
        currentSessionId,
        userId,
        message,
        '', // Se actualizará con la respuesta
        undefined, // Intent se detectará
        undefined, // Entities se detectarán
        undefined, // Response time se calculará
      );

      const startTime = Date.now();

      // 2. Procesar mensaje con lógica local
      const result = await this.processWithLocalAI(message);

      const responseTime = Date.now() - startTime;

      // 3. Actualizar conversación con respuesta
      await this.trainingService.recordConversation(
        currentSessionId,
        userId,
        message,
        result.response,
        result.intent,
        result.entities,
        responseTime,
      );

      this.logger.logUserAction(userId, 'chatbot_interaction', {
        sessionId: currentSessionId,
        intent: result.intent,
        confidence: result.confidence,
        responseTime,
      });

      return result;

    } catch (error) {
      this.logger.error(`Error procesando mensaje de chatbot: ${error.message}`);

      // Respuesta de fallback
      return {
        response: 'Lo siento, estoy teniendo problemas técnicos. ¿Puedes intentar de nuevo?',
        intent: 'error',
        confidence: 0,
        source: 'fallback',
      };
    }
  }

  // =========================================
  // PROCESAMIENTO CON IA LOCAL (SIN COSTOS)
  // =========================================

  private async processWithLocalAI(message: string): Promise<{
    response: string;
    intent: string;
    confidence: number;
    entities: any[];
    source: string;
  }> {
    const lowerMessage = message.toLowerCase().trim();

    // 1. Intent detection basado en patrones (sin ML)
    const intentResult = this.detectIntentWithPatterns(lowerMessage);

    // 2. Entity extraction básico
    const entities = this.extractEntities(lowerMessage);

    // 3. Generar respuesta basada en intent
    const response = await this.generateResponse(intentResult.intent, entities, message);

    return {
      response,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      entities,
      source: 'local_ai',
    };
  }

  // =========================================
  // DETECCIÓN DE INTENT BASADA EN PATRONES
  // =========================================

  private detectIntentWithPatterns(message: string): { intent: string; confidence: number } {
    // Patrones de intención (se pueden expandir con datos de entrenamiento)
    const intentPatterns = {
      saludar: [
        /\b(hola|buenos?\s+días|buenas?\s+(tardes|noches)|hey|qué\s+tal|saludos)\b/i,
        /\b(bienvenido|gracias|hasta\s+luego|adios|bye)\b/i,
      ],
      buscar_producto: [
        /\b(busco|quiero|necesito|estoy\s+buscando|tienen)\b.*\b(libro|producto|artículo|cosa)\b/i,
        /\b(vendo|venta|comprar|compra|precio)\b/i,
      ],
      informacion_contacto: [
        /\b(cómo\s+contacto|contactar|whatsapp|teléfono|llamar)\b/i,
        /\b(comunicarse|hablar|mensaje|escribir)\b/i,
      ],
      ayuda_general: [
        /\b(ayuda|help|qué\s+puedo\s+hacer|cómo\s+funciona)\b/i,
        /\b(manual|guía|instrucciones|tutorial)\b/i,
      ],
      registro_usuario: [
        /\b(registrarme|crear\s+cuenta|signup|unirme)\b/i,
        /\b(correo|email|usuario|cuenta)\b/i,
      ],
      publicar_producto: [
        /\b(vender|publicar|anunciar|poner\s+a\s+la\s+venta)\b/i,
        /\b(producto|artículo|cosa|objeto)\b/i,
      ],
    };

    let bestIntent = 'general';
    let bestConfidence = 0;

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      let matches = 0;
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          matches++;
        }
      }

      // Calcular confianza basada en matches
      const confidence = Math.min(matches / patterns.length, 1);
      if (confidence > bestConfidence) {
        bestIntent = intent;
        bestConfidence = confidence;
      }
    }

    return { intent: bestIntent, confidence: bestConfidence };
  }

  // =========================================
  // EXTRACCIÓN DE ENTIDADES BÁSICA
  // =========================================

  private extractEntities(message: string): any[] {
    const entities = [];

    // Extraer categorías mencionadas
    const categories = ['libro', 'libros', 'tecnología', 'tecnologia', 'laboratorio', 'arquitectura', 'ropa', 'accesorios'];
    for (const category of categories) {
      if (message.includes(category)) {
        entities.push({
          entity: category,
          type: 'category',
          confidence: 0.8,
        });
      }
    }

    // Extraer rangos de precio
    const priceMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:mil|k|pesos|cop)?/i);
    if (priceMatch) {
      entities.push({
        entity: priceMatch[1],
        type: 'price',
        value: parseFloat(priceMatch[1]),
        confidence: 0.9,
      });
    }

    return entities;
  }

  // =========================================
  // GENERACIÓN DE RESPUESTAS BASADAS EN INTENT
  // =========================================

  private async generateResponse(intent: string, entities: any[], originalMessage: string): Promise<string> {
    // Respuestas predefinidas por intent
    const responses = {
      saludar: [
        '¡Hola! Soy el asistente de Unishop. ¿En qué puedo ayudarte hoy?',
        '¡Buen día! ¿Qué necesitas saber sobre nuestros productos?',
        '¡Hola! Estoy aquí para ayudarte con tus compras y ventas en Unishop.',
      ],
      buscar_producto: [
        '¡Claro! Puedo ayudarte a encontrar productos. ¿Qué tipo de artículo estás buscando?',
        '¿Qué producto necesitas? Tengo información sobre libros, tecnología, material de laboratorio y más.',
        '¡Perfecto! ¿Me puedes decir qué estás buscando? Puedo buscar por categoría, precio o nombre.',
      ],
      informacion_contacto: [
        'Para contactar a un vendedor, simplemente haz clic en el botón "Contactar" del producto que te interesa.',
        'Cada producto tiene un botón de WhatsApp para contactar directamente al vendedor.',
        '¡Fácil! Solo presiona el botón verde "Contactar" en cualquier producto.',
      ],
      ayuda_general: [
        'En Unishop puedes comprar y vender productos universitarios. ¿Qué específicamente necesitas saber?',
        'Puedo ayudarte con: buscar productos, publicar artículos, contactar vendedores, o información general.',
        '¿Qué necesitas? Puedo explicarte cómo funciona la plataforma, buscar productos, o guiarte en el proceso de venta.',
      ],
      registro_usuario: [
        'Para registrarte necesitas un correo institucional (@campusucc.edu.co). ¿Tienes alguna pregunta sobre el proceso?',
        'El registro requiere nombre, correo institucional y contraseña. ¿Necesitas ayuda con algo específico?',
        '¡Claro! Solo necesitas un correo @campusucc.edu.co. ¿Quieres que te guíe paso a paso?',
      ],
      publicar_producto: [
        'Para publicar necesitas verificar tu teléfono primero. Luego puedes añadir fotos, descripción y precio.',
        '¡Genial que quieras vender! Primero verifica tu teléfono, luego completa el formulario con fotos del producto.',
        'Publicar es fácil: verifica teléfono → sube fotos → escribe descripción → establece precio → ¡listo!',
      ],
      general: [
        '¿En qué puedo ayudarte? Puedo buscar productos, explicarte cómo funciona la plataforma, o guiarte en el proceso de compra/venta.',
        'Estoy aquí para ayudarte con Unishop. ¿Qué necesitas saber?',
        '¿Cómo puedo asistirte hoy? Tengo información sobre productos, ventas, compras y más.',
      ],
    };

    // Seleccionar respuesta aleatoria del intent
    const intentResponses = responses[intent] || responses.general;
    const randomResponse = intentResponses[Math.floor(Math.random() * intentResponses.length)];

    // Personalizar con entidades si existen
    let personalizedResponse = randomResponse;

    if (entities.length > 0) {
      const categoryEntity = entities.find(e => e.type === 'category');
      if (categoryEntity) {
        personalizedResponse += ` Veo que te interesan productos de ${categoryEntity.entity}.`;
      }

      const priceEntity = entities.find(e => e.type === 'price');
      if (priceEntity) {
        personalizedResponse += ` ¿Estás buscando algo alrededor de $${priceEntity.value}?`;
      }
    }

    return personalizedResponse;
  }

  // =========================================
  // UTILIDADES
  // =========================================

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Método legacy para compatibilidad
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

  // Método legacy para compatibilidad
  getHello(): string {
    return '¡Hola! Soy el chatbot de Unishop. ¿En qué puedo ayudarte?';
  }
}
