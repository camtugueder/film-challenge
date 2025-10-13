import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../lib/types';
import * as hooks from '../lib/hooks';

// Mock the hooks
jest.mock('../lib/hooks', () => ({
  useAddFavorite: jest.fn(),
  useRemoveFavorite: jest.fn(),
}));

const mockMovie: Movie = {
  imdbID: 'tt0372784',
  title: 'Batman Begins',
  year: '2005',
  poster: 'https://example.com/poster.jpg',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('MovieCard', () => {
  const mockAddFavorite = jest.fn();
  const mockRemoveFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useAddFavorite as jest.Mock).mockReturnValue({
      mutate: mockAddFavorite,
      isPending: false,
    });
    (hooks.useRemoveFavorite as jest.Mock).mockReturnValue({
      mutate: mockRemoveFavorite,
      isPending: false,
    });
  });

  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} isFavorite={false} />, { wrapper: createWrapper() });

    expect(screen.getByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByText('2005')).toBeInTheDocument();
    expect(screen.getByAltText('Batman Begins')).toBeInTheDocument();
  });

  it('shows "Add to Favorites" button when movie is not in favorites', () => {
    render(<MovieCard movie={mockMovie} isFavorite={false} />, { wrapper: createWrapper() });

    const button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add to Favorites');
  });

  it('shows "Remove from Favorites" button when movie is in favorites', () => {
    render(<MovieCard movie={mockMovie} isFavorite={true} />, { wrapper: createWrapper() });

    const button = screen.getByRole('button', { name: /remove from favorites/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Remove from Favorites');
  });

  it('calls addFavorite when Add button is clicked', () => {
    render(<MovieCard movie={mockMovie} isFavorite={false} />, { wrapper: createWrapper() });

    const button = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(button);

    expect(mockAddFavorite).toHaveBeenCalledWith(mockMovie);
  });

  it('calls removeFavorite when Remove button is clicked', () => {
    render(<MovieCard movie={mockMovie} isFavorite={true} />, { wrapper: createWrapper() });

    const button = screen.getByRole('button', { name: /remove from favorites/i });
    fireEvent.click(button);

    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockMovie.imdbID);
  });

  it('disables button while mutation is pending', () => {
    (hooks.useAddFavorite as jest.Mock).mockReturnValue({
      mutate: mockAddFavorite,
      isPending: true,
    });

    render(<MovieCard movie={mockMovie} isFavorite={false} />, { wrapper: createWrapper() });

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
  });

  it('displays "No Image" when poster is N/A', () => {
    const movieWithoutPoster = { ...mockMovie, poster: 'N/A' };
    render(<MovieCard movie={movieWithoutPoster} isFavorite={false} />, { wrapper: createWrapper() });

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });
});
