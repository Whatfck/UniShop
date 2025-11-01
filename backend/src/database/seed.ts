import { DataSource } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { TEST_USERS } from './test-users';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  // Use raw SQL in the seeding process to avoid issues with entity
  // metadata loading order in the containerized environment.
  console.log('🌱 Iniciando seeding de base de datos... (raw SQL)');

  // Crear categorías iniciales
  const categories = [
    { name: 'Libros', description: 'Libros de texto, novelas y material académico' },
    { name: 'Tecnología', description: 'Computadores, celulares, accesorios electrónicos' },
    { name: 'Ropa', description: 'Ropa, zapatos y accesorios personales' },
    { name: 'Hogar', description: 'Artículos para el hogar y decoración' },
    { name: 'Deportes', description: 'Equipos y accesorios deportivos' },
    { name: 'Arte', description: 'Materiales de arte y suministros creativos' },
    { name: 'Herramientas', description: 'Herramientas y equipos de trabajo' },
    { name: 'Accesorios', description: 'Accesorios varios y complementos' },
    { name: 'Muebles', description: 'Muebles y mobiliario' },
    { name: 'Otros', description: 'Categoría general para productos diversos' },
  ];

  console.log('📂 Creando categorías (raw SQL)...');
  for (const categoryData of categories) {
    const rows = await dataSource.query('SELECT id FROM categories WHERE name = $1', [categoryData.name]);
    if (!rows || rows.length === 0) {
      await dataSource.query('INSERT INTO categories(name) VALUES ($1)', [categoryData.name]);
      console.log(`✅ Categoría creada: ${categoryData.name}`);
    } else {
      console.log(`⏭️  Categoría ya existe: ${categoryData.name}`);
    }
  }

  // Crear usuario administrador
  const adminEmail = 'admin@campusucc.edu.co';
    const existingAdminRows = await dataSource.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (!existingAdminRows || existingAdminRows.length === 0) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    // Use quoted column names for case-sensitive columns created by migrations
    await dataSource.query('INSERT INTO users(name,email,password,role,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),now())', ['Administrador', adminEmail, hashedPassword, UserRole.ADMIN]);
    console.log('👑 Usuario administrador creado');
  } else {
    console.log('⏭️  Usuario administrador ya existe');
  }

  // Crear usuario moderador
  const moderatorEmail = 'moderador@campusucc.edu.co';
    const existingModeratorRows = await dataSource.query('SELECT id FROM users WHERE email = $1', [moderatorEmail]);
  if (!existingModeratorRows || existingModeratorRows.length === 0) {
    const hashedPassword = await bcrypt.hash('Moderador123!', 10);
    await dataSource.query('INSERT INTO users(name,email,password,role,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),now())', ['Moderador', moderatorEmail, hashedPassword, UserRole.MODERATOR]);
    console.log('🛡️  Usuario moderador creado');
  } else {
    console.log('⏭️  Usuario moderador ya existe');
  }

  // Crear usuarios de prueba desde test-users.ts
  console.log('👥 Creando usuarios de prueba...');
  for (const testUser of TEST_USERS) {
    const existingUserRows = await dataSource.query('SELECT id FROM users WHERE email = $1', [testUser.email]);
    if (!existingUserRows || existingUserRows.length === 0) {
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await dataSource.query('INSERT INTO users(name,email,password,role,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),now())', [testUser.name, testUser.email, hashedPassword, testUser.role]);
      console.log(`✅ Usuario creado: ${testUser.name} (${testUser.role})`);
    } else {
      console.log(`⏭️  Usuario ya existe: ${testUser.name}`);
    }
  }

  console.log('🎉 Seeding completado exitosamente!');
}