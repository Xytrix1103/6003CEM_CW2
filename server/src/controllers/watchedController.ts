import { Request, Response } from 'express';
import User from '../models/User';
import Watched from '../models/Watched';

// Get watched entry for a movie
export const getWatchedEntry = async (req: Request, res: Response) => {
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

		const watchedEntry = await Watched.findOne({
			user: user._id,
			movieId: parseInt(movieId),
		}).select('-user -_id -__v');

		res.json(watchedEntry);
	} catch (error) {
		console.error('Error getting watched entry:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};

// Get all watched movies
export const getAllWatched = async (req: Request, res: Response) => {
	try {
		const { uid } = req.user;

		const user = await User.findOne({ firebaseUid: uid })
			.populate({
				path: 'watched',
				select: 'movieId isFavorited feedback -_id',
			})
			.select('watched -_id');

		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		res.json(user.watched || []);
	} catch (error) {
		console.error('Error getting watched movies:', error);
		res.status(500).json({ message: 'Something went wrong, please try again later' });
	}
};