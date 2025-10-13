import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/nextjs';
import { Movie, SearchResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API errors
function handleApiError(error: unknown): never {
  // Log error to Sentry
  Sentry.captureException(error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'An error occurred';
    throw new ApiError(message, axiosError.response?.status);
  }
  throw new ApiError('An unexpected error occurred');
}

export const api = {
  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get<SearchResponse>('/movies/search', {
        params: { query, page: page.toString() },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all favorites
  getFavorites: async (): Promise<Movie[]> => {
    try {
      const response = await apiClient.get<Movie[]>('/favorites');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Add to favorites
  addFavorite: async (movie: Movie): Promise<Movie> => {
    try {
      const response = await apiClient.post<Movie>('/favorites', movie);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Remove from favorites
  removeFavorite: async (imdbID: string): Promise<void> => {
    try {
      await apiClient.delete(`/favorites/${imdbID}`);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
