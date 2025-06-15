import tmdb from '../services/tmdb';
import { Request, Response } from 'express';


export const discoverPopularMoviesController = async (req: Request, res: Response): Promise<void> => {
	const { page = 1 } = req.query;
	try {
		const response = await tmdb.get('/movie/popular', {
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
		const response = await tmdb.get('/movie/top_rated', {
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
		const response = await tmdb.get('/movie/upcoming', {
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
		const response = await tmdb.get('/movie/now_playing', {
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

const appendBaseUrlToResult = (result: any, baseUrl: string): any => {
	if (result && result.results) {
		result.results = result.results.map((item: any) => {
			if (item.poster_path) {
				item.poster_path = `${baseUrl}${item.poster_path}`;
			}
			if (item.backdrop_path) {
				item.backdrop_path = `${baseUrl}${item.backdrop_path}`;
			}
			return item;
		});
	}
	return result;
};