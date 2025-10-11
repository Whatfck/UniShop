import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Usaremos el puerto 8080 para mantener la consistencia con la configuración de Docker
  await app.listen(8080);
}
bootstrap();

