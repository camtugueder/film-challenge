import { DataSource } from 'typeorm';
import { FavoriteMovie } from './favorites/favorite.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'favorites.db',
  entities: [FavoriteMovie],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false when using migrations
  logging: process.env.NODE_ENV === 'development',
});
