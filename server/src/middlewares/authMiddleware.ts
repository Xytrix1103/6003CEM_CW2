// src/middlewares/auth.ts
import { NextFunction, Request, Response } from 'express';
import { auth } from '../services/firebase_auth';

declare global {
	namespace Express {
		interface Request {
			user?: {
				uid: string;
				email?: string;
			};
		}
	}
}

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const authHeader = req.headers.authorization;

	console.log('Authorization header:', authHeader);

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({ message: 'User is unauthorized to access this resource' });
		return;
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = await auth.verifyIdToken(token);
		req.user = {
			uid: decoded.uid,
			email: decoded.email,
		};
		next();
	} catch (error) {
		res.status(401).json({ message: 'User token is invalid' });
		return;
	}
};

export default authenticate;