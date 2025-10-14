import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let favoriteRepository: Repository<Favorite>;

  const mockFavoriteRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockFavoriteRepository,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    favoriteRepository = module.get<Repository<Favorite>>(getRepositoryToken(Favorite));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToFavorites', () => {
    it('should add a product to favorites', async () => {
      const userId = 'user-1';
      const productId = 1;
      const favorite = { userId, productId };

      mockFavoriteRepository.create.mockReturnValue(favorite);
      mockFavoriteRepository.save.mockResolvedValue(favorite);

      const result = await service.addToFavorites(userId, productId);

      expect(mockFavoriteRepository.create).toHaveBeenCalledWith({ userId, productId });
      expect(mockFavoriteRepository.save).toHaveBeenCalledWith(favorite);
      expect(result).toEqual(favorite);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a product from favorites', async () => {
      const userId = 'user-1';
      const productId = 1;

      mockFavoriteRepository.delete.mockResolvedValue(undefined);

      await service.removeFromFavorites(userId, productId);

      expect(mockFavoriteRepository.delete).toHaveBeenCalledWith({ userId, productId });
    });
  });

  describe('getUserFavorites', () => {
    it('should return user favorites with product relations', async () => {
      const userId = 'user-1';
      const favorites = [{ userId, productId: 1, product: { id: 1, name: 'Product 1' } }];

      mockFavoriteRepository.find.mockResolvedValue(favorites);

      const result = await service.getUserFavorites(userId);

      expect(mockFavoriteRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['product'],
      });
      expect(result).toEqual(favorites);
    });
  });

  describe('isFavorite', () => {
    it('should return true if product is favorite', async () => {
      const userId = 'user-1';
      const productId = 1;
      const favorite = { userId, productId };

      mockFavoriteRepository.findOneBy.mockResolvedValue(favorite);

      const result = await service.isFavorite(userId, productId);

      expect(mockFavoriteRepository.findOneBy).toHaveBeenCalledWith({ userId, productId });
      expect(result).toBe(true);
    });

    it('should return false if product is not favorite', async () => {
      const userId = 'user-1';
      const productId = 1;

      mockFavoriteRepository.findOneBy.mockResolvedValue(null);

      const result = await service.isFavorite(userId, productId);

      expect(mockFavoriteRepository.findOneBy).toHaveBeenCalledWith({ userId, productId });
      expect(result).toBe(false);
    });
  });
});
