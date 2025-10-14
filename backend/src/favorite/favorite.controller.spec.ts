import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

  const mockFavoriteService = {
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    getUserFavorites: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: mockFavoriteService,
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should add a product to favorites', async () => {
      const body = { productId: 1 };
      const mockReq = { user: { id: 'user-1' } };
      const favorite = { id: 1, userId: 'user-1', productId: 1 };

      mockFavoriteService.addToFavorites.mockResolvedValue(favorite);

      const result = await controller.add(body, mockReq);

      expect(mockFavoriteService.addToFavorites).toHaveBeenCalledWith('user-1', body.productId);
      expect(result).toEqual(favorite);
    });
  });

  describe('remove', () => {
    it('should remove a product from favorites', async () => {
      const productId = '1';
      const mockReq = { user: { id: 'user-1' } };

      mockFavoriteService.removeFromFavorites.mockResolvedValue(undefined);

      await controller.remove(productId, mockReq);

      expect(mockFavoriteService.removeFromFavorites).toHaveBeenCalledWith('user-1', 1);
    });
  });

  describe('getMyFavorites', () => {
    it('should return user favorites', async () => {
      const mockReq = { user: { id: 'user-1' } };
      const favorites = [{ id: 1, userId: 'user-1', productId: 1 }];

      mockFavoriteService.getUserFavorites.mockResolvedValue(favorites);

      const result = await controller.getMyFavorites(mockReq);

      expect(mockFavoriteService.getUserFavorites).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(favorites);
    });
  });

  describe('getUserFavorites', () => {
    it('should return user favorites', async () => {
      const userId = 'user-1';
      const favorites = [{ id: 1, userId, productId: 1 }];

      mockFavoriteService.getUserFavorites.mockResolvedValue(favorites);

      const result = await controller.getUserFavorites(userId);

      expect(mockFavoriteService.getUserFavorites).toHaveBeenCalledWith(userId);
      expect(result).toEqual(favorites);
    });
  });
});
