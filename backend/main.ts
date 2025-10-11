import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontendUrl = configService.get<string>('FRONTEND_URL');

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Prefijo global para todos los endpoints (ej: /api/v1/users)
  app.setGlobalPrefix('api/v1');

  // Pipe de validación global para DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Configuración de Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Unishop API')
    .setDescription('Documentación de la API para el marketplace Unishop')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // La UI de Swagger estará en /api/docs

  const port = configService.get<number>('PORT', 8080);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
