import { DataSource } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { TEST_USERS } from './test-users';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(Category);
  const userRepository = dataSource.getRepository(User);

  console.log('🌱 Iniciando seeding de base de datos...');

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

  console.log('📂 Creando categorías...');
  for (const categoryData of categories) {
    const existingCategory = await categoryRepository.findOneBy({ name: categoryData.name });
    if (!existingCategory) {
      await categoryRepository.save(categoryRepository.create(categoryData));
      console.log(`✅ Categoría creada: ${categoryData.name}`);
    } else {
      console.log(`⏭️  Categoría ya existe: ${categoryData.name}`);
    }
  }

  // Crear usuario administrador
  const adminEmail = 'admin@campusucc.edu.co';
  const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = userRepository.create({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    await userRepository.save(admin);
    console.log('👑 Usuario administrador creado');
  } else {
    console.log('⏭️  Usuario administrador ya existe');
  }

  // Crear usuario moderador
  const moderatorEmail = 'moderador@campusucc.edu.co';
  const existingModerator = await userRepository.findOneBy({ email: moderatorEmail });

  if (!existingModerator) {
    const hashedPassword = await bcrypt.hash('Moderador123!', 10);
    const moderator = userRepository.create({
      name: 'Moderador',
      email: moderatorEmail,
      password: hashedPassword,
      role: UserRole.MODERATOR,
    });
    await userRepository.save(moderator);
    console.log('🛡️  Usuario moderador creado');
  } else {
    console.log('⏭️  Usuario moderador ya existe');
  }

  // Crear usuarios de prueba desde test-users.ts
  console.log('👥 Creando usuarios de prueba...');
  for (const testUser of TEST_USERS) {
    const existingUser = await userRepository.findOneBy({ email: testUser.email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      const user = userRepository.create({
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role,
        // phoneVerified se maneja en el sistema de verificación de teléfono
      });
      await userRepository.save(user);
      console.log(`✅ Usuario creado: ${testUser.name} (${testUser.role})`);
    } else {
      console.log(`⏭️  Usuario ya existe: ${testUser.name}`);
    }
  }

  console.log('🎉 Seeding completado exitosamente!');
}