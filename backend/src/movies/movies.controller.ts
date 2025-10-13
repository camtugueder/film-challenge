import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OmdbService } from '../omdb/omdb.service';
import { SearchQueryDto, MovieDto } from '../common/dto/movie.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly omdbService: OmdbService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for movies by title' })
  @ApiQuery({ name: 'query', description: 'Movie title to search for', example: 'Batman' })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', required: false, example: 1 })
  @ApiResponse({ status: 200, description: 'Search results returned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query or no movies found' })
  async search(
    @Query() searchQuery: SearchQueryDto,
  ): Promise<{ movies: MovieDto[]; totalResults: number }> {
    const page = this.parsePage(searchQuery.page);
    return this.omdbService.searchMovies(searchQuery.query, page);
  }

  private parsePage(pageStr?: string): number {
    if (!pageStr) {
      return 1;
    }

    const page = parseInt(pageStr, 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }
}
