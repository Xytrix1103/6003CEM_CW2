import { Router } from 'express';
import { getMovieGenresController } from '../controllers/genreController';
import authenticate from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

// Define discover routes
router.get('/movie/list', getMovieGenresController);

export default router;