// src/middlewares/errorHandler.ts
import { NextFunction, Request, Response } from 'express';

// Error handler middleware
const errorHandlerMiddleware = (
	err: Error,
	_req: Request,
	_res: Response,
	_next: NextFunction,
): void => {
	console.error(`Error: ${err.message}`);
	console.error(err.stack);
};

export default errorHandlerMiddleware;