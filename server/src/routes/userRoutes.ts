import {
	addMovieFeedback,
	addToWatchlist,
	favoriteMovie,
	getMyProfile,
	getUserProfile,
	removeFromWatchlist,
	removeMovieFeedback,
	unfavoriteMovie,
	updateDisplayName,
	updateMovieFeedback,
} from '../controllers/userController';
import authenticate from '../middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.use(authenticate);

// Get user profile
router.get('/', getMyProfile);

// Update display name
router.patch('/name', updateDisplayName);

// Watchlist routes
router.post('/watchlist', addToWatchlist);
router.delete('/watchlist/:movieId', removeFromWatchlist);

// Favorite routes
router.post('/favorites', favoriteMovie);
router.delete('/favorites/:movieId', unfavoriteMovie); // Add this

// Feedback routes
router.post('/feedback', addMovieFeedback); // Create feedback
router.put('/feedback/:movieId', updateMovieFeedback); // Update feedback
router.delete('/feedback/:movieId', removeMovieFeedback); // Remove feedback

router.get('/uid/:userId', getUserProfile);


export default router;
