import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { Movie } from './types';

// Query keys
export const queryKeys = {
  movies: (query: string, page: number) => ['movies', query, page] as const,
  favorites: () => ['favorites'] as const,
};

// Hook to search movies
export function useSearchMovies(query: string, page: number = 1) {
  return useQuery({
    queryKey: queryKeys.movies(query, page),
    queryFn: () => api.searchMovies(query, page),
    enabled: query.length > 0, // Only fetch if query is not empty
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get all favorites
export function useFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites(),
    queryFn: () => api.getFavorites(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Hook to add a movie to favorites
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movie: Movie) => api.addFavorite(movie),
    onMutate: async (newMovie) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites() });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<Movie[]>(
        queryKeys.favorites(),
      );

      // Optimistically update to the new value
      if (previousFavorites) {
        queryClient.setQueryData<Movie[]>(
          queryKeys.favorites(),
          [...previousFavorites, newMovie],
        );
      }

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (err, newMovie, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites(), context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites() });
    },
  });
}

// Hook to remove a movie from favorites
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imdbID: string) => api.removeFavorite(imdbID),
    onMutate: async (imdbID) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites() });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<Movie[]>(
        queryKeys.favorites(),
      );

      // Optimistically update to the new value
      if (previousFavorites) {
        queryClient.setQueryData<Movie[]>(
          queryKeys.favorites(),
          previousFavorites.filter((movie) => movie.imdbID !== imdbID),
        );
      }

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (err, imdbID, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKeys.favorites(), context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites() });
    },
  });
}
