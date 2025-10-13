'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/lib/types';
import { useAddFavorite, useRemoveFavorite } from '@/lib/hooks';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean; // Passed down from parent to avoid N+1 query problem
}

export function MovieCard({ movie, isFavorite }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavorite.mutate(movie.imdbID);
    } else {
      addFavorite.mutate(movie);
    }
  };

  const showFallback = !movie.poster || movie.poster === 'N/A' || imageError;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
        {showFallback ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">No Image Available</p>
            </div>
          </div>
        ) : (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover"
            unoptimized // OMDb images are from external domains
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {movie.year}
        </p>
        <button
          onClick={handleToggleFavorite}
          disabled={addFavorite.isPending || removeFavorite.isPending}
          className={`w-full py-2 px-4 rounded transition-colors ${
            isFavorite
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {addFavorite.isPending || removeFavorite.isPending
            ? 'Loading...'
            : isFavorite
            ? 'Remove from Favorites'
            : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}
