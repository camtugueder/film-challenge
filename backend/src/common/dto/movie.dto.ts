import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieDto {
  @ApiProperty({ description: 'IMDb ID of the movie', example: 'tt0468569' })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'imdbID' })
  imdbID!: string;

  @ApiProperty({ description: 'Movie title', example: 'The Dark Knight' })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'Title' })
  title!: string;

  @ApiProperty({ description: 'Release year', example: '2008' })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'Year' })
  year!: string;

  @ApiProperty({ description: 'URL to movie poster image', example: 'https://example.com/poster.jpg', required: false })
  @IsString()
  @IsOptional()
  @Expose({ name: 'Poster' })
  poster?: string;
}

export class SearchQueryDto {
  @ApiProperty({ description: 'Movie title to search for', example: 'Batman' })
  @IsString()
  @IsNotEmpty()
  query!: string;

  @ApiProperty({ description: 'Page number for pagination', example: '1', required: false })
  @IsString()
  @IsOptional()
  page?: string;
}

export class AddFavoriteDto {
  @ApiProperty({ description: 'IMDb ID of the movie', example: 'tt0468569' })
  @IsString()
  @IsNotEmpty()
  imdbID!: string;

  @ApiProperty({ description: 'Movie title', example: 'The Dark Knight' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Release year', example: '2008' })
  @IsString()
  @IsNotEmpty()
  year!: string;

  @ApiProperty({ description: 'URL to movie poster image', example: 'https://example.com/poster.jpg', required: false })
  @IsString()
  @IsOptional()
  poster?: string;
}

export class ImdbIdParamDto {
  @ApiProperty({ description: 'IMDb ID of the movie', example: 'tt0468569' })
  @IsString()
  @IsNotEmpty()
  imdbID!: string;
}
