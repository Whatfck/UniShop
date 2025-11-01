import { DataSource } from 'typeorm';

// Use environment variables when available (Docker / process.env). Falls back to defaults for local dev.
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'unishop_user',
  password: process.env.DB_PASSWORD || 'unishop_password',
  database: process.env.DB_NAME || 'unishop_db',
  // Use compiled `dist` paths when running the production build inside Docker,
  // otherwise use `src` patterns for local development / ts-node.
  entities: process.env.NODE_ENV === 'production'
    ? ['dist/**/*.entity.js']
    : ['src/**/*.entity{.ts,.js}'],
  migrations: process.env.NODE_ENV === 'production'
    ? ['dist/src/migrations/*{.js}']
    : ['src/migrations/*{.ts,.js}'],
  synchronize: false, // Deshabilitado para usar migraciones
  logging: true,
});

export default AppDataSource;