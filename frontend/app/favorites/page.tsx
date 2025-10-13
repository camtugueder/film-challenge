'use client';

import { useFavorites } from '@/lib/hooks';
import { MovieCard } from '@/components/MovieCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';

export default function FavoritesPage() {
  const { data: favorites = [], isLoading, error } = useFavorites();

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        My Favorite Movies
      </h2>

      {error && (
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : 'Failed to load favorites. Please try again.'
          }
        />
      )}

      {isLoading && <LoadingSpinner />}

      {!isLoading && !error && favorites.length === 0 && (
        <EmptyState
          title="No favorites yet"
          description="Start adding movies to your favorites from the search page"
        />
      )}

      {!isLoading && !error && favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((movie, index) => (
            <MovieCard key={`${movie.imdbID}-${index}`} movie={movie} isFavorite={true} />
          ))}
        </div>
      )}
    </main>
  );
}
