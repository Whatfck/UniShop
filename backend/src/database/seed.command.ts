import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { seedDatabase } from './seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  try {
    await seedDatabase(dataSource);
    console.log('✅ Seeding completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();