import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    markAsSold: jest.fn(),
    findByUser: jest.fn(),
    findSoldByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        categoryId: 1,
        images: ['image1.jpg'],
      };
      const req = { user: { id: 'user-1' } };
      const product = { id: 1, ...createProductDto };

      mockProductService.create.mockResolvedValue(product);

      const result = await controller.create(createProductDto, req);

      expect(mockProductService.create).toHaveBeenCalledWith(createProductDto, 'user-1');
      expect(result).toEqual(product);
    });
  });

  describe('findAll', () => {
    it('should return filtered products', async () => {
      const query = { search: 'test', categoryId: '1', minPrice: '50', maxPrice: '200' };
      const products = [{ id: 1, name: 'Test Product' }];

      mockProductService.findAll.mockResolvedValue(products);

      const result = await controller.findAll(query.search, query.categoryId, query.minPrice, query.maxPrice);

      expect(mockProductService.findAll).toHaveBeenCalledWith({
        search: 'test',
        categoryId: 1,
        minPrice: 50,
        maxPrice: 200,
      });
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: 1, name: 'Test Product' };

      mockProductService.findOne.mockResolvedValue(product);

      const result = await controller.findOne('1');

      expect(mockProductService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { name: 'Updated Product' };
      const req = { user: { id: 'user-1' } };
      const product = { id: 1, name: 'Updated Product' };

      mockProductService.update.mockResolvedValue(product);

      const result = await controller.update('1', updateProductDto, req);

      expect(mockProductService.update).toHaveBeenCalledWith(1, updateProductDto, 'user-1');
      expect(result).toEqual(product);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const req = { user: { id: 'user-1' } };

      mockProductService.remove.mockResolvedValue(undefined);

      await controller.remove('1', req);

      expect(mockProductService.remove).toHaveBeenCalledWith(1, 'user-1');
    });
  });

  describe('markAsSold', () => {
    it('should mark product as sold', async () => {
      const req = { user: { id: 'user-1' } };
      const product = { id: 1, status: 'SOLD' };

      mockProductService.markAsSold.mockResolvedValue(product);

      const result = await controller.markAsSold('1', req);

      expect(mockProductService.markAsSold).toHaveBeenCalledWith(1, 'user-1');
      expect(result).toEqual(product);
    });
  });

  describe('findByUser', () => {
    it('should return products by user', async () => {
      const userId = 'user-1';
      const products = [{ id: 1, userId, name: 'Product 1' }];

      mockProductService.findByUser.mockResolvedValue(products);

      const result = await controller.findByUser(userId);

      expect(mockProductService.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(products);
    });
  });

  describe('findSoldByUser', () => {
    it('should return sold products by user', async () => {
      const userId = 'user-1';
      const products = [{ id: 1, userId, status: 'SOLD' }];

      mockProductService.findSoldByUser.mockResolvedValue(products);

      const result = await controller.findSoldByUser(userId);

      expect(mockProductService.findSoldByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(products);
    });
  });
});
