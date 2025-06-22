import { Router } from 'express';
import {
	discoverMoviesController,
	discoverNowPlayingMoviesController,
	discoverPopularMoviesController,
	discoverTopRatedMoviesController,
	discoverUpcomingMoviesController,
	getMovieByIdController,
	searchMoviesController,
} from '../controllers/movieController';
import authenticate from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

// Define discover routes
router.get('/now_playing', discoverNowPlayingMoviesController);
router.get('/popular', discoverPopularMoviesController);
router.get('/top_rated', discoverTopRatedMoviesController);
router.get('/upcoming', discoverUpcomingMoviesController);
router.get('/search', searchMoviesController);
router.get('/discover', discoverMoviesController);
router.get('/:id', (req, _res, next) => {
	if (/^\d+$/.test(req.params.id)) return next();
}, getMovieByIdController);

export default router;