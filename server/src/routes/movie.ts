import { Router } from 'express';
import {
	discoverNowPlayingMoviesController,
	discoverPopularMoviesController,
	discoverTopRatedMoviesController,
	discoverUpcomingMoviesController,
} from '../controllers/movie';

const router = Router();

// Define discover routes
router.get('/now_playing', discoverNowPlayingMoviesController);
router.get('/popular', discoverPopularMoviesController);
router.get('/top_rated', discoverTopRatedMoviesController);
router.get('/upcoming', discoverUpcomingMoviesController);

export default router;