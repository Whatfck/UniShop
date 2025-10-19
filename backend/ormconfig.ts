import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'unishop_user',
  password: 'unishop_password',
  database: 'unishop_db',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false, // Deshabilitado para usar migraciones
  logging: true,
});

export default AppDataSource;