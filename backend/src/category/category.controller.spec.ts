import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const body = { name: 'Electronics', description: 'Electronic devices' };
      const mockReq = { user: { role: 'ADMIN' } };
      const category = { id: 1, ...body };

      mockCategoryService.create.mockResolvedValue(category);

      const result = await controller.create(body, mockReq);

      expect(mockCategoryService.create).toHaveBeenCalledWith(body.name, body.description);
      expect(result).toEqual(category);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [{ id: 1, name: 'Electronics' }];

      mockCategoryService.findAll.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(mockCategoryService.findAll).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Electronics' };

      mockCategoryService.findOne.mockResolvedValue(category);

      const result = await controller.findOne('1');

      expect(mockCategoryService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(category);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const body = { name: 'Updated Electronics', description: 'Updated description' };
      const mockReq = { user: { role: 'ADMIN' } };
      const category = { id: 1, name: 'Updated Electronics', description: 'Updated description' };

      mockCategoryService.update.mockResolvedValue(category);

      const result = await controller.update('1', body, mockReq);

      expect(mockCategoryService.update).toHaveBeenCalledWith(1, body.name, body.description);
      expect(result).toEqual(category);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const mockReq = { user: { role: 'ADMIN' } };
      mockCategoryService.remove.mockResolvedValue(undefined);

      await controller.remove('1', mockReq);

      expect(mockCategoryService.remove).toHaveBeenCalledWith(1);
    });
  });
});
