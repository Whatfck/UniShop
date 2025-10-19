import { User, UserRole } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

export interface TestUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phoneVerified: boolean;
  description?: string;
}

/**
 * Usuarios de prueba para desarrollo y testing
 * Incluye diferentes roles y escenarios de uso
 */
export const TEST_USERS: TestUser[] = [
  // Administradores
  {
    name: 'Administrador Principal',
    email: 'admin@campusucc.edu.co',
    password: 'Admin123!',
    role: UserRole.ADMIN,
    phoneVerified: true,
    description: 'Usuario administrador con control total del sistema'
  },
  {
    name: 'Super Admin',
    email: 'superadmin@campusucc.edu.co',
    password: 'Super123!',
    role: UserRole.ADMIN,
    phoneVerified: true,
    description: 'Administrador con permisos avanzados'
  },

  // Moderadores
  {
    name: 'Moderador Principal',
    email: 'moderador@campusucc.edu.co',
    password: 'Moderador123!',
    role: UserRole.MODERATOR,
    phoneVerified: true,
    description: 'Moderador para revisar publicaciones'
  },
  {
    name: 'Ana Moderadora',
    email: 'ana.moderadora@campusucc.edu.co',
    password: 'Mod123!',
    role: UserRole.MODERATOR,
    phoneVerified: true,
    description: 'Moderadora especializada en contenido académico'
  },

  // Usuarios normales con productos publicados
  {
    name: 'María González',
    email: 'maria.gonzalez@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante de Ingeniería vendiendo calculadora'
  },
  {
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante de Matemáticas vendiendo libro de cálculo'
  },
  {
    name: 'Ana López',
    email: 'ana.lopez@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante de Sistemas vendiendo audífonos'
  },
  {
    name: 'Juan Martínez',
    email: 'juan.martinez@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante vendiendo mochila para laptop'
  },
  {
    name: 'Laura Sánchez',
    email: 'laura.sanchez@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante de Ingeniería vendiendo kit de herramientas'
  },
  {
    name: 'Pedro Gómez',
    email: 'pedro.gomez@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante vendiendo cafetera italiana'
  },
  {
    name: 'Sofia Ramírez',
    email: 'sofia.ramirez@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante vendiendo teclado mecánico'
  },
  {
    name: 'Diego Torres',
    email: 'diego.torres@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante de Medicina vendiendo atlas de anatomía'
  },
  {
    name: 'Valentina Herrera',
    email: 'valentina.herrera@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante vendiendo silla ergonómica'
  },
  {
    name: 'Andrés Morales',
    email: 'andres.morales@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante de Artes vendiendo pinturas acrílicas'
  },
  {
    name: 'Camila Vargas',
    email: 'camila.vargas@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante vendiendo proyector'
  },
  {
    name: 'Mateo Castro',
    email: 'mateo.castro@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: true,
    description: 'Estudiante vendiendo bicicleta de montaña'
  },

  // Usuarios sin teléfono verificado (no pueden publicar)
  {
    name: 'Usuario Sin Verificar',
    email: 'sinverificar@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: false,
    description: 'Usuario que aún no verifica su teléfono'
  },
  {
    name: 'Nuevo Usuario',
    email: 'nuevo@campusucc.edu.co',
    password: 'Test123!',
    role: UserRole.USER,
    phoneVerified: false,
    description: 'Usuario recién registrado'
  }
];

/**
 * Crea entidades User a partir de los datos de prueba
 */
export async function createTestUsers(): Promise<User[]> {
  const users: User[] = [];

  for (const testUser of TEST_USERS) {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    const user = new User();
    user.name = testUser.name;
    user.email = testUser.email;
    user.password = hashedPassword;
    user.role = testUser.role;
    // Note: phoneVerified is not part of the User entity
    // It's handled separately in the phone verification system

    users.push(user);
  }

  return users;
}

/**
 * Obtiene credenciales de usuarios por rol para testing
 */
export function getUsersByRole(role: UserRole): TestUser[] {
  return TEST_USERS.filter(user => user.role === role);
}

/**
 * Obtiene un usuario específico por email
 */
export function getUserByEmail(email: string): TestUser | undefined {
  return TEST_USERS.find(user => user.email === email);
}

/**
 * Lista todos los usuarios con sus credenciales (para documentación)
 */
export function listAllTestUsers(): void {
  console.log('\n📋 USUARIOS DE PRUEBA DISPONIBLES:\n');

  const grouped = TEST_USERS.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
  }, {} as Record<UserRole, TestUser[]>);

  Object.entries(grouped).forEach(([role, users]) => {
    console.log(`\n👥 ${role.toUpperCase()}:`);
    users.forEach(user => {
      console.log(`  📧 ${user.email}`);
      console.log(`  🔑 ${user.password}`);
      console.log(`  📝 ${user.description}`);
      console.log('');
    });
  });
}