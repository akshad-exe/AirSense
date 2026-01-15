import { Request, Response } from 'express';
import logger from '../utils/logger';

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response
): void {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Send error response
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
    _req: Request,
    res: Response
): void {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
}
