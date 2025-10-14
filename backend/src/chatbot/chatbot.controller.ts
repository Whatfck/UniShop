import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Saludo básico del chatbot' })
  getHello() {
    return { message: this.chatbotService.getHello() };
  }

  @Post('message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar mensaje al chatbot IA' })
  @ApiResponse({ status: 200, description: 'Respuesta del chatbot procesada.' })
  async processMessage(
    @Body() body: { message: string; sessionId?: string },
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const result = await this.chatbotService.processMessage(userId, body.message, body.sessionId);

    return {
      response: result.response,
      intent: result.intent,
      confidence: result.confidence,
      source: result.source,
      sessionId: body.sessionId || 'generated',
    };
  }

  // Endpoint legacy para compatibilidad
  @Post('legacy')
  @ApiOperation({ summary: 'Endpoint legacy del chatbot (sin IA)' })
  processLegacyMessage(@Body('message') message: string) {
    const response = this.chatbotService.getResponse(message);
    return { response };
  }
}
