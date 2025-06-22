import { tmdbClient } from '../services/movie_api';
import { Request, Response } from 'express';

export const getMovieGenresController = async (req: Request, res: Response): Promise<void> => {
	try {
		const genres = await tmdbClient.get(
			'/genre/movie/list',
		);
		res.status(200).json({
			...genres.data,
			message: 'Genres fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching genres:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};