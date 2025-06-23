import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Watched, { IWatched } from '../models/Watched';
import { tmdbClient } from '../services/movie_api';
import { Types } from 'mongoose';
import Visit, { IVisit } from '../models/Visit';

// Helper function to fetch movie details in batches
const fetchMovieDetails = async (movieIds: number[]) => {
	const MAX_CONCURRENT = 10;
	const movieDetails: any[] = [];

	for (let i = 0; i < movieIds.length; i += MAX_CONCURRENT) {
		const batch = movieIds.slice(i, i + MAX_CONCURRENT);
		const promises = batch.map(id =>
			tmdbClient.get(`/movie/${id}`)
				.then(res => res.data)
				.catch(e => {
					console.error(`Error fetching movie ${id}:`, e.message);
					return null;
				}),
		);

		const results = await Promise.all(promises);
		movieDetails.push(...results.filter(movie => movie !== null));
	}

	return movieDetails;
};

// Update display name
export const updateDisplayName = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { displayName } = req.body;

		if (!displayName || displayName.trim().length < 2) {
			res.status(400).json({ message: 'Display name must be at least 2 characters' });
		}

		const updatedUser = await User.findOneAndUpdate(
			{ firebaseUid: uid },
			{ displayName: displayName.trim() },
			{ new: true, runValidators: true },
		);

		if (!updatedUser) {
			res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json({
			message: 'Display name updated successfully',
			displayName: updatedUser.displayName,
		});
	} catch (error) {
		console.error('Error updating display name:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Add to watchlist
export const addToWatchlist = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { movieId } = req.body;

		if (!movieId || isNaN(movieId)) {
			res.status(400).json({ message: 'Invalid movie ID' });
		}

		const user = await User.findOneAndUpdate(
			{ firebaseUid: uid },
			{ $addToSet: { watchlist: movieId } },
			{ new: true },
		);

		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		res.json({
			message: 'Movie added to watchlist successfully',
			watchlist: user.watchlist,
		});
	} catch (error) {
		console.error('Error adding to watchlist:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Remove from watchlist
export const removeFromWatchlist = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { movieId } = req.params;

		if (!movieId || isNaN(parseInt(movieId))) {
			res.status(400).json({ message: 'Invalid movie ID' });
		}

		const user = await User.findOneAndUpdate(
			{ firebaseUid: uid },
			{ $pull: { watchlist: parseInt(movieId) } },
			{ new: true },
		);

		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		res.json({
			message: 'Movie removed from watchlist successfully',
			watchlist: user.watchlist,
		});
	} catch (error) {
		console.error('Error removing from watchlist:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Favorite a movie (creates watched entry if needed)
export const favoriteMovie = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { movieId } = req.body;

		if (!movieId || isNaN(movieId)) {
			res.status(400).json({ message: 'Invalid movie ID' });
		}

		// Find user to get their ID
		const user = await User.findOne({ firebaseUid: uid });
		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		// Create or update watched entry
		const watchedEntry = await Watched.findOneAndUpdate(
			{ user: user._id, movieId },
			{ isFavorited: true },
			{ upsert: true, new: true, runValidators: true },
		);

		// Add to user's watched references if new entry
		if (!user.watched.includes(watchedEntry._id)) {
			await User.findByIdAndUpdate(user._id, {
				$addToSet: { watched: watchedEntry._id },
			});
		}

		res.json({
			message: 'Movie added to favorites successfully',
			isFavorited: watchedEntry.isFavorited,
		});
	} catch (error) {
		console.error('Error favoriting movie:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Add rating/review (creates watched entry if needed)
export const addMovieFeedback = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { movieId, rating, content } = req.body;

		if (!movieId || isNaN(movieId)) {
			res.status(400).json({ message: 'Invalid movie ID' });
		}

		if (rating && (rating < 0 || rating > 5)) {
			res.status(400).json({ message: 'Rating must be between 0-5' });
		}

		// Find user to get their ID
		const user = await User.findOne({ firebaseUid: uid });
		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		// Prepare feedback object
		const feedback: any = {
			updatedAt: new Date(),
		};

		if (rating !== undefined) feedback.rating = rating;
		if (content !== undefined) feedback.content = content;

		// Create or update watched entry with feedback
		const watchedEntry = await Watched.findOneAndUpdate(
			{ user: user._id, movieId },
			{
				feedback: {
					...feedback,
					createdAt: feedback.createdAt || new Date(),
				},
			},
			{
				upsert: true,
				new: true,
				runValidators: true,
				setDefaultsOnInsert: true,
			},
		);

		// Add to user's watched references if new entry
		if (!user.watched.includes(watchedEntry._id)) {
			await User.findByIdAndUpdate(user._id, {
				$addToSet: { watched: watchedEntry._id },
			});
		}

		res.json({
			message: 'Review and rating submitted successfully',
			feedback: watchedEntry.feedback,
		});
	} catch (error) {
		console.error('Error adding feedback:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Unfavorite a movie
export const unfavoriteMovie = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { movieId } = req.params;

		if (!movieId || isNaN(parseInt(movieId))) {
			res.status(400).json({ message: 'Invalid movie ID' });
		}

		const user = await User.findOne({ firebaseUid: uid });
		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		const watchedEntry = await Watched.findOneAndUpdate(
			{ user: user._id, movieId },
			{ isFavorited: false },
			{ new: true },
		);

		if (!watchedEntry) {
			res.status(404).json({ message: 'Movie not found in watched list' });
		}

		res.json({
			message: 'Movie removed from favorites successfully',
			isFavorited: watchedEntry.isFavorited,
		});
	} catch (error) {
		console.error('Error unfavoriting movie:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Update rating/review
export const updateMovieFeedback = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { movieId } = req.params;
		const { rating, content } = req.body;

		if (!movieId || isNaN(parseInt(movieId))) {
			res.status(400).json({ message: 'Invalid movie ID' });
		}

		if (rating && (rating < 0 || rating > 5)) {
			res.status(400).json({ message: 'Rating must be between 0-5' });
		}

		const user = await User.findOne({ firebaseUid: uid });
		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		// Check if watched entry exists
		const existingEntry = await Watched.findOne({
			user: user._id,
			movieId,
		});

		if (!existingEntry) {
			res.status(404).json({
				message: 'Movie not watched. Add to watched first.',
			});
		}

		// Prepare update object
		const update: any = {
			'feedback.updatedAt': new Date(),
		};

		if (rating !== undefined) {
			update['feedback.rating'] = rating;
		}

		if (content !== undefined) {
			update['feedback.content'] = content;
		}

		const watchedEntry = await Watched.findOneAndUpdate(
			{ user: user._id, movieId },
			{ $set: update },
			{ new: true, runValidators: true },
		);

		res.json({
			message: 'Review and rating updated successfully',
			feedback: watchedEntry.feedback,
		});
	} catch (error) {
		console.error('Error updating feedback:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Remove rating/review
export const removeMovieFeedback = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;
		const { movieId } = req.params;

		if (!movieId || isNaN(parseInt(movieId))) {
			res.status(400).json({ message: 'Invalid movie ID' });
		}

		const user = await User.findOne({ firebaseUid: uid });
		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		const watchedEntry = await Watched.findOneAndUpdate(
			{ user: user._id, movieId },
			{
				$set: {
					'feedback.rating': null,
					'feedback.content': null,
					'feedback.updatedAt': new Date(),
				},
			},
			{ new: true },
		);

		if (!watchedEntry) {
			res.status(404).json({ message: 'Movie not found in watched list' });
		}

		res.json({
			message: 'Review and rating removed successfully',
			feedback: watchedEntry.feedback,
		});
	} catch (error) {
		console.error('Error removing feedback:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Get user profile
export const getMyProfile = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;

		const user = await User.findOne({ firebaseUid: uid })
			.populate<{
				watched: IWatched[],
				visits: Array<IVisit & { visitor: IUser }>
			}>([
				// Populate watched movies
				{
					path: 'watched',
					select: 'movieId isFavorited feedback createdAt _id',
				},
				// Populate visits and nested visitor
				{
					path: 'visits',
					options: { sort: { visitedAt: -1 }, limit: 20 }, // Get latest 20 visits
					populate: {
						path: 'visitor',
						select: 'displayName createdAt', // Select fields from visitor
					},
				},
			])
			.orFail()
			.select('-firebaseUid -__v');

		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		// Fetch movie details for watched movies and watchlist
		const watchedMovieIds = user.watched.map((w) => Number(w.movieId));
		const watchListMovieIds = user.watchlist;
		const allMovieIds = [...new Set([...watchedMovieIds, ...watchListMovieIds])];

		const movieDetails = await fetchMovieDetails(allMovieIds);

		res.json({
			...user.toObject(),
			movies: movieDetails,
		});
	} catch (error) {
		console.error('Error getting user profile:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Get another user's profile (without sensitive data)
export const getUserProfile = async (req: Request, res: Response) => {
	try {
		const { uid: currentUserId } = req.user;
		const { userId } = req.params;

		if (!Types.ObjectId.isValid(userId)) {
			res.status(400).json({ message: 'Invalid user ID' });
		}

		const user = await User.findById(userId)
			.populate<{
				watched: IWatched[]
			}>({
				path: 'watched',
				select: 'movieId isFavorited feedback createdAt _id',
			})
			.select('-firebaseUid -__v -visits') // Exclude sensitive data
			.orFail();

		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		const currentUser = await User.findOne({
			firebaseUid: currentUserId,
		}).select('_id displayName');

		if (!currentUser) {
			res.status(404).json({ message: 'Current user not found' });
		}

		// Record visit if different user
		if (user._id.toString() !== currentUser._id.toString()) {
			const visit = new Visit({
				visitor: currentUser._id,
				visitedUser: user._id,
			});
			await visit.save();

			// Update user document in database instead of modifying local object
			await User.findByIdAndUpdate(user._id, {
				$push: { visits: visit._id },
			});
		}

		// Fetch movie details
		const watchedMovieIds = user.watched.map((w) => Number(w.movieId));
		const watchListMovieIds = user.watchlist;
		const allMovieIds = [...new Set([...watchedMovieIds, ...watchListMovieIds])];
		const movieDetails = await fetchMovieDetails(allMovieIds);

		res.json({
			...user.toObject(),
			movies: movieDetails,
		});
	} catch (error) {
		console.error('Error getting user profile:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};
