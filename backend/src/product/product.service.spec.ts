import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { PhoneVerificationService } from '../phone-verification/phone-verification.service';
import { MetricsService } from '../metrics/metrics.service';
import { CustomLogger } from '../common/logger.service';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  let phoneVerificationService: PhoneVerificationService;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getRawAndEntities: jest.fn(),
    getMany: jest.fn(),
  };

  const mockPhoneVerificationService = {
    isPhoneVerified: jest.fn(),
  };

  const mockMetricsService = {
    incrementViews: jest.fn(),
    incrementContacts: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    logUserAction: jest.fn(),
    logProductModeration: jest.fn(),
    logApiCall: jest.fn(),
    logSecurityEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: PhoneVerificationService,
          useValue: mockPhoneVerificationService,
        },
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    phoneVerificationService = module.get<PhoneVerificationService>(PhoneVerificationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product if phone is verified', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        categoryId: 1,
        images: ['image1.jpg'],
      };
      const userId = 'user-1';
      const product = { id: 1, ...createProductDto, userId };

      mockPhoneVerificationService.isPhoneVerified.mockResolvedValue(true);
      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(product);

      const result = await service.create(createProductDto, userId);

      expect(mockPhoneVerificationService.isPhoneVerified).toHaveBeenCalledWith(userId);
      expect(mockProductRepository.create).toHaveBeenCalledWith({ ...createProductDto, userId });
      expect(mockProductRepository.save).toHaveBeenCalledWith(product);
      expect(result).toEqual(product);
    });

    it('should throw ForbiddenException if phone is not verified', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        categoryId: 1,
        images: ['image1.jpg'],
      };
      const userId = 'user-1';

      mockPhoneVerificationService.isPhoneVerified.mockResolvedValue(false);

      await expect(service.create(createProductDto, userId)).rejects.toThrow('Debes verificar tu número de teléfono para publicar productos');
    });
  });

  describe('findAll', () => {
    it('should return filtered products', async () => {
      const query = { search: 'test', categoryId: 1 };
      const products = [{ id: 1, name: 'Test Product' }];

      mockProductRepository.getMany.mockResolvedValue(products);

      const result = await service.findAll(query);

      expect(mockProductRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: 1, name: 'Test Product' };
      mockProductRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'user'],
      });
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    it('should update a product if user owns it', async () => {
      const product = { id: 1, userId: 'user-1', name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const userId = 'user-1';

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.update.mockResolvedValue(undefined);
      mockProductRepository.findOne.mockResolvedValue({ ...product, ...updateDto });

      const result = await service.update(1, updateDto, userId);

      expect(mockProductRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual({ ...product, ...updateDto });
    });

    it('should throw ForbiddenException if user does not own product', async () => {
      const product = { id: 1, userId: 'user-2', name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const userId = 'user-1';

      mockProductRepository.findOne.mockResolvedValue(product);

      await expect(service.update(1, updateDto, userId)).rejects.toThrow('No tienes permiso para editar este producto');
    });
  });

  describe('remove', () => {
    it('should delete a product if user owns it', async () => {
      const product = { id: 1, userId: 'user-1' };
      const userId = 'user-1';

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.delete.mockResolvedValue(undefined);

      await service.remove(1, userId);

      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user does not own product', async () => {
      const product = { id: 1, userId: 'user-2' };
      const userId = 'user-1';

      mockProductRepository.findOne.mockResolvedValue(product);

      await expect(service.remove(1, userId)).rejects.toThrow('No tienes permiso para eliminar este producto');
    });
  });

  describe('markAsSold', () => {
    it('should mark product as sold if user owns it', async () => {
      const product = { id: 1, userId: 'user-1', status: 'ACTIVE' };
      const userId = 'user-1';

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.update.mockResolvedValue(undefined);
      mockProductRepository.findOne.mockResolvedValue({ ...product, status: 'SOLD' });

      const result = await service.markAsSold(1, userId);

      expect(mockProductRepository.update).toHaveBeenCalledWith(1, { status: 'SOLD' });
      expect(result).toEqual({ ...product, status: 'SOLD' });
    });
  });
});
