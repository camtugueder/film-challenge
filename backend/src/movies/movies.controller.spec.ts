import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { OmdbService } from '../omdb/omdb.service';
import { BadRequestException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let omdbService: OmdbService;

  const mockMovies = [
    {
      imdbID: 'tt0372784',
      title: 'Batman Begins',
      year: '2005',
      poster: 'https://example.com/poster1.jpg',
    },
    {
      imdbID: 'tt0468569',
      title: 'The Dark Knight',
      year: '2008',
      poster: 'https://example.com/poster2.jpg',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: OmdbService,
          useValue: {
            searchMovies: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    omdbService = module.get<OmdbService>(OmdbService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return movies for a valid search query', async () => {
      const mockResult = {
        movies: mockMovies,
        totalResults: 2,
      };

      jest.spyOn(omdbService, 'searchMovies').mockResolvedValue(mockResult);

      const result = await controller.search({ query: 'batman' });

      expect(result).toEqual(mockResult);
      expect(omdbService.searchMovies).toHaveBeenCalledWith('batman', 1);
    });

    it('should handle pagination correctly', async () => {
      const mockResult = {
        movies: mockMovies,
        totalResults: 100,
      };

      jest.spyOn(omdbService, 'searchMovies').mockResolvedValue(mockResult);

      await controller.search({ query: 'batman', page: '2' });

      expect(omdbService.searchMovies).toHaveBeenCalledWith('batman', 2);
    });

    it('should default to page 1 when page is not provided', async () => {
      const mockResult = {
        movies: mockMovies,
        totalResults: 2,
      };

      jest.spyOn(omdbService, 'searchMovies').mockResolvedValue(mockResult);

      await controller.search({ query: 'batman' });

      expect(omdbService.searchMovies).toHaveBeenCalledWith('batman', 1);
    });

    it('should throw BadRequestException for empty query', async () => {
      jest
        .spyOn(omdbService, 'searchMovies')
        .mockRejectedValue(new BadRequestException('Search query cannot be empty'));

      await expect(controller.search({ query: '' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle service errors', async () => {
      jest
        .spyOn(omdbService, 'searchMovies')
        .mockRejectedValue(new Error('Service error'));

      await expect(controller.search({ query: 'batman' })).rejects.toThrow();
    });

    it('should handle invalid page numbers', async () => {
      const mockResult = {
        movies: mockMovies,
        totalResults: 2,
      };

      jest.spyOn(omdbService, 'searchMovies').mockResolvedValue(mockResult);

      await controller.search({ query: 'batman', page: 'invalid' });

      // Should default to page 1 for invalid page numbers
      expect(omdbService.searchMovies).toHaveBeenCalledWith('batman', 1);
    });

    it('should handle negative page numbers', async () => {
      const mockResult = {
        movies: mockMovies,
        totalResults: 2,
      };

      jest.spyOn(omdbService, 'searchMovies').mockResolvedValue(mockResult);

      await controller.search({ query: 'batman', page: '-1' });

      // Should default to page 1 for negative numbers
      expect(omdbService.searchMovies).toHaveBeenCalledWith('batman', 1);
    });
  });
});
