import { DataSource } from 'typeorm';

// Use environment variables when available (Docker / process.env). Falls back to defaults for local dev.
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'unishop_user',
  password: process.env.DB_PASSWORD || 'unishop_password',
  database: process.env.DB_NAME || 'unishop_db',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false, // Deshabilitado para usar migraciones
  logging: true,
});

export default AppDataSource;