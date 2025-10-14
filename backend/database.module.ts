import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Solo sincronizar en desarrollo
        logging: configService.get<string>('NODE_ENV') === 'development', // Logging solo en desarrollo
        // Configuraciones de producción para mejor rendimiento
        extra: configService.get<string>('NODE_ENV') === 'production' ? {
          max: 20, // Máximo de conexiones
          connectionTimeoutMillis: 2000,
          query_timeout: 10000,
          statement_timeout: 10000,
        } : undefined,
        // Pool de conexiones para mejor rendimiento
        poolSize: configService.get<string>('NODE_ENV') === 'production' ? 10 : 5,
        // Cache de consultas para mejor rendimiento
        cache: {
          duration: 60000, // 1 minuto de cache
        },
      }),
    }),
  ],
})
export class DatabaseModule {}