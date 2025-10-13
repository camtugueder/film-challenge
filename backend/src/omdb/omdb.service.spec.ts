import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { OmdbService } from './omdb.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('OmdbService', () => {
  let service: OmdbService;
  let httpService: HttpService;

  const mockApiKey = 'test-api-key';
  const mockMovieData = {
    Search: [
      {
        imdbID: 'tt0372784',
        Title: 'Batman Begins',
        Year: '2005',
        Poster: 'https://example.com/poster1.jpg',
      },
      {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster2.jpg',
      },
    ],
    totalResults: '2',
    Response: 'True',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OmdbService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockApiKey),
          },
        },
      ],
    }).compile();

    service = module.get<OmdbService>(OmdbService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return movies for a valid search query', async () => {
      const mockResponse: AxiosResponse = {
        data: mockMovieData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.searchMovies('batman');

      // Service transforms PascalCase to camelCase using plainToInstance
      expect(result).toEqual({
        movies: [
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
        ],
        totalResults: 2,
      });
      expect(httpService.get).toHaveBeenCalledWith(
        `https://www.omdbapi.com/?apikey=${mockApiKey}&s=batman&page=1`,
        { timeout: 5000 },
      );
    });

    it('should handle pagination correctly', async () => {
      const mockResponse: AxiosResponse = {
        data: mockMovieData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await service.searchMovies('batman', 2);

      expect(httpService.get).toHaveBeenCalledWith(
        `https://www.omdbapi.com/?apikey=${mockApiKey}&s=batman&page=2`,
        { timeout: 5000 },
      );
    });

    it('should throw BadRequestException when no results found', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          Response: 'False',
          Error: 'Movie not found!',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await expect(service.searchMovies('nonexistentmovie')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for empty search query', async () => {
      await expect(service.searchMovies('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on HTTP error', async () => {
      const mockError = {
        response: { status: 500 },
        message: 'Internal server error',
      } as AxiosError;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => mockError));

      await expect(service.searchMovies('batman')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error with details on HTTP failures', async () => {
      const mockError = new Error('Network timeout');
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => mockError));

      await expect(service.searchMovies('batman')).rejects.toThrow(
        'Failed to fetch movies from OMDb API: Network timeout',
      );
    });

    it('should handle totalResults correctly', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          Search: mockMovieData.Search,
          totalResults: '350',
          Response: 'True',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.searchMovies('batman');

      expect(result.totalResults).toBe(350);
    });

    it('should handle invalid totalResults gracefully', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          Search: mockMovieData.Search,
          totalResults: 'invalid',
          Response: 'True',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.searchMovies('batman');

      expect(result.totalResults).toBe(0);
    });
  });
});
