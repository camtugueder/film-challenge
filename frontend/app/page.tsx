'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchMovies, useFavorites } from '@/lib/hooks';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSearchMovies(query, page);

  // Call useFavorites once at parent level to avoid N+1 query problem
  // Create a Set for O(1) lookup instead of O(n) with Array.some()
  const { data: favorites = [] } = useFavorites();
  const favoritesSet = useMemo(
    () => new Set(favorites.map((f) => f.imdbID)),
    [favorites],
  );

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page on new search
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Search for Movies
        </h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : 'Failed to search movies. Please try again.'
          }
        />
      )}

      {isLoading && <LoadingSpinner />}

      {!isLoading && !error && query && data?.movies.length === 0 && (
        <EmptyState
          title="No movies found"
          description="Try searching for a different movie title"
        />
      )}

      {!isLoading && !error && !query && (
        <EmptyState
          title="Start searching"
          description="Enter a movie title to get started"
        />
      )}

      {!isLoading && !error && data && data.movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {data.movies.map((movie, index) => (
              <MovieCard
                key={`${movie.imdbID}-${index}`}
                movie={movie}
                isFavorite={favoritesSet.has(movie.imdbID)}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalResults={data.totalResults}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
