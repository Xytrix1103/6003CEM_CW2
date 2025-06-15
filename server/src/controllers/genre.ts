import tmdb from '../services/tmdb';
import { Request, Response } from 'express';

export const getMovieGenresController = async (req: Request, res: Response): Promise<void> => {
	try {
		const genres = await tmdb.get(
			'/genre/movie/list',
		);
		res.status(200).json(genres.data);
	} catch (error) {
		console.error('Error fetching genres:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};