import { omdbClient, tmdbClient } from '../services/movie_api';
import { Request, Response } from 'express';


export const discoverPopularMoviesController = async (req: Request, res: Response): Promise<void> => {
	const { page = 1 } = req.query;
	try {
		const response = await tmdbClient.get('/movie/popular', {
			params: {
				page,
			},
		});
		res.status(200).json(response.data);
	} catch (error) {
		console.error('Error fetching popular movies:', error);
		res.status(500).json({ error: 'Failed to fetch popular movies' });
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
		res.status(200).json(response.data);
	} catch (error) {
		console.error('Error fetching top-rated movies:', error);
		res.status(500).json({ error: 'Failed to fetch top-rated movies' });
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
		res.status(200).json(response.data);
	} catch (error) {
		console.error('Error fetching upcoming movies:', error);
		res.status(500).json({ error: 'Failed to fetch upcoming movies' });
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
		res.status(200).json(response.data);
	} catch (error) {
		console.error('Error fetching now playing movies:', error);
		res.status(500).json({ error: 'Failed to fetch now playing movies' });
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
		console.log('OMDB Response:', omdbResponse.data);
		res.status(200).json({
			...response.data,
			omdb: omdbResponse.data.imdbID ? omdbResponse.data : undefined,
		});
	} catch (error) {
		console.error(`Error fetching movie with ID ${id}:`, error);
		res.status(500).json({ error: `Failed to fetch movie with ID ${id}` });
	}
};