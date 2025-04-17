import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Favorite } from './schemas/favorite.schema';
import { FavoriteDto } from './dto/favorite.dto';

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;

describe('FavoritesService', () => {
  let service: FavoritesService;
  let model: MockModel<Favorite>;

  beforeEach(async () => {
    const mockFavoriteModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
      new: jest.fn(),
      constructor: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getModelToken(Favorite.name),
          useValue: mockFavoriteModel,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    model = module.get<MockModel<Favorite>>(getModelToken(Favorite.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of favorites', async () => {
      const mockFavorites = [
        { name: 'pikachu', createdAt: new Date() },
        { name: 'charizard', createdAt: new Date() },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockFavorites),
      };

      model.find = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual(mockFavorites);
    });
  });

  describe('addFavorite', () => {
    it('should add a new favorite successfully', async () => {
      const dto: FavoriteDto = { name: 'pikachu' };
      const mockFavorite = {
        name: 'pikachu',
        save: jest.fn().mockResolvedValue({ name: 'pikachu', _id: 'some-id' }),
      };

      model.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      model.constructor = jest.fn().mockImplementation(() => mockFavorite);

      const result = await service.addFavorite(dto);

      expect(model.findOne).toHaveBeenCalledWith({ name: dto.name });
      expect(mockFavorite.save).toHaveBeenCalled();
      expect(result).toEqual({ name: 'pikachu', _id: 'some-id' });
    });

    it('should throw a ConflictException if pokemon is already a favorite', async () => {
      const dto: FavoriteDto = { name: 'pikachu' };

      model.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ name: 'pikachu' }),
      });

      await expect(service.addFavorite(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      const dto: FavoriteDto = { name: 'pikachu' };

      model.deleteOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.removeFavorite(dto);

      expect(model.deleteOne).toHaveBeenCalledWith({ name: dto.name });
    });

    it('should throw a NotFoundException if pokemon is not found in favorites', async () => {
      const dto: FavoriteDto = { name: 'pikachu' };

      model.deleteOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.removeFavorite(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
