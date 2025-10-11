import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// Mockeamos la librería bcrypt para no hashear contraseñas reales en los tests
jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  // Creamos un mock del repositorio de usuarios
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@miuniversidad.edu.co',
      password: 'password123',
    };

    it('should successfully create and return a user', async () => {
      const hashedPassword = 'hashedPassword123';
      const user = {
        id: 'some-uuid',
        ...createUserDto,
        password: hashedPassword, // El usuario guardado tiene la contraseña hasheada
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Configuramos los mocks
      mockUserRepository.findOneBy.mockResolvedValue(null); // No hay usuario existente
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      // Verificamos que los métodos fueron llamados correctamente
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({ ...createUserDto, password: hashedPassword });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);

      // Verificamos que la contraseña no se devuelve en el resultado
      expect(result).not.toHaveProperty('password');
      expect(result.email).toEqual(createUserDto.email);
    });

    it('should throw a ConflictException if email already exists', async () => {
      // Simulamos que el usuario ya existe
      mockUserRepository.findOneBy.mockResolvedValue(new User());

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
});