import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { ConflictException } from '@nestjs/common';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  const mockMovie = {
    imdbID: 'tt0372784',
    title: 'Batman Begins',
    year: '2005',
    poster: 'https://example.com/poster.jpg',
  };

  const mockMovie2 = {
    imdbID: 'tt0468569',
    title: 'The Dark Knight',
    year: '2008',
    poster: 'https://example.com/poster2.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            getAll: jest.fn(),
            add: jest.fn(),
            remove: jest.fn(),
            exists: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an empty array when no favorites exist', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should return all favorite movies', async () => {
      const favorites = [mockMovie, mockMovie2];
      jest.spyOn(service, 'getAll').mockResolvedValue(favorites as any);

      const result = await controller.getAll();

      expect(result).toEqual(favorites);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('add', () => {
    it('should add a movie to favorites', async () => {
      jest.spyOn(service, 'add').mockResolvedValue(mockMovie as any);

      const result = await controller.add(mockMovie);

      expect(result).toEqual(mockMovie);
      expect(service.add).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw ConflictException when movie already exists', async () => {
      jest
        .spyOn(service, 'add')
        .mockRejectedValue(
          new ConflictException('Movie already in favorites'),
        );

      await expect(controller.add(mockMovie)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should validate movie data', async () => {
      const invalidMovie = {
        imdbID: '',
        title: 'Batman',
        year: '2005',
      };

      jest.spyOn(service, 'add').mockResolvedValue(invalidMovie as any);

      // The controller should pass the data to the service
      // Validation will be handled by class-validator pipes
      await controller.add(invalidMovie as any);

      expect(service.add).toHaveBeenCalledWith(invalidMovie);
    });
  });

  describe('remove', () => {
    it('should remove a movie from favorites', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove({ imdbID: mockMovie.imdbID });

      expect(service.remove).toHaveBeenCalledWith(mockMovie.imdbID);
    });

    it('should succeed idempotently when movie is not in favorites', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove({ imdbID: 'nonexistent' });

      expect(service.remove).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle empty imdbID', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove({ imdbID: '' });

      expect(service.remove).toHaveBeenCalledWith('');
    });
  });
});
