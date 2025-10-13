import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';
import { OmdbModule } from './omdb/omdb.module';
import { FavoriteMovie } from './favorites/favorite.entity';
import { envValidationSchema } from './common/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true, // Stop validation on first error
      },
    }),
    // Rate limiting: 100 requests per minute per IP
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests
    }]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'favorites.db',
      entities: [FavoriteMovie],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true, // Automatically run migrations on startup
      synchronize: false, // Never use synchronize with migrations
      logging: process.env.NODE_ENV === 'development',
    }),
    MoviesModule,
    FavoritesModule,
    OmdbModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
