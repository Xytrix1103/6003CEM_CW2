import express from 'express';
import authenticate from '../middlewares/authMiddleware';
import { getAllWatched, getWatchedEntry } from '../controllers/watchedController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get watched entry for a specific movie
router.get('/:movieId', getWatchedEntry);

// Get all watched movies
router.get('/', getAllWatched);


export default router;