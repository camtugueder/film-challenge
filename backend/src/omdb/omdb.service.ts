import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { MovieDto } from '../common/dto/movie.dto';

// OMDb API response structure (PascalCase from external API)
interface OmdbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface OmdbSearchResponse {
  Search?: OmdbMovie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

@Injectable()
export class OmdbService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.omdbapi.com/';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // API key is validated by ConfigModule validation schema at startup
    // Type assertion is safe because validation ensures it exists
    this.apiKey = this.configService.get<string>('OMDB_API_KEY')!;
  }

  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<{ movies: MovieDto[]; totalResults: number }> {
    if (!query || query.trim() === '') {
      throw new BadRequestException('Search query cannot be empty');
    }

    try {
      const url = `${this.baseUrl}?apikey=${this.apiKey}&s=${encodeURIComponent(query)}&page=${page}`;
      const response = await firstValueFrom(
        this.httpService.get<OmdbSearchResponse>(url, {
          timeout: 5000, // 5 second timeout
        })
      );

      if (response.data.Response === 'False') {
        throw new BadRequestException(
          response.data.Error || 'No movies found',
        );
      }

      const omdbMovies = response.data.Search || [];

      // Transform OMDb API response (PascalCase) to our DTOs (camelCase)
      const movies = plainToInstance(MovieDto, omdbMovies, {
        excludeExtraneousValues: true,
      });

      const totalResults = parseInt(response.data.totalResults || '0', 10) || 0;

      return {
        movies,
        totalResults,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Preserve error details for better debugging in production
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = `Failed to fetch movies from OMDb API: ${errorMessage}`;

      throw new InternalServerErrorException(errorDetails);
    }
  }
}
