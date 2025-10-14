import { Controller, Get, Post, Query, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('whatsapp')
  @ApiOperation({ summary: 'Generar enlace de WhatsApp para contactar vendedor' })
  @ApiResponse({ status: 200, description: 'Enlace generado exitosamente.' })
  getWhatsAppLink(@Query('phone') phone: string, @Query('message') message: string) {
    return { link: this.contactService.generateWhatsAppLink(phone, message) };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar un contacto con un producto' })
  @ApiResponse({ status: 201, description: 'Contacto registrado exitosamente.' })
  recordContact(
    @Body() body: { productId: number; message: string },
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.contactService.recordContact(userId, body.productId, body.message);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Obtener contactos de un producto' })
  getContactsByProduct(@Param('productId') productId: string) {
    return this.contactService.getContactsByProduct(+productId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener contactos de un usuario' })
  getContactsByUser(@Param('userId') userId: string) {
    return this.contactService.getContactsByUser(userId);
  }
}
