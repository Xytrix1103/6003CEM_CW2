// src/controllers/auth.ts
import { Request, Response } from 'express';
import { auth } from '../services/firebase_auth';
import User from '../models/User';
import mongoose from 'mongoose';

export const registerController = async (req: Request, res: Response): Promise<void> => {
	const { email, password, displayName } = req.body;
	let firebaseUser = null;
	let session = null;

	// Step 1: Create Firebase user
	try {
		firebaseUser = await auth.createUser({
			email,
			password,
			displayName,
		});

		session = await mongoose.startSession();
		session.startTransaction();

		const newUser = new User({
			firebaseUid: firebaseUser.uid,
			email,
			displayName,
		});

		await newUser.save({ session });
		// Add any other database operations here
		await session.commitTransaction();

		// create and return custom token
		const customToken = await auth.createCustomToken(firebaseUser.uid);

		res.status(201).json({
			token: customToken, // Return the custom token
			message: 'User registered successfully',
		});
	} catch (error) {
		console.error('Registration failed:', error);

		// Chain rollback operations
		let rollbackPromise = Promise.resolve();

		if (session) {
			rollbackPromise = rollbackPromise
				.then(() => session.abortTransaction())
				.catch(sessionError => {
					console.error('Error aborting transaction:', sessionError);
				});
		}

		if (firebaseUser !== null) {
			rollbackPromise = rollbackPromise
				.then(() => auth.deleteUser(firebaseUser.uid))
				.then(() => {
					console.log(`Firebase user ${firebaseUser.uid} deleted during rollback`);
				})
				.catch(fbError => {
					console.error('Error deleting Firebase user during rollback:', fbError);
				});
		}
		await rollbackPromise;
		res.status(500).json({ message: 'Registration failed' });
	} finally {
		if (session) {
			await session.endSession();
		}
	}
};