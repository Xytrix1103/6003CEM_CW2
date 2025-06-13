// src/middlewares/errorHandler.ts
import {NextFunction, Request, Response} from 'express';

// Custom error class with status code
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Common error classes
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access') {
        super(message, 403);
    }
}

export class ValidationError extends AppError {
    errors: Record<string, string>;

    constructor(message = 'Validation failed', errors: Record<string, string> = {}) {
        super(message, 400);
        this.errors = errors;
    }
}

// Error handler middleware
const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);

    // Default values
    let statusCode = 500;
    let message = 'Something went wrong';
    let errors = {};

    // Handle AppError instances
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;

        if (err instanceof ValidationError) {
            errors = err.errors;
        }
    }
    // Handle Mongoose validation errors
    else if (err.name === 'ValidationError' && typeof err === 'object' && err !== null) {
        statusCode = 400;
        message = 'Validation error';
        // @ts-ignore: Handle mongoose error format
        errors = Object.keys(err.errors || {}).reduce((acc, key) => {
            // @ts-ignore: Handle mongoose error format
            acc[key] = err.errors[key].message;
            return acc;
        }, {});
    }
    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    // Send standardized error response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        ...(Object.keys(errors).length > 0 && {errors}),
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    });
};

export default errorHandler;