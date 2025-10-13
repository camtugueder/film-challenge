import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto, ImdbIdParamDto } from '../common/dto/movie.dto';
import { FavoriteMovie } from './favorite.entity';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorite movies' })
  @ApiResponse({ status: 200, description: 'Returns array of favorite movies', type: [FavoriteMovie] })
  async getAll(): Promise<FavoriteMovie[]> {
    return this.favoritesService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add a movie to favorites' })
  @ApiBody({ type: AddFavoriteDto })
  @ApiResponse({ status: 201, description: 'Movie added to favorites successfully', type: FavoriteMovie })
  @ApiResponse({ status: 400, description: 'Invalid movie data' })
  @ApiResponse({ status: 409, description: 'Movie already in favorites' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async add(@Body() addFavoriteDto: AddFavoriteDto): Promise<FavoriteMovie> {
    return this.favoritesService.add(addFavoriteDto);
  }

  @Delete(':imdbID')
  @ApiOperation({ summary: 'Remove a movie from favorites (idempotent)' })
  @ApiParam({ name: 'imdbID', description: 'IMDb ID of the movie to remove', example: 'tt0468569' })
  @ApiResponse({ status: 204, description: 'Movie removed successfully (idempotent - succeeds whether movie existed or not)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async remove(@Param() params: ImdbIdParamDto): Promise<void> {
    return this.favoritesService.remove(params.imdbID);
  }
}
