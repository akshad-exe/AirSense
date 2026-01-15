import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/api';
import { findByApiKey } from '../services/device.service';
import logger from '../utils/logger';

/**
 * Middleware to authenticate device using API key
 */
export async function authenticateDevice(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Get API key from header or body
        const apiKey = req.headers['x-api-key'] as string || req.body.api_key;

        if (!apiKey) {
            res.status(401).json({
                success: false,
                error: 'API key required'
            });
            return;
        }

        // Find device by API key
        const device = findByApiKey(apiKey);

        if (!device) {
            logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 8)}...`);
            res.status(401).json({
                success: false,
                error: 'Invalid API key'
            });
            return;
        }

        // Attach device to request
        req.device = device;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
}
