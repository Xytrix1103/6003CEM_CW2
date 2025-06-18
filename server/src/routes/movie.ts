import { Router } from 'express';
import {
	discoverNowPlayingMoviesController,
	discoverPopularMoviesController,
	discoverTopRatedMoviesController,
	discoverUpcomingMoviesController,
	getMovieByIdController,
} from '../controllers/movie';

const router = Router();

// Define discover routes
router.get('/now_playing', discoverNowPlayingMoviesController);
router.get('/popular', discoverPopularMoviesController);
router.get('/top_rated', discoverTopRatedMoviesController);
router.get('/upcoming', discoverUpcomingMoviesController);
router.get('/:id', (req, res, next) => {
	if (/^\d+$/.test(req.params.id)) {
		return next();
	}
}, getMovieByIdController);

export default router;