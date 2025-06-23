import { omdbClient, tmdbClient } from '../services/movie_api';
import { Request, Response } from 'express';
import Watched from '../models/Watched';


export const discoverPopularMoviesController = async (req: Request, res: Response): Promise<void> => {
	const { page = 1 } = req.query;
	try {
		const response = await tmdbClient.get('/movie/popular', {
			params: {
				page,
			},
		});
		res.status(200).json({
			...response.data,
			message: 'Popular movies fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching popular movies:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

export const discoverTopRatedMoviesController = async (req: Request, res: Response): Promise<void> => {
	const { page = 1 } = req.query;
	try {
		const response = await tmdbClient.get('/movie/top_rated', {
			params: {
				page,
			},
		});
		res.status(200).json({
			...response.data,
			message: 'Top-rated movies fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching top-rated movies:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

export const discoverUpcomingMoviesController = async (req: Request, res: Response): Promise<void> => {
	const { page = 1 } = req.query;
	try {
		const response = await tmdbClient.get('/movie/upcoming', {
			params: {
				page,
			},
		});
		res.status(200).json({
			...response.data,
			message: 'Upcoming movies fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching upcoming movies:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

export const discoverNowPlayingMoviesController = async (req: Request, res: Response): Promise<void> => {
	const { page = 1 } = req.query;
	try {
		const response = await tmdbClient.get('/movie/now_playing', {
			params: {
				page,
			},
		});
		res.status(200).json({
			...response.data,
			message: 'Now playing movies fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching now playing movies:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

export const getMovieByIdController = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	try {
		const response = await tmdbClient.get(`/movie/${id}?append_to_response=videos,credits,reviews,images,external_ids,similar`);
		const omdbResponse = await omdbClient.get('/', {
			params: {
				i: response.data.imdb_id,
			},
		});

		// Retrieve feedback from database
		const watchedEntries = await Watched.find({
			movieId: parseInt(id),
		}).populate<{ user: { displayName: string } }>({
			path: 'user',
			select: 'displayName', // Only get user's display name
		});

		// Format feedback entries
		const feedback = watchedEntries
			.filter(entry =>
				entry.feedback.rating !== null ||
				entry.feedback.content !== null,
			)
			.map(entry => ({
				user: entry.user.displayName,
				rating: entry.feedback.rating,
				review: entry.feedback.content,
				createdAt: entry.feedback.createdAt,
				updatedAt: entry.feedback.updatedAt,
			}));

		// Send response with all data
		res.status(200).json({
			...response.data,
			omdb: omdbResponse.data.imdbID ? omdbResponse.data : undefined,
			feedback, // Include formatted feedback
			message: `Movie details fetched successfully`,
		});
	} catch (error) {
		console.error(`Error fetching movie with ID ${id}:`, error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

export const discoverMoviesController = async (req: Request, res: Response): Promise<void> => {
	try {
		// Flatten nested parameters for TMDB API
		const queryParams = { ...req.query };

		// Handle vote_average parameters
		if (req.query.vote_average) {
			const voteAverage = req.query.vote_average as Record<string, string>;
			if (voteAverage.gte) queryParams['vote_average.gte'] = voteAverage.gte;
			if (voteAverage.lte) queryParams['vote_average.lte'] = voteAverage.lte;
			delete queryParams.vote_average;
		}

		const response = await tmdbClient.get('/discover/movie', {
			params: queryParams,
		});

		res.status(200).json({
			...response.data,
			message: 'Movies matching filters fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching filtered movies:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Search movies by query
export const searchMoviesController = async (req: Request, res: Response): Promise<void> => {
	const { query, page = 1 } = req.query;

	try {
		const response = await tmdbClient.get('/search/movie', {
			params: {
				query,
				page,
			},
		});

		res.status(200).json({
			...response.data,
			message: `Movies matching query "${query}" fetched successfully`,
		});
	} catch (error) {
		console.error('Error searching movies:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};