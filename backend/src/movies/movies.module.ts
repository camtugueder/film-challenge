import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { OmdbModule } from '../omdb/omdb.module';

@Module({
  imports: [OmdbModule],
  controllers: [MoviesController],
})
export class MoviesModule {}
