// src/middleware/logger.ts
import { NextFunction, Request, Response } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();
	console.log(`${req.method} ${req.path} - Request received`);

	// Log when response is sent
	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`${req.method} ${req.path} - Response: ${res.statusCode} (${duration}ms)`);
	});

	next();
};