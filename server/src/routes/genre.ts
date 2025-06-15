import { Router } from 'express';
import { getMovieGenresController } from '../controllers/genre';

const router = Router();

// Define discover routes
router.get('/movie/list', getMovieGenresController);

export default router;