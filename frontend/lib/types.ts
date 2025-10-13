export interface Movie {
  imdbID: string;
  title: string;
  year: string;
  poster?: string;
}

export interface SearchResponse {
  movies: Movie[];
  totalResults: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
