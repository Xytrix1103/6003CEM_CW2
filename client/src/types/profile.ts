import type { MovieDetailsResponse } from '@/types/movie'
import type { Visit } from '@/types/visit'

export type Profile = {
	_id: string;
	firebaseUid: string;
	email: string;
	displayName: string;
	watchlist: number[];
	watched: Watched[];
	movies: MovieDetailsResponse[];
	visits?: Visit[];  // Array of visit IDs
	createdAt: Date;
}

export type Watched = {
	movieId: number;        // TMDB movie ID
	isFavorited: boolean;   // Whether the movie is favorited
	feedback: {
		rating: number | null;
		content: string | null;
		createdAt: Date;
		updatedAt: Date;
	};
}

export type ProfileContextType = {
	profile: Profile | null;
	loading: boolean;
	refreshProfile: () => Promise<void>;
	updateDisplayName: (displayName: string) => Promise<void>;
	addToWatchlist: (movieId: number) => Promise<void>;
	removeFromWatchlist: (movieId: number) => Promise<void>;
	favoriteMovie: (movieId: number) => Promise<void>;
	unfavoriteMovie: (movieId: number) => Promise<void>;
	addReview: (movieId: number, rating: number | null, content: string | null) => Promise<void>;
	updateReview: (movieId: number, rating: number | null, content: string | null) => Promise<void>;
	deleteReview: (movieId: number) => Promise<void>;
}