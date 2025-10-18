import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<Category>;

  const mockCategoryRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a category', async () => {
      const name = 'Electronics';
      const category = { id: 1, name };

      mockCategoryRepository.create.mockReturnValue(category);
      mockCategoryRepository.save.mockResolvedValue(category);

      const result = await service.create(name);

      expect(mockCategoryRepository.create).toHaveBeenCalledWith({ name });
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(category);
      expect(result).toEqual(category);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [{ id: 1, name: 'Electronics' }];
      mockCategoryRepository.find.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(mockCategoryRepository.find).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Electronics' };
      mockCategoryRepository.findOneBy.mockResolvedValue(category);

      const result = await service.findOne(1);

      expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(category);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const category = { id: 1, name: 'Electronics' };
      const updatedCategory = { id: 1, name: 'Updated Electronics' };

      mockCategoryRepository.update.mockResolvedValue(undefined);
      mockCategoryRepository.findOneBy.mockResolvedValue(updatedCategory);

      const result = await service.update(1, 'Updated Electronics');

      expect(mockCategoryRepository.update).toHaveBeenCalledWith(1, { name: 'Updated Electronics' });
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockCategoryRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
