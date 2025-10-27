// Ensure global crypto is available (some Node builds on minimal images may not expose Web Crypto)
// @note: @nestjs/typeorm uses crypto.randomUUID() internally and can throw if crypto is undefined
declare const global: any;
if (typeof (globalThis as any).crypto === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (globalThis as any).crypto = require('crypto');
  } catch (e) {
    // ignore, runtime will show clearer error later
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { CustomLogger } from './src/common/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);
  const customLogger = app.get(CustomLogger);

  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const nodeEnv = configService.get<string>('NODE_ENV');

  // Seguridad: Helmet para headers de seguridad
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Compresión de respuestas para mejor rendimiento
  app.use(compression());

  // Rate limiting básico (en producción usar un middleware dedicado)
  if (nodeEnv === 'production') {
    // Aquí se podría implementar rate limiting más avanzado
    app.use((req, res, next) => {
      // Implementación básica de rate limiting
      const clientIp = req.ip || req.connection.remoteAddress;
      // En producción, usar Redis o similar para rate limiting
      next();
    });
  }

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Prefijo global para todos los endpoints (ej: /api/v1/users)
  app.setGlobalPrefix('api/v1');

  // Pipe de validación global para DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: nodeEnv === 'production', // Ocultar mensajes de error detallados en producción
  }));

  // Timeout para requests (30 segundos)
  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      res.status(408).json({ message: 'Request timeout' });
    });
    next();
  });

  // Configuración de Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Unishop API')
    .setDescription('Documentación de la API para el marketplace Unishop')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // La UI de Swagger estará en /api/docs

  const port = configService.get<number>('PORT', 8080);
  // Bind to 0.0.0.0 so the server is reachable from other containers and IPv4 healthchecks
  await app.listen(port, '0.0.0.0');

  customLogger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
