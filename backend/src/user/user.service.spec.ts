import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Metric } from '../metrics/entities/metric.entity';
import { CreateUserDto } from './dto/create-user.dto';

// Mockeamos la librería bcrypt para no hashear contraseñas reales en los tests
jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  // Creamos un mock del repositorio de usuarios
  const mockUserRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOneBy: vi.fn(),
  };

  const mockProductRepository = {
    count: vi.fn(),
    createQueryBuilder: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    leftJoinAndSelect: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    addGroupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    take: vi.fn().mockReturnThis(),
    getRawMany: vi.fn(),
    getRawAndEntities: vi.fn(),
  };

  const mockMetricRepository = {
    createQueryBuilder: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    getRawOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Metric),
          useValue: mockMetricRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // Limpiamos los mocks antes de cada test
    vi.clearAllMocks();
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