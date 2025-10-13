import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { Repository } from 'typeorm';
import { FavoriteMovie } from './favorite.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let repository: Repository<FavoriteMovie>;

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
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(FavoriteMovie),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    repository = module.get<Repository<FavoriteMovie>>(
      getRepositoryToken(FavoriteMovie),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an empty array when no favorites exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return all favorite movies', async () => {
      const favorites = [mockMovie, mockMovie2];
      jest.spyOn(repository, 'find').mockResolvedValue(favorites as FavoriteMovie[]);

      const result = await service.getAll();

      expect(result).toEqual(favorites);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('add', () => {
    it('should add a movie to favorites', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(mockMovie as FavoriteMovie);

      const result = await service.add(mockMovie);

      expect(result).toEqual(mockMovie);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { imdbID: mockMovie.imdbID },
      });
      expect(repository.save).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw ConflictException when movie already exists in favorites', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockMovie as FavoriteMovie);

      await expect(service.add(mockMovie)).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should handle save errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(service.add(mockMovie)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a movie from favorites', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockMovie as FavoriteMovie);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockMovie as FavoriteMovie);

      await service.remove(mockMovie.imdbID);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { imdbID: mockMovie.imdbID },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockMovie);
    });

    it('should succeed idempotently when movie is not in favorites', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await service.remove('nonexistent');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { imdbID: 'nonexistent' },
      });
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });

  describe('exists', () => {
    it('should return true when movie exists in favorites', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockMovie as FavoriteMovie);

      const result = await service.exists(mockMovie.imdbID);

      expect(result).toBe(true);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { imdbID: mockMovie.imdbID },
      });
    });

    it('should return false when movie does not exist in favorites', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.exists('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return the count of favorites', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(5);

      const result = await service.count();

      expect(result).toBe(5);
      expect(repository.count).toHaveBeenCalled();
    });

    it('should return 0 when no favorites exist', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(0);

      const result = await service.count();

      expect(result).toBe(0);
    });
  });
});
