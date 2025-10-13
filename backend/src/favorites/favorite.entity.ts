import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('favorites')
export class FavoriteMovie {
  @ApiProperty({ description: 'IMDb ID of the movie', example: 'tt0468569' })
  @PrimaryColumn()
  imdbID!: string;

  @ApiProperty({ description: 'Movie title', example: 'The Dark Knight' })
  @Column({ name: 'Title' })
  title!: string;

  @ApiProperty({ description: 'Release year', example: '2008' })
  @Column({ name: 'Year' })
  year!: string;

  @ApiProperty({ description: 'URL to movie poster image', example: 'https://example.com/poster.jpg', required: false })
  @Column({ name: 'Poster', nullable: true })
  poster!: string;
}
