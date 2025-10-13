import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteMovie } from './favorite.entity';
import { AddFavoriteDto } from '../common/dto/movie.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteMovie)
    private readonly favoriteRepository: Repository<FavoriteMovie>,
  ) {}

  async getAll(): Promise<FavoriteMovie[]> {
    return this.favoriteRepository.find();
  }

  async add(movie: AddFavoriteDto): Promise<FavoriteMovie> {
    const existing = await this.favoriteRepository.findOne({
      where: { imdbID: movie.imdbID },
    });

    if (existing) {
      throw new ConflictException(
        `Movie with ID ${movie.imdbID} is already in favorites`,
      );
    }

    return this.favoriteRepository.save(movie);
  }

  async remove(imdbID: string): Promise<void> {
    const existing = await this.favoriteRepository.findOne({
      where: { imdbID },
    });

    // Idempotent DELETE: succeed whether movie exists or not
    // This is REST best practice - DELETE should be idempotent
    if (existing) {
      // Use remove() instead of delete() to avoid race conditions
      // and ensure proper entity lifecycle hooks are called
      await this.favoriteRepository.remove(existing);
    }
  }

  async exists(imdbID: string): Promise<boolean> {
    const movie = await this.favoriteRepository.findOne({
      where: { imdbID },
    });
    return !!movie;
  }

  async count(): Promise<number> {
    return this.favoriteRepository.count();
  }
}
